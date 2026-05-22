import { Link } from 'react-router-dom';
import styles from './OrderFailed.module.css';

const OrderFailed = () => {
  return (
    <div className={styles['failed-container']}>
      <h1>Wystąpił błąd</h1>

      <div className={styles['error-box']}>
        <p>Niestety, nie udało się przetworzyć Twojego zamówienia online.</p>
        <h2>
          Zadzwoń do nas: <br />
          <span>+48 123 456 789</span>
        </h2>
        <p>
          Przepraszamy za niedogodności. Nasi pracownicy chętnie przyjmą Twoje
          zamówienie telefonicznie.
        </p>
      </div>

      <Link to="/cart" className={styles['back-btn']}>
        Wróć do koszyka
      </Link>
    </div>
  );
};

export default OrderFailed;
