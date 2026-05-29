import { render, screen } from '@testing-library/react';
import Menu from './Menu';
import { useMenuData } from '../../hooks/useMenuData';

jest.mock('../../hooks/useMenuData');
jest.mock('../../components/ProductCard/ProductCard', () => ({
  __esModule: true,
  default: ({ item }: { item: { name: string } }) => <div>{item.name}</div>,
}));

const mockUseMenuData = useMenuData as jest.MockedFunction<typeof useMenuData>;

const mockMenu = [
  {
    categoryName: 'Zupy',
    items: [
      {
        id: '1',
        name: 'Zupa Pomidorowa',
        description: '',
        price: 12,
        imageUrl: '',
      },
      { id: '2', name: 'Żurek', description: '', price: 14, imageUrl: '' },
    ],
  },
  {
    categoryName: 'Desery',
    items: [
      { id: '3', name: 'Sernik', description: '', price: 15, imageUrl: '' },
    ],
  },
];

describe('Menu', () => {
  it('wyświetla animację ładowania gdy isLoading true', () => {
    mockUseMenuData.mockReturnValue({ menu: [], isLoading: true });
    render(<Menu />);
    expect(screen.getByText(/Ładowanie pyszności/i)).toBeInTheDocument();
  });

  it('nie wyświetla animacji ładowania gdy isLoading false', () => {
    mockUseMenuData.mockReturnValue({ menu: [], isLoading: false });
    render(<Menu />);
    expect(screen.queryByText(/Ładowanie pyszności/i)).not.toBeInTheDocument();
  });

  it('wyświetla tytuł Menu', () => {
    mockUseMenuData.mockReturnValue({ menu: [], isLoading: false });
    render(<Menu />);
    expect(screen.getByRole('heading', { name: /Nasze/i })).toBeInTheDocument();
  });

  it('wyświetla nazwy kategorii', () => {
    mockUseMenuData.mockReturnValue({ menu: mockMenu, isLoading: false });
    render(<Menu />);
    expect(screen.getByText('Zupy')).toBeInTheDocument();
    expect(screen.getByText('Desery')).toBeInTheDocument();
  });

  it('wyświetla produkty w kategoriach', () => {
    mockUseMenuData.mockReturnValue({ menu: mockMenu, isLoading: false });
    render(<Menu />);
    expect(screen.getByText('Zupa Pomidorowa')).toBeInTheDocument();
    expect(screen.getByText('Żurek')).toBeInTheDocument();
    expect(screen.getByText('Sernik')).toBeInTheDocument();
  });

  it('wyświetla liczbę pozycji w kategorii z wieloma produktami', () => {
    mockUseMenuData.mockReturnValue({ menu: mockMenu, isLoading: false });
    render(<Menu />);
    expect(screen.getByText('2 pozycji')).toBeInTheDocument();
  });

  it('wyświetla liczbę pozycji w kategorii z jednym produktem', () => {
    mockUseMenuData.mockReturnValue({ menu: mockMenu, isLoading: false });
    render(<Menu />);
    expect(screen.getByText('1 pozycja')).toBeInTheDocument();
  });

  it('nie wyświetla kategorii gdy menu jest puste', () => {
    mockUseMenuData.mockReturnValue({ menu: [], isLoading: false });
    render(<Menu />);
    expect(screen.queryByText('Zupy')).not.toBeInTheDocument();
  });
});
