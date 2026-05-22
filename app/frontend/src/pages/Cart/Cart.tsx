import { useNavigate, Link } from 'react-router-dom';
import styles from './Cart.module.css';

const Cart = () => {
  const navigate = useNavigate();
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cartItems.reduce(
    (acc: number, item: any) => acc + item.price,
    0
  );

  return (
    <div className={styles['cart-container']}>
      <h1>Twój koszyk</h1>

      <div className={styles['cart-list']}>
        {cartItems.length === 0 ? (
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
          cartItems.map((item: any, index: number) => (
            <div key={index} className={styles['cart-row']}>
              <span>{item.name}</span>
              <span>{item.price} zł</span>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className={styles.summary}>
          <h3>
            Suma: <em>{total} zł</em>
          </h3>
          <button onClick={() => navigate('/checkout')}>Przejdź dalej →</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
