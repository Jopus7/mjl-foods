import styles from './OrderStatus.module.css';
import { useOrderStatus } from '../../hooks/useOrderStatus';

const OrderStatus = () => {
  const { timeLeft } = useOrderStatus();

  return (
    <div className={styles['status-container']}>
      <h1>Zamówienie przyjęte!</h1>
      <div className={styles['timer-box']}>
        <p>Czas do dostawy</p>
        <h2>{timeLeft}</h2>
      </div>
    </div>
  );
};

export default OrderStatus;
