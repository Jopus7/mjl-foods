import { useState } from 'react';
import { useCart } from '../context/CartContext';

export const useCartSummary = () => {
  const { cart, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const total = cart.reduce((acc, item) => acc + item.price, 0);
  const discountedTotal = total - total * discount;

  const handleApplyPromo = () => {
    if (promoCode === 'promo123') {
      setDiscount(0.2);
      setPromoError('');
    } else {
      setDiscount(0);
      setPromoError('Niepoprawny kod rabatowy');
    }
  };

  const handlePromoChange = (value: string) => {
    setPromoCode(value);
    if (promoError) setPromoError('');
  };

  return {
    cart,
    removeFromCart,
    promoCode,
    discount,
    promoError,
    total,
    discountedTotal,
    handleApplyPromo,
    handlePromoChange,
  };
};
