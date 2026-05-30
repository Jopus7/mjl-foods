import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { useAuth } from '../../context/AuthContext';

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

beforeEach(() => {
  mockNavigate.mockClear();
  mockLogin.mockClear();
  mockUseAuth.mockReturnValue({
    user: null,
    login: mockLogin,
    register: jest.fn(),
    logout: jest.fn(),
  });

  localStorage.clear();
  jest.spyOn(Storage.prototype, 'setItem');

  global.fetch = jest.fn();
});

describe('Login', () => {
  it('renderuje tytuł', () => {
    render(<Login />);
    expect(
      screen.getByRole('heading', { name: /Zaloguj się/i })
    ).toBeInTheDocument();
  });

  it('renderuje pole email', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('twoj@email.pl')).toBeInTheDocument();
  });

  it('renderuje pole hasła', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renderuje przycisk submit', () => {
    render(<Login />);
    expect(
      screen.getByRole('button', { name: /Zaloguj się/i })
    ).toBeInTheDocument();
  });

  it('renderuje link do rejestracji', () => {
    render(<Login />);
    expect(
      screen.getByRole('link', { name: /Załóż konto/i })
    ).toBeInTheDocument();
  });

  it('wyświetla błąd gdy pola są puste', async () => {
    render(<Login />);
    fireEvent.submit(
      screen.getByRole('button', { name: /Zaloguj się/i }).closest('form')!
    );
    expect(
      await screen.findByText('Wypełnij wszystkie pola.')
    ).toBeInTheDocument();
  });

  it('wyświetla błąd gdy tylko email jest wypełniony', async () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('twoj@email.pl'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.submit(
      screen.getByRole('button', { name: /Zaloguj się/i }).closest('form')!
    );
    expect(
      await screen.findByText('Wypełnij wszystkie pola.')
    ).toBeInTheDocument();
  });

  it('wywołuje login z poprawnymi danymi oraz zapisuje token', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'fake-token' }),
    });
    mockLogin.mockResolvedValueOnce(undefined);

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('twoj@email.pl'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'haslo123' },
    });
    fireEvent.submit(
      screen.getByRole('button', { name: /Zaloguj się/i }).closest('form')!
    );

    await waitFor(() => {
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'token',
        'fake-token'
      );
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'haslo123');
    });
  });

  it('nawiguje do /profile po udanym logowaniu', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'fake-token' }),
    });
    mockLogin.mockResolvedValueOnce(undefined);

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('twoj@email.pl'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'haslo123' },
    });
    fireEvent.submit(
      screen.getByRole('button', { name: /Zaloguj się/i }).closest('form')!
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  it('wyświetla błąd gdy backend zwraca błąd', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Nieprawidłowy email lub hasło' }),
    });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('twoj@email.pl'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'haslo123' },
    });
    fireEvent.submit(
      screen.getByRole('button', { name: /Zaloguj się/i }).closest('form')!
    );

    expect(
      await screen.findByText('Nieprawidłowy email lub hasło')
    ).toBeInTheDocument();
  });
});
