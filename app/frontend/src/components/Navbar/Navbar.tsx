import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import logo2 from '../../assets/logo2.png';
import styles from './Navbar.module.css';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();

  return (
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
    </nav>
  );
};

export default Navbar;
