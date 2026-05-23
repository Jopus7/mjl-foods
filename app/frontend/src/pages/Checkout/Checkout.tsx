import styles from './Checkout.module.css';
import { useCheckout } from '../../hooks/useCheckout';

const Checkout = () => {
  const {
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
  } = useCheckout();

  return (
    <div className={styles['checkout-container']}>
      <span className={styles['hero-eyebrow']}>Krok 2 z 3</span>
      <h2>Dane zamówienia</h2>

      <div className={styles['method-selector']}>
        <button
          className={deliveryMethod === 'delivery' ? styles.active : ''}
          onClick={() => {
            setDeliveryMethod('delivery');
            setErrors({});
          }}
        >
          Dostawa
        </button>
        <button
          className={deliveryMethod === 'pickup' ? styles.active : ''}
          onClick={() => {
            setDeliveryMethod('pickup');
            setErrors({});
          }}
        >
          Odbiór osobisty
        </button>
      </div>

      <div className={styles['form-grid']}>
        <div className={styles['input-group']}>
          <input
            placeholder="Imię i nazwisko"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? styles['input-error'] : ''}
          />
          {errors.name && (
            <span className={styles['error-text']}>{errors.name}</span>
          )}
        </div>

        <div className={styles['input-group']}>
          <input
            placeholder="Numer telefonu"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? styles['input-error'] : ''}
          />
          {errors.phone && (
            <span className={styles['error-text']}>{errors.phone}</span>
          )}
        </div>

        {deliveryMethod === 'delivery' && (
          <>
            <div className={`${styles['input-group']} ${styles['full-width']}`}>
              <input
                placeholder="Ulica"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className={errors.street ? styles['input-error'] : ''}
              />
              {errors.street && (
                <span className={styles['error-text']}>{errors.street}</span>
              )}
            </div>

            <div className={styles['input-group']}>
              <input
                placeholder="Nr budynku"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className={errors.building ? styles['input-error'] : ''}
              />
              {errors.building && (
                <span className={styles['error-text']}>{errors.building}</span>
              )}
            </div>

            <div className={styles['input-group']}>
              <input
                placeholder="Nr lokalu (opcjonalnie)"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
              />
            </div>

            <div className={`${styles['input-group']} ${styles['full-width']}`}>
              <input
                placeholder="Miasto"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={errors.city ? styles['input-error'] : ''}
              />
              {errors.city && (
                <span className={styles['error-text']}>{errors.city}</span>
              )}
            </div>
          </>
        )}
      </div>

      <button className={styles['submit-btn']} onClick={sendOrder}>
        Zamów i zapłać →
      </button>
    </div>
  );
};

export default Checkout;
