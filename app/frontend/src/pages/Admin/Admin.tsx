import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import styles from '../Profile/Profile.module.css';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Order {
  id: number;
  order_number: string;
  full_name: string;
  status: string;
}

const Admin = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');

    if (!isAdmin) {
      navigate('/admin');
      return;
    }

    fetch('http://127.0.0.1:8000/api/products')
      .then((res) => res.json())
      .then(setProducts);

    fetch('http://127.0.0.1:8000/api/orders')
      .then((res) => res.json())
      .then(setOrders);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    logout();
    navigate('/admin');
  };
  const deleteProduct = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        alert('Nie udało się usunąć produktu');
      }
    } catch {
      alert('Błąd serwera');
    }
  };
  const createProduct = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: newProduct.name,

          description: '',

          price: Number(newProduct.price),

          image_url: '',

          available: true,

          is_popular: false,

          category: newProduct.category,
        }),
      });

      if (response.ok) {
        const created = await response.json();

        setProducts([...products, created]);

        setNewProduct({
          name: '',
          price: '',
          category: '',
        });
      }
    } catch {
      alert('Błąd dodawania produktu');
    }
  };
  const editProduct = async (product: Product) => {
    const name = prompt('Nazwa produktu', product.name);

    if (!name) return;

    const price = prompt('Cena produktu', String(product.price));

    if (!price) return;

    const category = prompt('Kategoria', product.category);

    if (!category) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${product.id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,
            description: '',

            price: Number(price),

            image_url: '',

            available: true,

            is_popular: false,

            category,
          }),
        }
      );

      if (response.ok) {
        const updated = await response.json();

        setProducts(products.map((p) => (p.id === product.id ? updated : p)));
      }
    } catch {
      alert('Nie udało się edytować produktu');
    }
  };
  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}/status?status=${status}`,
        {
          method: 'PUT',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                }
              : order
          )
        );
      }
    } catch {
      alert('Błąd aktualizacji statusu');
    }
  };

  return (
    <div className={styles['profile-container']}>
      <div className={styles['profile-header']}>
        <div className={styles.avatar}>A</div>

        <div className={styles['user-info']}>
          <h1 className={styles['user-name']}>Admin Panel</h1>

          <div className={styles['user-meta']}>
            <span className={styles['user-meta-item']}>
              <FontAwesomeIcon icon={faEnvelope} />
              admin@mjlfoods.com
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
          <span className={styles['stat-num']}>{products.length}</span>

          <span className={styles['stat-label']}>Produktów</span>
        </div>

        <div className={styles['stat-card']}>
          <span className={styles['stat-num']}>{orders.length}</span>

          <span className={styles['stat-label']}>Zamówień</span>
        </div>
      </div>

      <div className={styles['orders-section']}>
        <h2 className={styles['section-title']}>Produkty</h2>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <input
            placeholder="Nazwa"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Cena"
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: e.target.value,
              })
            }
          />

          <input
            placeholder="Kategoria"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                category: e.target.value,
              })
            }
          />

          <button onClick={createProduct}>Dodaj</button>
        </div>

        <ul className={styles['order-list']}>
          {products.map((product) => (
            <li key={product.id} className={styles['order-row']}>
              <div>
                <strong>{product.name}</strong>
              </div>

              <div>
                {product.price}
                zł
              </div>

              <div>{product.category}</div>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1rem',
                }}
              >
                <button onClick={() => editProduct(product)}>Edytuj</button>
                <button onClick={() => deleteProduct(product.id)}>Usuń</button>
              </div>
            </li>
          ))}
        </ul>

        <h2
          className={styles['section-title']}
          style={{
            marginTop: '2rem',
          }}
        >
          Zamówienia
        </h2>

        <ul className={styles['order-list']}>
          {orders.map((order) => (
            <li key={order.id} className={styles['order-row']}>
              <div>
                <strong>{order.order_number}</strong>
              </div>

              <div>{order.full_name}</div>

              <div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                >
                  <option value="accepted">accepted</option>

                  <option value="preparing">preparing</option>

                  <option value="on_the_way">on_the_way</option>

                  <option value="delivered">delivered</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
