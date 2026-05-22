import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './OrderStatus.module.css';

const OrderStatus = () => {
  const { state } = useLocation();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!state?.deliveryTime) return;

    const timer = setInterval(() => {
      const delivery = new Date(state.deliveryTime).getTime();
      const now = new Date().getTime();
      const diff = delivery - now;

      if (diff <= 0) {
        setTimeLeft('Dostarczono!');
        clearInterval(timer);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [state]);

  return (
    <div className={styles['status-container']}>
      <h1>{state ? 'Zamówienie przyjęte!' : 'Coś poszło nie tak.'}</h1>
      {state && (
        <div className={styles['timer-box']}>
          <p>Czas do dostawy</p>
          <h2>{timeLeft}</h2>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
