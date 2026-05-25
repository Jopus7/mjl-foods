import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (
  e: React.FormEvent
) => {
  console.log('submit works');
  e.preventDefault();
  setError('');

  if (!email || !password) {
    setError(
      'Wypełnij wszystkie pola.'
    );
    return;
  }

  try {
    await login(
      email,
      password
    );

    navigate(
      '/admin/dashboard'
    );
  } catch {
    setError(
      'Nieprawidłowy email lub hasło'
    );
  }
};

  return (
    <div className={styles['auth-container']}>
      <div className={styles['auth-card']}>
        <header className={styles['auth-header']}>
          <span className={styles['auth-eyebrow']}>Witaj ponownie</span>
          <h1 className={styles['auth-title']}>
            Zaloguj się <em>do MJL</em>
          </h1>
          <p className={styles['auth-lede']}>
            Twoje ulubione smaki czekają tam, gdzie je zostawiłaś.
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles['auth-form']}>
          <label className={styles['field']}>
            <span className={styles['field-label']}>Email</span>
            <div className={styles['field-input-wrap']}>
              <FontAwesomeIcon icon={faEnvelope} className={styles['field-icon']} />
              <input
                type="email"
                placeholder="twoj@email.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles['field-input']}
                autoComplete="email"
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

          <button type="submit" className={styles['auth-submit']}>
            Zaloguj się
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>

        <div className={styles['auth-footer']}>
          Nie masz jeszcze konta?{' '}
          <Link to="/register" className={styles['auth-link']}>
            Załóż konto
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
