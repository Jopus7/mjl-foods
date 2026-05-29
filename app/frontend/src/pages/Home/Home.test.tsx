import { render, screen } from '@testing-library/react';
import Home from './Home';
import { useHomeData } from '../../hooks/useHomeData';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock('../../hooks/useHomeData');
jest.mock('../../components/ProductCard/ProductCard', () => ({
  __esModule: true,
  default: ({ item }: { item: { name: string } }) => <div>{item.name}</div>,
}));

const mockUseHomeData = useHomeData as jest.MockedFunction<typeof useHomeData>;

const mockProducts = [
  {
    id: '1',
    name: 'Zupa Pomidorowa',
    description: '',
    price: 18,
    imageUrl: '',
  },
  { id: '2', name: 'Pierogi', description: '', price: 22, imageUrl: '' },
];

describe('Home', () => {
  it('wyświetla nagłówek hero', () => {
    mockUseHomeData.mockReturnValue({ popularProducts: [], isLoading: false });
    render(<Home />);
    expect(screen.getByText(/czujesz/i)).toBeInTheDocument();
  });

  it('wyświetla link do menu', () => {
    mockUseHomeData.mockReturnValue({ popularProducts: [], isLoading: false });
    render(<Home />);
    expect(
      screen.getByRole('link', { name: /Zobacz menu/i })
    ).toBeInTheDocument();
  });

  it('wyświetla komunikat ładowania', () => {
    mockUseHomeData.mockReturnValue({ popularProducts: [], isLoading: true });
    render(<Home />);
    expect(screen.getByText(/Ładowanie popularnych dań/i)).toBeInTheDocument();
  });

  it('nie wyświetla komunikatu ładowania gdy isLoading false', () => {
    mockUseHomeData.mockReturnValue({ popularProducts: [], isLoading: false });
    render(<Home />);
    expect(
      screen.queryByText(/Ładowanie popularnych dań/i)
    ).not.toBeInTheDocument();
  });

  it('wyświetla sekcję Najpopularniejsze gdy są produkty', () => {
    mockUseHomeData.mockReturnValue({
      popularProducts: mockProducts as any,
      isLoading: false,
    });
    render(<Home />);
    expect(screen.getByText('Najpopularniejsze')).toBeInTheDocument();
  });

  it('nie wyświetla sekcji Najpopularniejsze gdy brak produktów', () => {
    mockUseHomeData.mockReturnValue({ popularProducts: [], isLoading: false });
    render(<Home />);
    expect(screen.queryByText('Najpopularniejsze')).not.toBeInTheDocument();
  });

  it('wyświetla popularne produkty', () => {
    mockUseHomeData.mockReturnValue({
      popularProducts: mockProducts as any,
      isLoading: false,
    });
    render(<Home />);
    expect(screen.getByText('Zupa Pomidorowa')).toBeInTheDocument();
    expect(screen.getByText('Pierogi')).toBeInTheDocument();
  });

  it('nie wyświetla produktów podczas ładowania', () => {
    mockUseHomeData.mockReturnValue({
      popularProducts: mockProducts as any,
      isLoading: true,
    });
    render(<Home />);
    expect(screen.queryByText('Zupa Pomidorowa')).not.toBeInTheDocument();
  });
});
