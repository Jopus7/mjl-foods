import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faRightFromBracket,
  faPlus,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useAdmin } from '../../hooks/useAdmin';
import profileStyles from '../Profile/Profile.module.css';
import authStyles from '../Auth/Auth.module.css';
import styles from './Admin.module.css';

const Admin = () => {
  const {
    products,
    orders,
    newProduct,
    setNewProduct,
    handleLogout,
    deleteProduct,
    createProduct,
    editProduct,
    updateOrderStatus,
  } = useAdmin();

  return (
    <div className={profileStyles['profile-container']}>
      <div className={profileStyles['profile-header']}>
        <div className={profileStyles.avatar}>A</div>

        <div className={profileStyles['user-info']}>
          <h1 className={profileStyles['user-name']}>Admin Panel</h1>
          <div className={profileStyles['user-meta']}>
            <span className={profileStyles['user-meta-item']}>
              <FontAwesomeIcon icon={faEnvelope} />
              admin@mjlfoods.com
            </span>
          </div>
        </div>

        <button
          className={profileStyles['logout-button']}
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Wyloguj</span>
        </button>
      </div>

      <div className={profileStyles['stats-grid']}>
        <div className={profileStyles['stat-card']}>
          <span className={profileStyles['stat-num']}>{products.length}</span>
          <span className={profileStyles['stat-label']}>Produktów</span>
        </div>
        <div className={profileStyles['stat-card']}>
          <span className={profileStyles['stat-num']}>{orders.length}</span>
          <span className={profileStyles['stat-label']}>Zamówień</span>
        </div>
      </div>

      <div className={profileStyles['orders-section']}>
        <h2 className={profileStyles['section-title']}>Produkty</h2>

        <div className={styles['add-product-form']}>
          <label className={authStyles['field']}>
            <span className={authStyles['field-label']}>Nazwa</span>
            <div className={authStyles['field-input-wrap']}>
              <input
                type="text"
                placeholder="np. Margherita"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className={authStyles['field-input']}
              />
            </div>
          </label>

          <label className={authStyles['field']}>
            <span className={authStyles['field-label']}>Cena (zł)</span>
            <div className={authStyles['field-input-wrap']}>
              <input
                type="number"
                placeholder="0"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className={authStyles['field-input']}
              />
            </div>
          </label>

          <label className={authStyles['field']}>
            <span className={authStyles['field-label']}>Kategoria</span>
            <div className={authStyles['field-input-wrap']}>
              <input
                type="text"
                placeholder="np. Pizza"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className={authStyles['field-input']}
              />
            </div>
          </label>

          <button className={styles['add-button']} onClick={createProduct}>
            <FontAwesomeIcon icon={faPlus} />
            Dodaj produkt
          </button>
        </div>

        <ul className={profileStyles['order-list']}>
          {products.map((product) => (
            <li key={product.id} className={profileStyles['order-row']}>
              <div className={profileStyles['order-main']}>
                <div className={profileStyles['order-id']}>{product.name}</div>
                <div className={profileStyles['order-date']}>
                  {product.category}
                </div>
              </div>
              <div className={profileStyles['order-total']}>
                {product.price} zł
              </div>
              <div className={styles['product-actions']}>
                <button
                  className={styles['action-button-edit']}
                  onClick={() => editProduct(product)}
                >
                  <FontAwesomeIcon icon={faPen} />
                  Edytuj
                </button>
                <button
                  className={styles['action-button-delete']}
                  onClick={() => deleteProduct(product.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>

        <h2
          className={profileStyles['section-title']}
          style={{ marginTop: '2rem' }}
        >
          Zamówienia
        </h2>

        <ul className={profileStyles['order-list']}>
          {orders.map((order) => (
            <li key={order.id} className={profileStyles['order-row']}>
              <div className={profileStyles['order-main']}>
                <div className={profileStyles['order-id']}>
                  {order.order_number}
                </div>
                <div className={profileStyles['order-date']}>
                  {order.full_name}
                </div>
              </div>
              <div className={styles['status-select-wrap']}>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className={styles['status-select']}
                >
                  <option value="accepted">Przyjęte</option>
                  <option value="preparing">Przygotowywane</option>
                  <option value="on_the_way">W drodze</option>
                  <option value="delivered">Dostarczone</option>
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
