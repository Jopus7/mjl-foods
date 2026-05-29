import { renderHook } from '@testing-library/react';
import { useOrders, useOrderById } from './useOrders';

describe('useOrders', () => {
  it('zwraca tablicę zamówień', () => {
    const { result } = renderHook(() => useOrders());
    expect(Array.isArray(result.current.orders)).toBe(true);
  });

  it('zwraca co najmniej jedno zamówienie', () => {
    const { result } = renderHook(() => useOrders());
    expect(result.current.orders.length).toBeGreaterThan(0);
  });

  it('każde zamówienie ma wymagane pola', () => {
    const { result } = renderHook(() => useOrders());
    result.current.orders.forEach((order) => {
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('date');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('total');
      expect(order).toHaveProperty('items');
      expect(order).toHaveProperty('address');
    });
  });

  it('status jest jedną z dozwolonych wartości', () => {
    const { result } = renderHook(() => useOrders());
    result.current.orders.forEach((order) => {
      expect(['delivered', 'in_progress', 'cancelled']).toContain(order.status);
    });
  });
});

describe('useOrderById', () => {
  it('zwraca zamówienie po poprawnym id', () => {
    const { result } = renderHook(() => useOrderById('ORD-2026-0142'));
    expect(result.current.order).toBeDefined();
    expect(result.current.order?.id).toBe('ORD-2026-0142');
  });

  it('zwraca undefined dla nieistniejącego id', () => {
    const { result } = renderHook(() => useOrderById('NIE-ISTNIEJE'));
    expect(result.current.order).toBeUndefined();
  });

  it('zwraca undefined dla undefined', () => {
    const { result } = renderHook(() => useOrderById(undefined));
    expect(result.current.order).toBeUndefined();
  });

  it('zwrócone zamówienie ma poprawne items', () => {
    const { result } = renderHook(() => useOrderById('ORD-2026-0142'));
    expect(result.current.order?.items.length).toBeGreaterThan(0);
  });
});
