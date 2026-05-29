import { render, screen } from '@testing-library/react';
import OrderDetails from './OrderDetails';
import { useOrderById } from '../../hooks/useOrders';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'ORD-2026-0142' }),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock('../../hooks/useOrders');
const mockUseOrderById = useOrderById as jest.MockedFunction<
  typeof useOrderById
>;

const mockOrder = {
  id: 'ORD-2026-0142',
  date: '2026-05-20',
  status: 'delivered' as const,
  total: 87,
  address: 'ul. Słoneczna 12/4, 96-100 Skierniewice',
  items: [
    { id: 101, name: 'Margherita', price: 32, quantity: 1 },
    { id: 102, name: 'Cola 0.5L', price: 9, quantity: 3 },
  ],
};

describe('OrderDetails — znalezione zamówienie', () => {
  beforeEach(() => {
    mockUseOrderById.mockReturnValue({ order: mockOrder });
  });

  it('wyświetla id zamówienia', () => {
    render(<OrderDetails />);
    expect(screen.getByText('ORD-2026-0142')).toBeInTheDocument();
  });

  it('wyświetla status zamówienia', () => {
    render(<OrderDetails />);
    expect(screen.getByText('Dostarczone')).toBeInTheDocument();
  });

  it('wyświetla adres dostawy', () => {
    render(<OrderDetails />);
    expect(
      screen.getByText('ul. Słoneczna 12/4, 96-100 Skierniewice')
    ).toBeInTheDocument();
  });

  it('wyświetla nazwy produktów', () => {
    render(<OrderDetails />);
    expect(screen.getByText('Margherita')).toBeInTheDocument();
    expect(screen.getByText('Cola 0.5L')).toBeInTheDocument();
  });

  it('wyświetla ilości produktów', () => {
    render(<OrderDetails />);
    expect(screen.getByText('1×')).toBeInTheDocument();
    expect(screen.getByText('3×')).toBeInTheDocument();
  });

  it('wyświetla łączną kwotę zamówienia', () => {
    render(<OrderDetails />);
    expect(screen.getByText('87 zł')).toBeInTheDocument();
  });

  it('wyświetla link powrotu do profilu', () => {
    render(<OrderDetails />);
    expect(
      screen.getByRole('link', { name: /Wróć do historii/i })
    ).toBeInTheDocument();
  });

  it('wyświetla sekcję pozycji zamówienia', () => {
    render(<OrderDetails />);
    expect(screen.getByText('Pozycje zamówienia')).toBeInTheDocument();
  });
});

describe('OrderDetails — nieznalezione zamówienie', () => {
  beforeEach(() => {
    mockUseOrderById.mockReturnValue({ order: undefined });
  });

  it('wyświetla komunikat o braku zamówienia', () => {
    render(<OrderDetails />);
    expect(screen.getByText('Nie znaleziono zamówienia')).toBeInTheDocument();
  });

  it('wyświetla link powrotu do profilu', () => {
    render(<OrderDetails />);
    expect(
      screen.getByRole('link', { name: /Wróć do profilu/i })
    ).toBeInTheDocument();
  });
});
