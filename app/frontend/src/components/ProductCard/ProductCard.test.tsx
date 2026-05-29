import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

jest.mock('../../context/CartContext');

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
const addToCartMock = jest.fn();

const mockProduct: Product = {
  id: '1',
  name: 'Zupa Pomidorowa',
  description: 'Klasyczna zupa z pomidorów',
  price: 18.5,
  imageUrl: 'https://example.com/soup.jpg',
};

beforeEach(() => {
  mockUseCart.mockReturnValue({ cart: [], addToCart: addToCartMock } as any);
  addToCartMock.mockClear();
});

describe('ProductCard', () => {
  it('wyświetla nazwę produktu', () => {
    render(<ProductCard item={mockProduct} />);
    expect(screen.getByText('Zupa Pomidorowa')).toBeInTheDocument();
  });

  it('wyświetla opis produktu', () => {
    render(<ProductCard item={mockProduct} />);
    expect(screen.getByText('Klasyczna zupa z pomidorów')).toBeInTheDocument();
  });

  it('wyświetla cenę produktu', () => {
    render(<ProductCard item={mockProduct} />);
    expect(screen.getByText('18.5')).toBeInTheDocument();
  });

  it('wyświetla walutę zł', () => {
    render(<ProductCard item={mockProduct} />);
    expect(screen.getByText(/zł/)).toBeInTheDocument();
  });

  it('renderuje obrazek produktu z poprawnym alt', () => {
    render(<ProductCard item={mockProduct} />);
    const img = screen.getByAltText('Zupa Pomidorowa');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockProduct.imageUrl);
  });

  it('wyświetla fallback gdy obrazek nie ładuje się', () => {
    render(<ProductCard item={mockProduct} />);
    const img = screen.getByAltText('Zupa Pomidorowa');
    fireEvent.error(img);
    expect(screen.queryByAltText('Zupa Pomidorowa')).not.toBeInTheDocument();
  });

  it('przycisk "Dodaj" ma poprawny aria-label', () => {
    render(<ProductCard item={mockProduct} />);
    expect(
      screen.getByRole('button', { name: /Dodaj Zupa Pomidorowa do koszyka/i })
    ).toBeInTheDocument();
  });

  it('wywołuje addToCart po kliknięciu przycisku', () => {
    render(<ProductCard item={mockProduct} />);
    fireEvent.click(screen.getByRole('button', { name: /Dodaj/i }));
    expect(addToCartMock).toHaveBeenCalledTimes(1);
    expect(addToCartMock).toHaveBeenCalledWith(mockProduct);
  });

  it('nie wywołuje addToCart bez kliknięcia', () => {
    render(<ProductCard item={mockProduct} />);
    expect(addToCartMock).not.toHaveBeenCalled();
  });

  it('wywołuje addToCart wielokrotnie przy wielu kliknięciach', () => {
    render(<ProductCard item={mockProduct} />);
    const btn = screen.getByRole('button', { name: /Dodaj/i });
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(addToCartMock).toHaveBeenCalledTimes(3);
  });
});
