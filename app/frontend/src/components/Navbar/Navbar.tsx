import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping,
  faHouse,
  faUtensils,
  faInfoCircle,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import logo2 from '../../assets/logo2.png';
import styles from './Navbar.module.css';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles['navbar-container']}>
          <Link
            to="/"
            className={styles['navbar-logo']}
            aria-label="MJL Foods — strona główna"
          >
            <img
              src={logo2}
              alt="MJL Foods"
              style={{ mixBlendMode: 'multiply' }}
            />
          </Link>

          <ul className={styles['nav-menu']}>
            <li className={styles['nav-item']}>
              <Link to="/" className={styles['nav-links']}>
                Home
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link to="/menu" className={styles['nav-links']}>
                Menu
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link to="/about" className={styles['nav-links']}>
                O nas
              </Link>
            </li>
          </ul>

          <div className={styles['nav-actions']}>
            <Link
              to="/profile"
              className={styles['profile-button']}
              aria-label="Mój profil"
            >
              <FontAwesomeIcon icon={faUser} />
            </Link>

            <div className={styles['nav-cart']}>
              <Link to="/cart" className={styles['cart-button']}>
                <span className={styles['cart-icon']} aria-hidden="true">
                  <FontAwesomeIcon icon={faCartShopping} />
                </span>
                <span>Koszyk</span>
                <span className={styles['cart-count']}>{cart.length}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <nav className={styles['mobile-bottom-nav']}>
        <Link
          to="/"
          className={`${styles['bottom-nav-item']} ${isActive('/') ? styles.active : ''}`}
        >
          <FontAwesomeIcon
            icon={faHouse}
            className={styles['bottom-nav-icon']}
          />
          <span>Home</span>
        </Link>

        <Link
          to="/menu"
          className={`${styles['bottom-nav-item']} ${isActive('/menu') ? styles.active : ''}`}
        >
          <FontAwesomeIcon
            icon={faUtensils}
            className={styles['bottom-nav-icon']}
          />
          <span>Menu</span>
        </Link>

        <Link
          to="/about"
          className={`${styles['bottom-nav-item']} ${isActive('/about') ? styles.active : ''}`}
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            className={styles['bottom-nav-icon']}
          />
          <span>O nas</span>
        </Link>

        <Link
          to="/cart"
          className={`${styles['bottom-nav-item']} ${isActive('/cart') ? styles.active : ''}`}
        >
          <div className={styles['bottom-nav-cart-wrapper']}>
            <FontAwesomeIcon
              icon={faCartShopping}
              className={styles['bottom-nav-icon']}
            />
            {cart.length > 0 && (
              <span className={styles['bottom-cart-badge']}>{cart.length}</span>
            )}
          </div>
          <span>Koszyk</span>
        </Link>

        <Link
          to="/profile"
          className={`${styles['bottom-nav-item']} ${isActive('/profile') ? styles.active : ''}`}
        >
          <FontAwesomeIcon
            icon={faUser}
            className={styles['bottom-nav-icon']}
          />
          <span>Profil</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
