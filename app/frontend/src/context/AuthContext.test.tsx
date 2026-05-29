import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const AuthDisplay = () => {
  const { user, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="email">{user?.email ?? 'brak'}</span>
      <span data-testid="firstName">{user?.firstName ?? 'brak'}</span>
      <span data-testid="lastName">{user?.lastName ?? 'brak'}</span>
      <button onClick={() => login('test@example.com', 'haslo')}>login</button>
      <button
        onClick={() => register('Jan', 'Nowak', 'jan@example.com', 'haslo')}
      >
        register
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <AuthProvider>
      <AuthDisplay />
    </AuthProvider>
  );

beforeEach(() => {
  localStorage.clear();
});

describe('AuthContext', () => {
  it('użytkownik zaczyna jako null', () => {
    renderWithProvider();
    expect(screen.getByTestId('email').textContent).toBe('brak');
  });

  it('login ustawia użytkownika', async () => {
    renderWithProvider();
    await act(async () => {
      screen.getByText('login').click();
    });
    expect(screen.getByTestId('email').textContent).toBe('test@example.com');
    expect(screen.getByTestId('firstName').textContent).toBe('Anna');
  });

  it('login zapisuje użytkownika w localStorage', async () => {
    renderWithProvider();
    await act(async () => {
      screen.getByText('login').click();
    });
    const saved = JSON.parse(localStorage.getItem('mjl_user')!);
    expect(saved.email).toBe('test@example.com');
  });

  it('register ustawia użytkownika z podanymi danymi', async () => {
    renderWithProvider();
    await act(async () => {
      screen.getByText('register').click();
    });
    expect(screen.getByTestId('email').textContent).toBe('jan@example.com');
    expect(screen.getByTestId('firstName').textContent).toBe('Jan');
    expect(screen.getByTestId('lastName').textContent).toBe('Nowak');
  });

  it('register zapisuje użytkownika w localStorage', async () => {
    renderWithProvider();
    await act(async () => {
      screen.getByText('register').click();
    });
    const saved = JSON.parse(localStorage.getItem('mjl_user')!);
    expect(saved.firstName).toBe('Jan');
  });

  it('logout usuwa użytkownika', async () => {
    renderWithProvider();
    await act(async () => {
      screen.getByText('login').click();
    });
    await act(async () => {
      screen.getByText('logout').click();
    });
    expect(screen.getByTestId('email').textContent).toBe('brak');
  });

  it('logout usuwa użytkownika z localStorage', async () => {
    renderWithProvider();
    await act(async () => {
      screen.getByText('login').click();
    });
    await act(async () => {
      screen.getByText('logout').click();
    });
    expect(localStorage.getItem('mjl_user')).toBeNull();
  });

  it('wczytuje użytkownika z localStorage przy montowaniu', () => {
    localStorage.setItem(
      'mjl_user',
      JSON.stringify({
        firstName: 'Maria',
        lastName: 'Wiśniewska',
        email: 'maria@example.com',
      })
    );
    renderWithProvider();
    expect(screen.getByTestId('email').textContent).toBe('maria@example.com');
  });

  it('useAuth rzuca błąd poza AuthProvider', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const Bad = () => {
      useAuth();
      return null;
    };
    expect(() => render(<Bad />)).toThrow(
      'useAuth must be used inside AuthProvider'
    );
    consoleSpy.mockRestore();
  });
});
