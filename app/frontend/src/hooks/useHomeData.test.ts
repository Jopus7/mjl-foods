import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useHomeData } from './useHomeData';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockApiProducts = [
  {
    id: '1',
    name: 'Zupa',
    description: 'Opis',
    price: 12,
    image_url: 'img.jpg',
    available: true,
    is_popular: true,
    category: 'zupy',
  },
  {
    id: '2',
    name: 'Pierogi',
    description: 'Opis2',
    price: 22,
    imageUrl: 'img2.jpg',
    available: true,
    is_popular: false,
    category: 'daniaGlowne',
  },
];

describe('useHomeData', () => {
  it('zwraca isLoading true na początku', () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    const { result } = renderHook(() => useHomeData());
    expect(result.current.isLoading).toBe(true);
  });

  it('zwraca produkty po udanym fetchu', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApiProducts });
    const { result } = renderHook(() => useHomeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.popularProducts).toHaveLength(2);
    expect(result.current.popularProducts[0].name).toBe('Zupa');
  });

  it('mapuje image_url na imageUrl', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApiProducts });
    const { result } = renderHook(() => useHomeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.popularProducts[0].imageUrl).toBe('img.jpg');
  });

  it('zwraca pustą tablicę gdy odpowiedź nie jest tablicą', async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useHomeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.popularProducts).toHaveLength(0);
  });

  it('zwraca pustą tablicę gdy fetch się nie powiedzie', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useHomeData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.popularProducts).toHaveLength(0);
  });
});
