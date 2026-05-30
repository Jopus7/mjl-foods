import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './Profile';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../hooks/useOrders';

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock('../../context/AuthContext');
jest.mock('../../hooks/useOrders');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseOrders = useOrders as jest.MockedFunction<typeof useOrders>;

const mockUser = { firstName: 'Jan', lastName: 'Nowak', email: 'jan@test.com' };

const mockOrders = [
  {
    id: 'ORD-001',
    date: '2026-05-01',
    status: 'delivered' as const,
    total: 87,
    address: 'ul. Testowa 1',
    items: [{ id: 1, name: 'Zupa', price: 12, quantity: 1 }],
  },
  {
    id: 'ORD-002',
    date: '2026-04-15',
    status: 'in_progress' as const,
    total: 42,
    address: 'ul. Testowa 1',
    items: [{ id: 2, name: 'Pierogi', price: 22, quantity: 2 }],
  },
  {
    id: 'ORD-003',
    date: '2026-03-10',
    status: 'cancelled' as const,
    total: 30,
    address: 'ul. Testowa 1',
    items: [{ id: 3, name: 'Sernik', price: 15, quantity: 2 }],
  },
];

beforeEach(() => {
  mockNavigate.mockClear();
  mockLogout.mockClear();
  mockUseOrders.mockReturnValue({ orders: mockOrders });
  mockUseAuth.mockReturnValue({
    user: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: mockLogout,
  });

  localStorage.clear();
  global.fetch = jest.fn();
});

describe('Profile — zalogowany użytkownik', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'valid-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });
  });

  it('wyświetla imię i nazwisko', async () => {
    render(<Profile />);
    expect(screen.getByText('Ładowanie...')).toBeInTheDocument();
    expect(await screen.findByText('Jan Nowak')).toBeInTheDocument();
  });

  it('wyświetla email', async () => {
    render(<Profile />);
    expect(await screen.findByText(/jan@test.com/)).toBeInTheDocument();
  });

  it('wyświetla inicjały w awatarze', async () => {
    render(<Profile />);
    expect(await screen.findByText('JN')).toBeInTheDocument();
  });

  it('wyświetla liczbę wszystkich zamówień', async () => {
    render(<Profile />);
    expect(await screen.findByText('3')).toBeInTheDocument();
    expect(screen.getByText('Wszystkich zamówień')).toBeInTheDocument();
  });

  it('wyświetla liczbę dostarczonych zamówień', async () => {
    render(<Profile />);
    expect(await screen.findByText('1')).toBeInTheDocument();
    expect(screen.getByText('Dostarczonych')).toBeInTheDocument();
  });

  it('wyświetla łączną kwotę wydatków', async () => {
    render(<Profile />);
    expect(await screen.findByText('159 zł')).toBeInTheDocument();
  });

  it('wyświetla historię zamówień', async () => {
    render(<Profile />);
    expect(await screen.findByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('ORD-002')).toBeInTheDocument();
  });

  it('wyświetla statusy zamówień', async () => {
    render(<Profile />);
    expect(await screen.findByText('Dostarczone')).toBeInTheDocument();
    expect(screen.getByText('W realizacji')).toBeInTheDocument();
    expect(screen.getByText('Anulowane')).toBeInTheDocument();
  });

  it('wyświetla przycisk Wyloguj', async () => {
    render(<Profile />);
    expect(
      await screen.findByRole('button', { name: /Wyloguj/i })
    ).toBeInTheDocument();
  });

  it('wywołuje logout i czyści localStorage po kliknięciu Wyloguj', async () => {
    render(<Profile />);
    const logoutBtn = await screen.findByRole('button', { name: /Wyloguj/i });
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('nawiguje do / po wylogowaniu', async () => {
    render(<Profile />);
    const logoutBtn = await screen.findByRole('button', { name: /Wyloguj/i });
    fireEvent.click(logoutBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

describe('Profile — niezalogowany lub błąd autoryzacji', () => {
  it('nawiguje do /login gdy brak tokenu w localStorage', async () => {
    render(<Profile />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('czyści dane, wywołuje logout i nawiguje do /login przy błędzie odpowiedzi API', async () => {
    localStorage.setItem('token', 'invalid-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<Profile />);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
