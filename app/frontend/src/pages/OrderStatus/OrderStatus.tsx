import styles from './OrderStatus.module.css';
import { useOrderStatus } from '../../hooks/useOrderStatus';

const OrderStatus = () => {
  const { isSuccess, timeLeft } = useOrderStatus();

  return (
    <div className={styles['status-container']}>
      <h1>{isSuccess ? 'Zamówienie przyjęte!' : 'Coś poszło nie tak.'}</h1>
      {isSuccess && (
        <div className={styles['timer-box']}>
          <p>Czas do dostawy</p>
          <h2>{timeLeft}</h2>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
