import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Cart.module.css';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const total = cart.reduce((acc, item) => acc + item.price, 0);
  const discountedTotal = total - total * discount;

  const handleApplyPromo = () => {
    if (promoCode === 'promo123') {
      setDiscount(0.2);
    } else {
      setDiscount(0);
    }
  };

  return (
    <div className={styles['cart-container']}>
      <h1>Twój koszyk</h1>

      <div className={styles['cart-list']}>
        {cart.length === 0 ? (
          <div className={styles['cart-empty']}>
            <span className={styles.emoji} aria-hidden="true">
              🍽️
            </span>
            <p>Koszyk jest pusty.</p>
            <Link
              to="/menu"
              className={styles['hero-cta']}
              style={{ marginTop: 12 }}
            >
              Zobacz menu <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.cartItemId} className={styles['cart-row']}>
              <span>{item.name}</span>
              <div>
                <span style={{ marginRight: '16px' }}>{item.price} zł</span>
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  style={{ color: 'red', fontWeight: 'bold' }}
                >
                  X
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <>
          <div className={styles['promo-section']}>
            <input
              type="text"
              placeholder="Wpisz kod rabatowy"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className={styles['promo-input']}
            />
            <button
              onClick={handleApplyPromo}
              className={styles['promo-button']}
            >
              Zastosuj
            </button>
          </div>

          <div className={styles.summary}>
            <h3>
              Suma:
              {discount > 0 && (
                <span className={styles['old-price']}>
                  {total.toFixed(2)} zł
                </span>
              )}
              <em>{discountedTotal.toFixed(2)} zł</em>
            </h3>
            <button onClick={() => navigate('/checkout')}>
              Przejdź dalej →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
