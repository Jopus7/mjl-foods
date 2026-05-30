import { renderHook, act } from '@testing-library/react';
import { useOrderStatus } from './useOrderStatus';

const mockNavigate = jest.fn();
let mockParams = { id: undefined as string | undefined };

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

beforeEach(() => {
  mockNavigate.mockClear();
  mockParams = { id: undefined };
  global.fetch = jest.fn();
  jest.useRealTimers();
});

describe('useOrderStatus', () => {
  it('nawiguje do /failed gdy brak id w url', async () => {
    mockParams = { id: undefined };
    await act(async () => {
      renderHook(() => useOrderStatus());
    });
    expect(mockNavigate).toHaveBeenCalledWith('/failed', { replace: true });
  });

  it('pobiera status zamówienia i wysyła e-mail przy poprawnym id', async () => {
    mockParams = { id: 'ORD-123' };
    const mockOrderData = { estimatedDeliveryTime: '2099-01-01T12:00:00.000Z' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrderData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'email_sent' }),
      });

    let hookResult: any;
    await act(async () => {
      const { result } = renderHook(() => useOrderStatus());
      hookResult = result;
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/orders/ORD-123')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/orders/send-success-email'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ orderId: 'ORD-123' }),
      })
    );
  });

  it('nawiguje do /failed gdy fetch rzuci błąd bazy', async () => {
    mockParams = { id: 'ORD-123' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await act(async () => {
      renderHook(() => useOrderStatus());
    });

    expect(mockNavigate).toHaveBeenCalledWith('/failed', { replace: true });
  });

  it('ustawia licznik timeLeft po udanym pobraniu danych', async () => {
    jest.useFakeTimers();
    mockParams = { id: 'ORD-123' };
    const mockOrderData = { estimatedDeliveryTime: '2099-01-01T12:00:00.000Z' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrderData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'email_sent' }),
      });

    let hookResult: any;
    await act(async () => {
      const { result } = renderHook(() => useOrderStatus());
      hookResult = result;
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(hookResult.current.timeLeft).not.toBe('Ładowanie...');
    jest.useRealTimers();
  });

  it('nawiguje do profilu gdy deliveryTime jest w przeszłości', async () => {
    mockParams = { id: 'ORD-123' };
    const mockOrderData = { estimatedDeliveryTime: '2000-01-01T12:00:00.000Z' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrderData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'email_sent' }),
      });

    await act(async () => {
      renderHook(() => useOrderStatus());
    });

    expect(mockNavigate).toHaveBeenCalledWith('/profile/orders/ORD-123', {
      replace: true,
    });
  });
});
