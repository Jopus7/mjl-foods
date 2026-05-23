import { useNavigate, Link } from 'react-router-dom';
import styles from './Cart.module.css';
import { useCartSummary } from '../../hooks/useCartSummary';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    promoCode,
    discount,
    promoError,
    total,
    discountedTotal,
    handleApplyPromo,
    handlePromoChange,
  } = useCartSummary();

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
          <div className={styles['promo-wrapper']}>
            <div className={styles['promo-section']}>
              <div className={styles['input-container']}>
                <input
                  type="text"
                  placeholder="Wpisz kod rabatowy"
                  value={promoCode}
                  onChange={(e) => handlePromoChange(e.target.value)}
                  className={`${styles['promo-input']} ${promoError ? styles['input-error'] : ''}`}
                />
                {promoError && (
                  <span className={styles['error-text']}>{promoError}</span>
                )}
              </div>
              <button
                onClick={handleApplyPromo}
                className={styles['promo-button']}
              >
                Zastosuj
              </button>
            </div>
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
            <button
              onClick={() =>
                navigate('/checkout', { state: { promoCode, discount } })
              }
            >
              Przejdź dalej →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
