import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>(
    'delivery'
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

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

  const sendOrder = async () => {
    if (!validate()) return;

    try {
      const orderData = {
        deliveryMethod,
        name,
        phone,
        ...(deliveryMethod === 'delivery' && {
          street,
          building,
          apartment,
          city,
        }),
        items: [],
      };

      const response = await fetch('https://api.twoja-restauracja.pl/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        navigate('/status', {
          state: {
            deliveryTime:
              result.estimatedDeliveryTime ||
              new Date(Date.now() + 45 * 60000).toISOString(),
          },
        });
      } else {
        navigate('/failed');
      }
    } catch (error) {
      navigate('/failed');
    }
  };

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
