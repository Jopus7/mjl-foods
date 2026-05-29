import { renderHook } from '@testing-library/react';
import { useUser } from './useUser';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useUser', () => {
  it('zwraca null gdy użytkownik nie jest zalogowany', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useUser());
    expect(result.current.user).toBeNull();
  });

  it('zwraca użytkownika gdy jest zalogowany', () => {
    const mockUser = {
      firstName: 'Jan',
      lastName: 'Nowak',
      email: 'jan@example.com',
    };
    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useUser());
    expect(result.current.user).toEqual(mockUser);
  });

  it('zwraca poprawny email użytkownika', () => {
    const mockUser = {
      firstName: 'Anna',
      lastName: 'Kowalska',
      email: 'anna@example.com',
    };
    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useUser());
    expect(result.current.user?.email).toBe('anna@example.com');
  });
});
