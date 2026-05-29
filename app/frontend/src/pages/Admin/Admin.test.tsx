import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Admin from './Admin';
import { useAuth } from '../../context/AuthContext';

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockProducts = [
  { id: 1, name: 'Zupa Pomidorowa', price: 18, category: 'zupy' },
  { id: 2, name: 'Pierogi', price: 22, category: 'daniaGlowne' },
];

const mockOrders = [
  {
    id: 1,
    order_number: 'ORD-001',
    full_name: 'Jan Nowak',
    status: 'accepted',
  },
  {
    id: 2,
    order_number: 'ORD-002',
    full_name: 'Anna Kowalska',
    status: 'preparing',
  },
];

beforeEach(() => {
  mockNavigate.mockClear();
  mockLogout.mockClear();
  localStorage.clear();
  mockUseAuth.mockReturnValue({
    user: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: mockLogout,
  });
  global.fetch = jest.fn();
});

const renderWithAdmin = () => {
  localStorage.setItem('isAdmin', 'true');
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce({ json: async () => mockProducts })
    .mockResolvedValueOnce({ json: async () => mockOrders });
  return render(<Admin />);
};

describe('Admin — dostęp', () => {
  it('nawiguje do /admin gdy brak isAdmin w localStorage', () => {
    (global.fetch as jest.Mock).mockResolvedValue({ json: async () => [] });
    render(<Admin />);
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('nie nawiguje gdy isAdmin jest ustawiony', async () => {
    renderWithAdmin();
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
  });
});

describe('Admin — renderowanie', () => {
  it('wyświetla nagłówek Admin Panel', async () => {
    renderWithAdmin();
    expect(await screen.findByText('Admin Panel')).toBeInTheDocument();
  });

  it('wyświetla email admina', async () => {
    renderWithAdmin();
    expect(await screen.findByText(/admin@mjlfoods.com/)).toBeInTheDocument();
  });

  it('wyświetla przycisk Wyloguj', async () => {
    renderWithAdmin();
    expect(
      await screen.findByRole('button', { name: /Wyloguj/i })
    ).toBeInTheDocument();
  });

  it('wyświetla sekcję Produkty', async () => {
    renderWithAdmin();
    expect(await screen.findByText('Produkty')).toBeInTheDocument();
  });

  it('wyświetla sekcję Zamówienia', async () => {
    renderWithAdmin();
    expect(await screen.findByText('Zamówienia')).toBeInTheDocument();
  });

  it('wyświetla pola formularza dodawania produktu', async () => {
    renderWithAdmin();
    expect(await screen.findByPlaceholderText('Nazwa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Cena')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Kategoria')).toBeInTheDocument();
  });
});

describe('Admin — produkty', () => {
  it('wyświetla produkty pobrane z API', async () => {
    renderWithAdmin();
    expect(await screen.findByText('Zupa Pomidorowa')).toBeInTheDocument();
    expect(await screen.findByText('Pierogi')).toBeInTheDocument();
  });

  it('wyświetla liczbę produktów w statystykach', async () => {
    renderWithAdmin();
    await screen.findByText('Zupa Pomidorowa');
    expect(screen.getByText('Produktów')).toBeInTheDocument();
  });

  it('wyświetla przyciski Edytuj i Usuń dla każdego produktu', async () => {
    renderWithAdmin();
    await screen.findByText('Zupa Pomidorowa');
    expect(screen.getAllByRole('button', { name: 'Edytuj' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Usuń' })).toHaveLength(2);
  });

  it('usuwa produkt z listy po udanym DELETE', async () => {
    renderWithAdmin();
    await screen.findByText('Zupa Pomidorowa');
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    fireEvent.click(screen.getAllByRole('button', { name: 'Usuń' })[0]);
    await waitFor(() =>
      expect(screen.queryByText('Zupa Pomidorowa')).not.toBeInTheDocument()
    );
  });

  it('dodaje produkt po wypełnieniu formularza i kliknięciu Dodaj', async () => {
    renderWithAdmin();
    await screen.findByText('Zupa Pomidorowa');
    const newProduct = { id: 3, name: 'Sernik', price: 15, category: 'desery' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => newProduct,
    });
    fireEvent.change(screen.getByPlaceholderText('Nazwa'), {
      target: { value: 'Sernik' },
    });
    fireEvent.change(screen.getByPlaceholderText('Cena'), {
      target: { value: '15' },
    });
    fireEvent.change(screen.getByPlaceholderText('Kategoria'), {
      target: { value: 'desery' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Dodaj' }));
    expect(await screen.findByText('Sernik')).toBeInTheDocument();
  });

  it('czyści formularz po dodaniu produktu', async () => {
    renderWithAdmin();
    await screen.findByText('Zupa Pomidorowa');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 3,
        name: 'Sernik',
        price: 15,
        category: 'desery',
      }),
    });
    fireEvent.change(screen.getByPlaceholderText('Nazwa'), {
      target: { value: 'Sernik' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Dodaj' }));
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Nazwa')).toHaveValue('')
    );
  });
});

describe('Admin — zamówienia', () => {
  it('wyświetla zamówienia pobrane z API', async () => {
    renderWithAdmin();
    expect(await screen.findByText('ORD-001')).toBeInTheDocument();
    expect(await screen.findByText('Jan Nowak')).toBeInTheDocument();
  });

  it('wyświetla liczbę zamówień w statystykach', async () => {
    renderWithAdmin();
    await screen.findByText('ORD-001');
    expect(screen.getByText('Zamówień')).toBeInTheDocument();
  });

  it('wyświetla select ze statusem dla każdego zamówienia', async () => {
    renderWithAdmin();
    await screen.findByText('ORD-001');
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });

  it('aktualizuje status zamówienia po zmianie w select', async () => {
    renderWithAdmin();
    await screen.findByText('ORD-001');
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'delivered' } });
    await waitFor(() => expect(selects[0]).toHaveValue('delivered'));
  });
});

describe('Admin — wylogowanie', () => {
  it('wywołuje logout po kliknięciu Wyloguj', async () => {
    renderWithAdmin();
    await screen.findByText('Admin Panel');
    fireEvent.click(screen.getByRole('button', { name: /Wyloguj/i }));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('usuwa isAdmin z localStorage po wylogowaniu', async () => {
    renderWithAdmin();
    await screen.findByText('Admin Panel');
    fireEvent.click(screen.getByRole('button', { name: /Wyloguj/i }));
    expect(localStorage.getItem('isAdmin')).toBeNull();
  });

  it('nawiguje do /admin po wylogowaniu', async () => {
    renderWithAdmin();
    await screen.findByText('Admin Panel');
    fireEvent.click(screen.getByRole('button', { name: /Wyloguj/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });
});
