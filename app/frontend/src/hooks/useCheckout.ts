import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../../../config';

interface LocationState {
  promoCode?: string;
  discount?: number;
}

interface CartItem {
  id?: number;
  cartItemId: number;
  name: string;
  price: number;
}

interface CheckoutErrors {
  name?: string;
  phone?: string;
  email?: string;
  street?: string;
  building?: string;
  city?: string;
}

interface OrderResponseData {
  orderId: string;
  estimatedDeliveryTime: string;
}

export const useCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { cart, clearCart } = useCart() as unknown as {
    cart: CartItem[];
    clearCart: () => void;
  };
  const { user } = useAuth();

  const promoCode = state?.promoCode || '';

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>(
    'delivery'
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<CheckoutErrors>({});

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const validate = (): boolean => {
    const newErrors: CheckoutErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Imię i nazwisko jest wymagane';
    }

    const phoneRegex = /^[0-9]{9}$/;
    const cleanedPhone = phone.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      newErrors.phone = 'Podaj poprawny 9-cyfrowy numer telefonu';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Adres e-mail jest wymagany';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Podaj poprawny adres e-mail';
    }

    if (deliveryMethod === 'delivery') {
      if (!street.trim()) newErrors.street = 'Ulica jest wymagana';

      const buildingRegex = /^[0-9]+$/;
      if (!building.trim()) {
        newErrors.building = 'Nr budynku jest wymagany';
      } else if (!buildingRegex.test(building.trim())) {
        newErrors.building = 'Nr budynku musi być liczbą';
      }

      if (!city.trim()) newErrors.city = 'Miasto jest wymagane';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOrder = async (): Promise<void> => {
    if (!validate()) return;

    try {
      const fullAddress =
        deliveryMethod === 'delivery'
          ? `${street} ${building}${apartment ? '/' + apartment : ''}`
          : 'Odbiór osobisty';

      const orderData = {
        customer: {
          firstName: name,
          phone,
          email: email.trim(),
          address: fullAddress,
          city: deliveryMethod === 'delivery' ? city : 'Warszawa',
        },
        comment: `Metoda dostawy: ${deliveryMethod}`,
        promoCode: promoCode || null,
        items: cart.map((item) => ({
          productId: item.id || item.cartItemId,
          quantity: 1,
        })),
      };

      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result: OrderResponseData = await response.json();

        const stripeResponse = await fetch(
          `${API_BASE_URL}/create-checkout-session`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email.trim(),
              orderId: result.orderId,
              estimatedDeliveryTime: result.estimatedDeliveryTime,
              items: cart.map((item) => ({
                productId: item.id || item.cartItemId,
                quantity: 1,
              })),
            }),
          }
        );

        const stripeResult = await stripeResponse.json();

        if (stripeResponse.ok) {
          clearCart();
          sessionStorage.setItem(
            'deliveryTime',
            JSON.stringify(result.estimatedDeliveryTime)
          );
          window.location.href = stripeResult.checkoutUrl;
        } else {
          navigate('/failed');
        }
      } else {
        navigate('/failed');
      }
    } catch (error) {
      navigate('/failed');
    }
  };

  return {
    deliveryMethod,
    setDeliveryMethod,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    street,
    setStreet,
    building,
    setBuilding,
    apartment,
    setApartment,
    city,
    setCity,
    errors,
    setErrors,
    sendOrder,
  };
};
