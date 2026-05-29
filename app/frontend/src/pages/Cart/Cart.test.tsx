import { render, screen, fireEvent } from '@testing-library/react';
import Cart from './Cart';
import { useCartSummary } from '../../hooks/useCartSummary';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock('../../hooks/useCartSummary');
const mockUseCartSummary = useCartSummary as jest.MockedFunction<
  typeof useCartSummary
>;

const removeFromCartMock = jest.fn();
const handleApplyPromoMock = jest.fn();
const handlePromoChangeMock = jest.fn();

const baseHook = {
  cart: [],
  removeFromCart: removeFromCartMock,
  promoCode: '',
  discount: 0,
  promoError: '',
  total: 0,
  discountedTotal: 0,
  handleApplyPromo: handleApplyPromoMock,
  handlePromoChange: handlePromoChangeMock,
};

const mockCartItems = [
  {
    id: '1',
    cartItemId: 'cid-1',
    name: 'Zupa Pomidorowa',
    price: 18,
    description: '',
    imageUrl: '',
  },
  {
    id: '2',
    cartItemId: 'cid-2',
    name: 'Pierogi',
    price: 22,
    description: '',
    imageUrl: '',
  },
];

beforeEach(() => {
  mockNavigate.mockClear();
  removeFromCartMock.mockClear();
  handleApplyPromoMock.mockClear();
  handlePromoChangeMock.mockClear();
});

describe('Cart — pusty koszyk', () => {
  beforeEach(() => {
    mockUseCartSummary.mockReturnValue({ ...baseHook, cart: [] });
  });

  it('wyświetla nagłówek', () => {
    render(<Cart />);
    expect(screen.getByText('Twój koszyk')).toBeInTheDocument();
  });

  it('wyświetla komunikat o pustym koszyku', () => {
    render(<Cart />);
    expect(screen.getByText('Koszyk jest pusty.')).toBeInTheDocument();
  });

  it('wyświetla link do menu', () => {
    render(<Cart />);
    expect(
      screen.getByRole('link', { name: /Zobacz menu/i })
    ).toBeInTheDocument();
  });

  it('nie wyświetla przycisku Przejdź dalej', () => {
    render(<Cart />);
    expect(screen.queryByText(/Przejdź dalej/i)).not.toBeInTheDocument();
  });

  it('nie wyświetla pola kodu rabatowego', () => {
    render(<Cart />);
    expect(
      screen.queryByPlaceholderText('Wpisz kod rabatowy')
    ).not.toBeInTheDocument();
  });
});

describe('Cart — koszyk z produktami', () => {
  beforeEach(() => {
    mockUseCartSummary.mockReturnValue({
      ...baseHook,
      cart: mockCartItems as any,
      total: 40,
      discountedTotal: 40,
    });
  });

  it('wyświetla produkty w koszyku', () => {
    render(<Cart />);
    expect(screen.getByText('Zupa Pomidorowa')).toBeInTheDocument();
    expect(screen.getByText('Pierogi')).toBeInTheDocument();
  });

  it('wyświetla ceny produktów', () => {
    render(<Cart />);
    expect(screen.getByText('18 zł')).toBeInTheDocument();
    expect(screen.getByText('22 zł')).toBeInTheDocument();
  });

  it('wyświetla przyciski usuwania', () => {
    render(<Cart />);
    expect(screen.getAllByText('X')).toHaveLength(2);
  });

  it('wywołuje removeFromCart po kliknięciu X', () => {
    render(<Cart />);
    fireEvent.click(screen.getAllByText('X')[0]);
    expect(removeFromCartMock).toHaveBeenCalledWith('cid-1');
  });

  it('wyświetla pole kodu rabatowego', () => {
    render(<Cart />);
    expect(
      screen.getByPlaceholderText('Wpisz kod rabatowy')
    ).toBeInTheDocument();
  });

  it('wywołuje handlePromoChange po wpisaniu kodu', () => {
    render(<Cart />);
    fireEvent.change(screen.getByPlaceholderText('Wpisz kod rabatowy'), {
      target: { value: 'promo123' },
    });
    expect(handlePromoChangeMock).toHaveBeenCalledWith('promo123');
  });

  it('wywołuje handleApplyPromo po kliknięciu Zastosuj', () => {
    render(<Cart />);
    fireEvent.click(screen.getByRole('button', { name: 'Zastosuj' }));
    expect(handleApplyPromoMock).toHaveBeenCalled();
  });

  it('wyświetla sumę', () => {
    render(<Cart />);
    expect(screen.getByText('40.00 zł')).toBeInTheDocument();
  });

  it('wyświetla przycisk Przejdź dalej', () => {
    render(<Cart />);
    expect(screen.getByText(/Przejdź dalej/i)).toBeInTheDocument();
  });

  it('nawiguje do /checkout po kliknięciu Przejdź dalej', () => {
    render(<Cart />);
    fireEvent.click(screen.getByText(/Przejdź dalej/i));
    expect(mockNavigate).toHaveBeenCalledWith('/checkout', {
      state: { promoCode: '', discount: 0 },
    });
  });

  it('wyświetla błąd kodu rabatowego', () => {
    mockUseCartSummary.mockReturnValue({
      ...baseHook,
      cart: mockCartItems as any,
      total: 40,
      discountedTotal: 40,
      promoError: 'Niepoprawny kod rabatowy',
    });
    render(<Cart />);
    expect(screen.getByText('Niepoprawny kod rabatowy')).toBeInTheDocument();
  });

  it('wyświetla przekreśloną cenę gdy jest rabat', () => {
    mockUseCartSummary.mockReturnValue({
      ...baseHook,
      cart: mockCartItems as any,
      total: 40,
      discountedTotal: 32,
      discount: 0.2,
    });
    render(<Cart />);
    expect(screen.getByText('40.00 zł')).toBeInTheDocument();
    expect(screen.getByText('32.00 zł')).toBeInTheDocument();
  });
});
