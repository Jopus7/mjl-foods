import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { useCart } from '../../context/CartContext';

jest.mock('../../context/CartContext');

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

const renderNavbar = (cartItems: unknown[] = []) => {
  mockUseCart.mockReturnValue({ cart: cartItems, addToCart: jest.fn() } as any);
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
};

describe('Navbar', () => {
  it('renderuje logo z alt textem', () => {
    renderNavbar();
    expect(screen.getByAltText('MJL Foods')).toBeInTheDocument();
  });

  it('renderuje linki nawigacyjne', () => {
    renderNavbar();
    expect(
      screen.getAllByRole('link', { name: /home/i })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: /menu/i })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: /o nas/i })[0]
    ).toBeInTheDocument();
  });

  it('wyświetla liczbę 0 gdy koszyk jest pusty', () => {
    renderNavbar([]);
    // Górny pasek pokazuje cart.length = 0
    const counts = screen.getAllByText('0');
    expect(counts.length).toBeGreaterThanOrEqual(1);
  });

  it('wyświetla liczbę produktów w koszyku', () => {
    renderNavbar([{ id: 1 }, { id: 2 }, { id: 3 }]);
    const counts = screen.getAllByText('3');
    expect(counts.length).toBeGreaterThanOrEqual(1);
  });

  it('badge mobilny nie jest widoczny gdy koszyk pusty', () => {
    renderNavbar([]);
    const badge = screen.queryAllByText('0');
    expect(badge.length).toBeLessThanOrEqual(1);
  });

  it('link do profilu ma poprawny href', () => {
    renderNavbar();
    const profileLinks = screen.getAllByRole('link', { name: /mój profil/i });
    expect(profileLinks[0]).toHaveAttribute('href', '/profile');
  });

  it('link do koszyka prowadzi na /cart', () => {
    renderNavbar();
    const cartLinks = screen.getAllByRole('link', { name: /koszyk/i });
    expect(cartLinks[0]).toHaveAttribute('href', '/cart');
  });

  it('logo prowadzi na stronę główną', () => {
    renderNavbar();
    const logoLink = screen.getByRole('link', {
      name: /mjl foods — strona główna/i,
    });
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
