import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Wypełnij wszystkie pola.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Hasła nie są takie same.');
      return;
    }
    if (password.length < 8) {
      setError('Hasło musi mieć co najmniej 8 znaków.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Wystąpił błąd podczas rejestracji.');
      }

      await register(firstName, lastName, email, password);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <div className={styles['auth-card']}>
        <header className={styles['auth-header']}>
          <span className={styles['auth-eyebrow']}>Witamy w MJL</span>
          <h1 className={styles['auth-title']}>
            Załóż <em>konto</em>
          </h1>
          <p className={styles['auth-lede']}>
            Zamawiaj szybciej, śledź historię i nigdy nie zapomnij ulubionych
            dań.
          </p>
        </header>

        <form onSubmit={handleSubmit} className={styles['auth-form']}>
          <div className={styles['field-row']}>
            <label className={styles['field']}>
              <span className={styles['field-label']}>Imię</span>
              <div className={styles['field-input-wrap']}>
                <FontAwesomeIcon
                  icon={faUser}
                  className={styles['field-icon']}
                />
                <input
                  type="text"
                  placeholder="Anna"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={styles['field-input']}
                  autoComplete="given-name"
                />
              </div>
            </label>

            <label className={styles['field']}>
              <span className={styles['field-label']}>Nazwisko</span>
              <div className={styles['field-input-wrap']}>
                <FontAwesomeIcon
                  icon={faUser}
                  className={styles['field-icon']}
                />
                <input
                  type="text"
                  placeholder="Kowalska"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={styles['field-input']}
                  autoComplete="family-name"
                />
              </div>
            </label>
          </div>

          <label className={styles['field']}>
            <span className={styles['field-label']}>Email</span>
            <div className={styles['field-input-wrap']}>
              <FontAwesomeIcon
                icon={faEnvelope}
                className={styles['field-icon']}
              />
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
                placeholder="Min. 8 znaków"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles['field-input']}
                autoComplete="new-password"
              />
            </div>
          </label>

          <label className={styles['field']}>
            <span className={styles['field-label']}>Powtórz hasło</span>
            <div className={styles['field-input-wrap']}>
              <FontAwesomeIcon icon={faLock} className={styles['field-icon']} />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles['field-input']}
                autoComplete="new-password"
              />
            </div>
          </label>

          {error && <div className={styles['auth-error']}>{error}</div>}

          <button type="submit" className={styles['auth-submit']}>
            Załóż konto
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>

        <div className={styles['auth-footer']}>
          Masz już konto?{' '}
          <Link to="/login" className={styles['auth-link']}>
            Zaloguj się
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
