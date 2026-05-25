import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState('');

  const [password,
    setPassword] =
    useState('');

  const [error,
    setError] =
    useState('');

  const handleLogin =
    async () => {
      try {
        const formData =
          new URLSearchParams();

        formData.append(
          'username',
          email
        );

        formData.append(
          'password',
          password
        );

        const response =
          await fetch(
            'http://127.0.0.1:8000/api/auth/login',
            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded',
              },

              body:
                formData.toString(),
            }
          );

        if (
          !response.ok
        ) {
          throw new Error();
        }

        const data =
          await response.json();

        localStorage.setItem(
          'token',
          data.access_token
        );

        localStorage.setItem(
          'isAdmin',
          'true'
        );

        navigate(
          '/admin/dashboard'
        );
      } catch {
        setError(
          'Niepoprawne dane logowania'
        );
      }
    };

  return (
    <div
      style={{
        padding: '2rem',
      }}
    >
      <h1>
        Admin Login
      </h1>

    <input
    type="text"
    placeholder="admin"
    value={email}
    onChange={(e) =>
        setEmail(
        e.target.value
        )
    }
    />

      <br />
      <br />

      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
        onClick={
          handleLogin
        }
      >
        Zaloguj
      </button>

      {error && (
        <p>
          {error}
        </p>
      )}
    </div>
  );
};

export default AdminLogin;