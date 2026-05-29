import { render, screen, fireEvent } from '@testing-library/react';
import Profile from './Profile';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../hooks/useOrders';

const mockNavigate = jest.fn();

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
const mockLogout = jest.fn();

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
    user: mockUser,
    login: jest.fn(),
    register: jest.fn(),
    logout: mockLogout,
  });
});

describe('Profile — zalogowany użytkownik', () => {
  it('wyświetla imię i nazwisko', () => {
    render(<Profile />);
    expect(screen.getByText('Jan Nowak')).toBeInTheDocument();
  });

  it('wyświetla email', () => {
    render(<Profile />);
    expect(screen.getByText(/jan@test.com/)).toBeInTheDocument();
  });

  it('wyświetla inicjały w awatarze', () => {
    render(<Profile />);
    expect(screen.getByText('JN')).toBeInTheDocument();
  });

  it('wyświetla liczbę wszystkich zamówień', () => {
    render(<Profile />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Wszystkich zamówień')).toBeInTheDocument();
  });

  it('wyświetla liczbę dostarczonych zamówień', () => {
    render(<Profile />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Dostarczonych')).toBeInTheDocument();
  });

  it('wyświetla łączną kwotę wydatków', () => {
    render(<Profile />);
    expect(screen.getByText('159 zł')).toBeInTheDocument();
  });

  it('wyświetla historię zamówień', () => {
    render(<Profile />);
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('ORD-002')).toBeInTheDocument();
  });

  it('wyświetla statusy zamówień', () => {
    render(<Profile />);
    expect(screen.getByText('Dostarczone')).toBeInTheDocument();
    expect(screen.getByText('W realizacji')).toBeInTheDocument();
    expect(screen.getByText('Anulowane')).toBeInTheDocument();
  });

  it('wyświetla przycisk Wyloguj', () => {
    render(<Profile />);
    expect(
      screen.getByRole('button', { name: /Wyloguj/i })
    ).toBeInTheDocument();
  });

  it('wywołuje logout po kliknięciu Wyloguj', () => {
    render(<Profile />);
    fireEvent.click(screen.getByRole('button', { name: /Wyloguj/i }));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('nawiguje do / po wylogowaniu', () => {
    render(<Profile />);
    fireEvent.click(screen.getByRole('button', { name: /Wyloguj/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

describe('Profile — niezalogowany użytkownik', () => {
  it('nawiguje do /login gdy brak użytkownika', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });
    render(<Profile />);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
