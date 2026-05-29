import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { Product } from '../types';

const mockProduct: Product = {
  id: '1',
  name: 'Zupa Pomidorowa',
  description: 'Klasyczna zupa z pomidorów',
  price: 18.5,
  imageUrl: 'https://example.com/soup.jpg',
};

const mockProduct2: Product = {
  id: '2',
  name: 'Pierogi',
  description: 'Domowe pierogi',
  price: 22.0,
  imageUrl: 'https://example.com/pierogi.jpg',
};

const CartDisplay = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  return (
    <div>
      <span data-testid="count">{cart.length}</span>
      <button onClick={() => addToCart(mockProduct)}>dodaj1</button>
      <button onClick={() => addToCart(mockProduct2)}>dodaj2</button>
      <button onClick={() => removeFromCart(cart[0]?.cartItemId)}>usun</button>
      <button onClick={clearCart}>wyczysc</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <CartProvider>
      <CartDisplay />
    </CartProvider>
  );

beforeEach(() => {
  localStorage.clear();
});

describe('CartContext', () => {
  it('koszyk zaczyna pusty', () => {
    renderWithProvider();
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('addToCart dodaje produkt do koszyka', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('dodaj1'));
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('addToCart dodaje każde wywołanie jako osobną pozycję', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('dodaj1'));
    fireEvent.click(screen.getByText('dodaj1'));
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('addToCart dodaje różne produkty', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('dodaj1'));
    fireEvent.click(screen.getByText('dodaj2'));
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('removeFromCart usuwa produkt z koszyka', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('dodaj1'));
    fireEvent.click(screen.getByText('usun'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('clearCart czyści cały koszyk', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('dodaj1'));
    fireEvent.click(screen.getByText('dodaj2'));
    fireEvent.click(screen.getByText('wyczysc'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('koszyk zapisuje stan do localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('dodaj1'));
    const saved = JSON.parse(localStorage.getItem('cart')!);
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('Zupa Pomidorowa');
  });

  it('koszyk wczytuje stan z localStorage przy montowaniu', () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ ...mockProduct, cartItemId: 'abc-123' }])
    );
    renderWithProvider();
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('useCart rzuca błąd poza CartProvider', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const Bad = () => {
      useCart();
      return null;
    };
    expect(() => render(<Bad />)).toThrow(
      'useCart must be used within a CartProvider'
    );
    consoleSpy.mockRestore();
  });
});
