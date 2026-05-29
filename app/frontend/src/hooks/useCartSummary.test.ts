import { renderHook, act } from '@testing-library/react';
import { useCartSummary } from './useCartSummary';
import { useCart } from '../context/CartContext';

jest.mock('../context/CartContext');

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
const removeFromCartMock = jest.fn();

const makeCart = (prices: number[]) =>
  prices.map((price, i) => ({
    id: String(i),
    cartItemId: `item-${i}`,
    name: `Produkt ${i}`,
    description: '',
    imageUrl: '',
    price,
  }));

beforeEach(() => {
  removeFromCartMock.mockClear();
});

describe('useCartSummary', () => {
  it('total wynosi 0 dla pustego koszyka', () => {
    mockUseCart.mockReturnValue({
      cart: [],
      removeFromCart: removeFromCartMock,
      addToCart: jest.fn(),
      clearCart: jest.fn(),
    });
    const { result } = renderHook(() => useCartSummary());
    expect(result.current.total).toBe(0);
  });

  it('total sumuje ceny produktów', () => {
    mockUseCart.mockReturnValue({
      cart: makeCart([10, 20, 5]),
      removeFromCart: removeFromCartMock,
      addToCart: jest.fn(),
      clearCart: jest.fn(),
    });
    const { result } = renderHook(() => useCartSummary());
    expect(result.current.total).toBe(35);
  });

  it('discountedTotal równa się total gdy brak rabatu', () => {
    mockUseCart.mockReturnValue({
      cart: makeCart([100]),
      removeFromCart: removeFromCartMock,
      addToCart: jest.fn(),
      clearCart: jest.fn(),
    });
    const { result } = renderHook(() => useCartSummary());
    expect(result.current.discountedTotal).toBe(100);
  });

  it('handleApplyPromo ustawia 20% rabat dla kodu promo123', () => {
    mockUseCart.mockReturnValue({
      cart: makeCart([100]),
      removeFromCart: removeFromCartMock,
      addToCart: jest.fn(),
      clearCart: jest.fn(),
    });
    const { result } = renderHook(() => useCartSummary());
    act(() => {
      result.current.handlePromoChange('promo123');
    });
    act(() => {
      result.current.handleApplyPromo();
    });
    expect(result.current.discount).toBe(0.2);
    expect(result.current.discountedTotal).toBe(80);
    expect(result.current.promoError).toBe('');
  });

  it('handleApplyPromo ustawia błąd dla złego kodu', () => {
    mockUseCart.mockReturnValue({
      cart: makeCart([100]),
      removeFromCart: removeFromCartMock,
      addToCart: jest.fn(),
      clearCart: jest.fn(),
    });
    const { result } = renderHook(() => useCartSummary());
    act(() => {
      result.current.handlePromoChange('zly-kod');
    });
    act(() => {
      result.current.handleApplyPromo();
    });
    expect(result.current.discount).toBe(0);
    expect(result.current.promoError).toBe('Niepoprawny kod rabatowy');
  });

  it('handlePromoChange aktualizuje promoCode', () => {
    mockUseCart.mockReturnValue({
      cart: [],
      removeFromCart: removeFromCartMock,
      addToCart: jest.fn(),
      clearCart: jest.fn(),
    });
    const { result } = renderHook(() => useCartSummary());
    act(() => {
      result.current.handlePromoChange('abc');
    });
    expect(result.current.promoCode).toBe('abc');
  });

  it('handlePromoChange czyści promoError', () => {
    mockUseCart.mockReturnValue({
      cart: [],
      removeFromCart: removeFromCartMock,
      addToCart: jest.fn(),
      clearCart: jest.fn(),
    });
    const { result } = renderHook(() => useCartSummary());
    act(() => {
      result.current.handlePromoChange('zly');
    });
    act(() => {
      result.current.handleApplyPromo();
    });
    act(() => {
      result.current.handlePromoChange('nowy');
    });
    expect(result.current.promoError).toBe('');
  });
});
