import { renderHook, act } from '@testing-library/react';
import { useCheckout } from './useCheckout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/CartContext');
jest.mock('../context/AuthContext');
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

const mockNavigate = jest.fn();
const mockLocation = { state: null };
const mockClearCart = jest.fn();
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockCart = [
  { id: 1, cartItemId: 1, name: 'Zupa', price: 12 },
  { id: 2, cartItemId: 2, name: 'Pierogi', price: 22 },
];

beforeEach(() => {
  mockNavigate.mockClear();
  mockClearCart.mockClear();
  mockUseCart.mockReturnValue({
    cart: mockCart as any,
    clearCart: mockClearCart,
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
  });
  mockUseAuth.mockReturnValue({
    user: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  });
  global.fetch = jest.fn();
});

describe('useCheckout — validate', () => {
  it('zwraca błąd gdy name jest pusty', async () => {
    const { result } = renderHook(() => useCheckout());
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.name).toBe('Imię i nazwisko jest wymagane');
  });

  it('zwraca błąd gdy phone jest niepoprawny', async () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123');
    });
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.phone).toBe(
      'Podaj poprawny 9-cyfrowy numer telefonu'
    );
  });

  it('zwraca błąd gdy email jest pusty', async () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123456789');
    });
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.email).toBe('Adres e-mail jest wymagany');
  });

  it('zwraca błąd gdy email jest niepoprawny', async () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123456789');
    });
    act(() => {
      result.current.setEmail('invalid-email');
    });
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.email).toBe('Podaj poprawny adres e-mail');
  });

  it('akceptuje poprawny 9-cyfrowy numer telefonu', async () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123456789');
    });
    act(() => {
      result.current.setEmail('jan@test.com');
    });
    act(() => {
      result.current.setStreet('Słoneczna');
    });
    act(() => {
      result.current.setBuilding('12');
    });
    act(() => {
      result.current.setCity('Warszawa');
    });
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.phone).toBeUndefined();
  });

  it('akceptuje numer telefonu ze spacjami', async () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123 456 789');
    });
    act(() => {
      result.current.setEmail('jan@test.com');
    });
    act(() => {
      result.current.setStreet('Słoneczna');
    });
    act(() => {
      result.current.setBuilding('12');
    });
    act(() => {
      result.current.setCity('Warszawa');
    });
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.phone).toBeUndefined();
  });

  it('zwraca błąd gdy street jest pusty przy delivery', async () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123456789');
    });
    act(() => {
      result.current.setEmail('jan@test.com');
    });
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.street).toBe('Ulica jest wymagana');
  });

  it('zwraca błąd gdy building jest pusty przy delivery', async () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123456789');
    });
    act(() => {
      result.current.setEmail('jan@test.com');
    });
    act(() => {
      result.current.setStreet('Słoneczna');
    });
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.building).toBe('Nr budynku jest wymagany');
  });

  it('zwraca błąd gdy building nie jest liczbą', async () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123456789');
    });
    act(() => {
      result.current.setEmail('jan@test.com');
    });
    act(() => {
      result.current.setStreet('Słoneczna');
    });
    act(() => {
      result.current.setBuilding('abc');
    });
    act(() => {
      result.current.setCity('Warszawa');
    });
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.building).toBe('Nr budynku musi być liczbą');
  });

  it('zwraca błąd gdy city jest pusty przy delivery', async () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123456789');
    });
    act(() => {
      result.current.setEmail('jan@test.com');
    });
    act(() => {
      result.current.setStreet('Słoneczna');
    });
    act(() => {
      result.current.setBuilding('12');
    });
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.city).toBe('Miasto jest wymagane');
  });

  it('nie waliduje adresu gdy metoda to pickup', async () => {
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.setDeliveryMethod('pickup');
    });
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123456789');
    });
    act(() => {
      result.current.setEmail('jan@test.com');
    });
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(result.current.errors.street).toBeUndefined();
    expect(result.current.errors.building).toBeUndefined();
    expect(result.current.errors.city).toBeUndefined();
  });
});

describe('useCheckout — sendOrder', () => {
  const fillValidForm = (result: any) => {
    act(() => {
      result.current.setName('Jan Nowak');
    });
    act(() => {
      result.current.setPhone('123456789');
    });
    act(() => {
      result.current.setEmail('jan@test.com');
    });
    act(() => {
      result.current.setStreet('Słoneczna');
    });
    act(() => {
      result.current.setBuilding('12');
    });
    act(() => {
      result.current.setCity('Warszawa');
    });
  };

  it('nawiguje do /failed gdy order request się nie powiedzie', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    const { result } = renderHook(() => useCheckout());
    fillValidForm(result);
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/failed');
  });

  it('nawiguje do /failed gdy stripe request się nie powiedzie', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          orderId: 'ORD-123',
          estimatedDeliveryTime: '2099-01-01T12:00:00.000Z',
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });
    const { result } = renderHook(() => useCheckout());
    fillValidForm(result);
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/failed');
  });

  it('nawiguje do /failed gdy fetch rzuca wyjątek', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );
    const { result } = renderHook(() => useCheckout());
    fillValidForm(result);
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/failed');
  });

  it('nie wywołuje fetch gdy walidacja nie przejdzie', async () => {
    const { result } = renderHook(() => useCheckout());
    await act(async () => {
      await result.current.sendOrder();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
