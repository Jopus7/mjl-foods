import { render, screen, fireEvent } from '@testing-library/react';
import AdminLogin from './AdminLogin';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
  localStorage.clear();
  global.fetch = jest.fn();
});

describe('AdminLogin', () => {
  it('renderuje nagłówek Admin Login', () => {
    render(<AdminLogin />);
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  it('renderuje pole email', () => {
    render(<AdminLogin />);
    expect(screen.getByPlaceholderText('admin')).toBeInTheDocument();
  });

  it('renderuje pole hasła', () => {
    render(<AdminLogin />);
    expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument();
  });

  it('renderuje przycisk Zaloguj', () => {
    render(<AdminLogin />);
    expect(screen.getByRole('button', { name: 'Zaloguj' })).toBeInTheDocument();
  });

  it('nie wyświetla błędu na początku', () => {
    render(<AdminLogin />);
    expect(
      screen.queryByText('Niepoprawne dane logowania')
    ).not.toBeInTheDocument();
  });

  it('wyświetla błąd gdy fetch zwraca błąd', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(<AdminLogin />);
    fireEvent.click(screen.getByRole('button', { name: 'Zaloguj' }));
    expect(
      await screen.findByText('Niepoprawne dane logowania')
    ).toBeInTheDocument();
  });

  it('wyświetla błąd gdy fetch rzuca wyjątek', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );
    render(<AdminLogin />);
    fireEvent.click(screen.getByRole('button', { name: 'Zaloguj' }));
    expect(
      await screen.findByText('Niepoprawne dane logowania')
    ).toBeInTheDocument();
  });

  it('zapisuje token i isAdmin w localStorage po udanym logowaniu', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'test-token' }),
    });
    render(<AdminLogin />);
    fireEvent.change(screen.getByPlaceholderText('admin'), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Hasło'), {
      target: { value: 'haslo123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Zaloguj' }));
    await screen.findByRole('button', { name: 'Zaloguj' });
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(localStorage.getItem('isAdmin')).toBe('true');
  });

  it('nawiguje do /admin/dashboard po udanym logowaniu', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'test-token' }),
    });
    render(<AdminLogin />);
    fireEvent.click(screen.getByRole('button', { name: 'Zaloguj' }));
    await screen.findByRole('button', { name: 'Zaloguj' });
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
  });
});
