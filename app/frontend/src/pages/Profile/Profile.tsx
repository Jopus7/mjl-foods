import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faChevronRight,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useOrders, Order } from '../../hooks/useOrders';
import styles from './Profile.module.css';

const statusLabel = (status: Order['status']) => {
  switch (status) {
    case 'delivered':
      return 'Dostarczone';
    case 'in_progress':
      return 'W realizacji';
    case 'cancelled':
      return 'Anulowane';
  }
};

const statusClass = (status: Order['status']) => {
  switch (status) {
    case 'delivered':
      return styles['status-delivered'];
    case 'in_progress':
      return styles['status-progress'];
    case 'cancelled':
      return styles['status-cancelled'];
  }
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const Profile = () => {
  const { logout } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [realUser, setRealUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        setRealUser(data);
      } catch {
        localStorage.removeItem('token');
        logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, logout]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className={styles['profile-container']}>Ładowanie...</div>;
  }

  if (!realUser) {
    return null;
  }

  return (
    <div className={styles['profile-container']}>
      <div className={styles['profile-header']}>
        <div className={styles['avatar']}>
          {realUser.firstName[0]}
          {realUser.lastName[0]}
        </div>
        <div className={styles['user-info']}>
          <h1 className={styles['user-name']}>
            {realUser.firstName} {realUser.lastName}
          </h1>
          <div className={styles['user-meta']}>
            <span className={styles['user-meta-item']}>
              <FontAwesomeIcon icon={faEnvelope} />
              {realUser.email}
            </span>
          </div>
        </div>
        <button className={styles['logout-button']} onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Wyloguj</span>
        </button>
      </div>

      <div className={styles['stats-grid']}>
        <div className={styles['stat-card']}>
          <span className={styles['stat-num']}>{orders.length}</span>
          <span className={styles['stat-label']}>Wszystkich zamówień</span>
        </div>
        <div className={styles['stat-card']}>
          <span className={styles['stat-num']}>
            {orders.filter((o) => o.status === 'delivered').length}
          </span>
          <span className={styles['stat-label']}>Dostarczonych</span>
        </div>
        <div className={styles['stat-card']}>
          <span className={styles['stat-num']}>
            {orders.reduce((acc, o) => acc + o.total, 0)} zł
          </span>
          <span className={styles['stat-label']}>Łącznie wydane</span>
        </div>
      </div>

      <div className={styles['orders-section']}>
        <h2 className={styles['section-title']}>
          Historia <em>zamówień</em>
        </h2>
        <ul className={styles['order-list']}>
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                to={`/profile/orders/${order.id}`}
                className={styles['order-row']}
              >
                <div className={styles['order-main']}>
                  <div className={styles['order-id']}>{order.id}</div>
                  <div className={styles['order-date']}>
                    {formatDate(order.date)}
                  </div>
                </div>
                <div className={styles['order-items-count']}>
                  {order.items.length}{' '}
                  {order.items.length === 1 ? 'pozycja' : 'pozycji'}
                </div>
                <div
                  className={`${styles['order-status']} ${statusClass(order.status)}`}
                >
                  {statusLabel(order.status)}
                </div>
                <div className={styles['order-total']}>{order.total} zł</div>
                <div className={styles['order-chevron']}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
