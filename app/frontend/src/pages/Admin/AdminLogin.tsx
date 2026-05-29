import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useAdminLogin } from '../../hooks/useAdminLogin';
import styles from '../Auth/Auth.module.css';

const AdminLogin = () => {
  const { email, setEmail, password, setPassword, error, handleLogin } =
    useAdminLogin();

  return (
    <div className={styles['auth-container']}>
      <div className={styles['auth-card']}>
        <header className={styles['auth-header']}>
          <span className={styles['auth-eyebrow']}>Panel administratora</span>
          <h1 className={styles['auth-title']}>
            Admin <em>Login</em>
          </h1>
          <p className={styles['auth-lede']}>
            Zaloguj się, aby zarządzać restauracją.
          </p>
        </header>

        <div className={styles['auth-form']}>
          <label className={styles['field']}>
            <span className={styles['field-label']}>Login</span>
            <div className={styles['field-input-wrap']}>
              <FontAwesomeIcon icon={faUser} className={styles['field-icon']} />
              <input
                type="text"
                placeholder="admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles['field-input']}
                autoComplete="username"
              />
            </div>
          </label>

          <label className={styles['field']}>
            <span className={styles['field-label']}>Hasło</span>
            <div className={styles['field-input-wrap']}>
              <FontAwesomeIcon icon={faLock} className={styles['field-icon']} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles['field-input']}
                autoComplete="current-password"
              />
            </div>
          </label>

          {error && <div className={styles['auth-error']}>{error}</div>}

          <button className={styles['auth-submit']} onClick={handleLogin}>
            Zaloguj się
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
