import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLocationDot, faCalendar, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { useOrderById, Order } from '../../hooks/useOrders';
import styles from './Profile.module.css';

const statusLabel = (status: Order['status']) => {
  switch (status) {
    case 'delivered':   return 'Dostarczone';
    case 'in_progress': return 'W realizacji';
    case 'cancelled':   return 'Anulowane';
  }
};

const statusClass = (status: Order['status']) => {
  switch (status) {
    case 'delivered':   return styles['status-delivered'];
    case 'in_progress': return styles['status-progress'];
    case 'cancelled':   return styles['status-cancelled'];
  }
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' });

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { order } = useOrderById(id);

  if (!order) {
    return (
      <div className={styles['profile-container']}>
        <Link to="/profile" className={styles['back-link']}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Wróć do profilu
        </Link>
        <div className={styles['empty-state']}>
          <FontAwesomeIcon icon={faReceipt} className={styles['empty-icon']} />
          <h2>Nie znaleziono zamówienia</h2>
          <p>To zamówienie nie istnieje albo zostało usunięte.</p>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={styles['profile-container']}>
      <Link to="/profile" className={styles['back-link']}>
        <FontAwesomeIcon icon={faArrowLeft} />
        Wróć do historii
      </Link>

      <div className={styles['order-header']}>
        <div>
          <span className={styles['order-detail-eyebrow']}>Zamówienie</span>
          <h1 className={styles['order-detail-id']}>{order.id}</h1>
        </div>
        <div className={`${styles['order-status']} ${statusClass(order.status)} ${styles['order-status-large']}`}>
          {statusLabel(order.status)}
        </div>
      </div>

      <div className={styles['order-meta-grid']}>
        <div className={styles['order-meta-card']}>
          <FontAwesomeIcon icon={faCalendar} className={styles['order-meta-icon']} />
          <div>
            <div className={styles['order-meta-label']}>Data zamówienia</div>
            <div className={styles['order-meta-value']}>{formatDate(order.date)}</div>
          </div>
        </div>
        <div className={styles['order-meta-card']}>
          <FontAwesomeIcon icon={faLocationDot} className={styles['order-meta-icon']} />
          <div>
            <div className={styles['order-meta-label']}>Adres dostawy</div>
            <div className={styles['order-meta-value']}>{order.address}</div>
          </div>
        </div>
      </div>

      <div className={styles['items-card']}>
        <h2 className={styles['items-title']}>Pozycje zamówienia</h2>
        <ul className={styles['items-list']}>
          {order.items.map((item) => (
            <li key={item.id} className={styles['item-row']}>
              <div className={styles['item-main']}>
                <span className={styles['item-quantity']}>{item.quantity}×</span>
                <div className={styles['item-name-wrap']}>
                  <div className={styles['item-name']}>{item.name}</div>
                  <div className={styles['item-unit-price']}>{item.price} zł / szt.</div>
                </div>
              </div>
              <div className={styles['item-total']}>{item.price * item.quantity} zł</div>
            </li>
          ))}
        </ul>

        <div className={styles['items-summary']}>
          <div className={styles['summary-row']}>
            <span>Suma częściowa</span>
            <span>{subtotal} zł</span>
          </div>
          <div className={styles['summary-row']}>
            <span>Dostawa</span>
            <span>0 zł</span>
          </div>
          <div className={`${styles['summary-row']} ${styles['summary-total']}`}>
            <span>Razem</span>
            <span>{order.total} zł</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
