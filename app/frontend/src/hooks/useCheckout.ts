import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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
  street?: string;
  building?: string;
  city?: string;
}

interface OrderResponseData {
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

  const promoCode = state?.promoCode || '';

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>(
    'delivery'
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<CheckoutErrors>({});

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
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const fullAddress =
        deliveryMethod === 'delivery'
          ? `${street} ${building}${apartment ? '/' + apartment : ''}`
          : 'Odbiór osobisty';

      const orderData = {
        customer: {
          firstName,
          lastName,
          phone,
          email: 'klient@example.com',
          address: fullAddress,
          postalCode: '00-000',
          city: deliveryMethod === 'delivery' ? city : 'Warszawa',
        },
        comment: `Metoda dostawy: ${deliveryMethod}`,
        promoCode: promoCode || null,
        items: cart.map((item) => ({
          productId: item.id || item.cartItemId,
          quantity: 1,
        })),
      };

      const response = await fetch('http://127.0.0.1:8000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = (await response.json()) as OrderResponseData;
        clearCart();
        navigate('/status', {
          state: {
            deliveryTime: result.estimatedDeliveryTime,
          },
        });
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
