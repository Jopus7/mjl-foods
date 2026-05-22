import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const sendOrder = async () => {
    const response = await fetch('https://api.twoja-restauracja.pl/order', {
      method: 'POST',
      body: JSON.stringify({ address, promoCode, items: [] }),
    });

    const result = await response.json();
    if (response.ok) {
      navigate('/status', {
        state: { deliveryTime: result.estimatedDeliveryTime },
      });
    } else {
      alert('Błąd zamówienia');
    }
  };

  return (
    <div className={styles['checkout-container']}>
      <span className={styles['hero-eyebrow']}>Krok 2 z 3</span>
      <h2>Dane do wysyłki</h2>
      <input
        placeholder="Adres zamieszkania"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        placeholder="Kod rabatowy (opcjonalnie)"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
      />
      <button onClick={sendOrder}>Zamów i zapłać →</button>
    </div>
  );
};

export default Checkout;
