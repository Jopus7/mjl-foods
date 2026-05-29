import { renderHook, act } from '@testing-library/react';
import { useOrderStatus } from './useOrderStatus';

const mockNavigate = jest.fn();
let mockLocation = { state: null as any, search: '' };

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

beforeEach(() => {
  mockNavigate.mockClear();
  mockLocation = { state: null, search: '' };
  sessionStorage.clear();
  jest.useRealTimers();
});

describe('useOrderStatus', () => {
  it('isSuccess jest false gdy brak deliveryTime', () => {
    const { result } = renderHook(() => useOrderStatus());
    expect(result.current.isSuccess).toBe(false);
  });

  it('isSuccess jest true gdy deliveryTime jest w state', () => {
    mockLocation = {
      state: { deliveryTime: '2099-01-01T12:00:00.000Z' },
      search: '',
    };
    const { result } = renderHook(() => useOrderStatus());
    expect(result.current.isSuccess).toBe(true);
  });

  it('isSuccess jest true gdy deliveryTime jest w query params', () => {
    mockLocation = {
      state: null,
      search: '?deliveryTime=2099-01-01T12:00:00.000Z',
    };
    const { result } = renderHook(() => useOrderStatus());
    expect(result.current.isSuccess).toBe(true);
  });

  it('isSuccess jest true gdy deliveryTime jest w sessionStorage', () => {
    sessionStorage.setItem(
      'deliveryTime',
      JSON.stringify('2099-01-01T12:00:00.000Z')
    );
    const { result } = renderHook(() => useOrderStatus());
    expect(result.current.isSuccess).toBe(true);
  });

  it('timeLeft jest pusty gdy brak deliveryTime', () => {
    const { result } = renderHook(() => useOrderStatus());
    expect(result.current.timeLeft).toBe('');
  });

  it('ustawia timeLeft dla przyszłego deliveryTime', () => {
    jest.useFakeTimers();
    mockLocation = {
      state: { deliveryTime: '2099-01-01T12:00:00.000Z' },
      search: '',
    };
    const { result } = renderHook(() => useOrderStatus());
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).not.toBe('');
    jest.useRealTimers();
  });

  it('ustawia Dostarczono! gdy deliveryTime jest w przeszłości i brak orderId', () => {
    mockLocation = {
      state: { deliveryTime: '2000-01-01T12:00:00.000Z' },
      search: '',
    };
    const { result } = renderHook(() => useOrderStatus());
    expect(result.current.timeLeft).toBe('Dostarczono!');
  });

  it('nawiguje do zamówienia gdy deliveryTime w przeszłości i jest orderId', () => {
    mockLocation = {
      state: { deliveryTime: '2000-01-01T12:00:00.000Z', orderId: 'ORD-123' },
      search: '',
    };
    renderHook(() => useOrderStatus());
    expect(mockNavigate).toHaveBeenCalledWith('/profile/orders/ORD-123', {
      replace: true,
    });
  });

  it('aktualizuje timeLeft po upływie sekundy', () => {
    jest.useFakeTimers();
    mockLocation = {
      state: { deliveryTime: '2099-01-01T12:00:00.000Z' },
      search: '',
    };
    const { result } = renderHook(() => useOrderStatus());
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const after1s = result.current.timeLeft;
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).not.toBe(after1s);
    jest.useRealTimers();
  });
});
