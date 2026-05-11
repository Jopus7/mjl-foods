import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MJL FOODS
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/menu" className="nav-links">
              Menu
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links">
              O nas
            </Link>
          </li>
        </ul>

        <div className="nav-cart">
          <Link to="/cart" className="cart-button">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">0</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
