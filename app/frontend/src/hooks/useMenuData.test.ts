import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useMenuData } from './useMenuData';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockApiMenu = {
  zupy: [
    {
      id: '1',
      name: 'Zupa Pomidorowa',
      description: 'Opis',
      price: 12,
      image_url: 'img.jpg',
      available: true,
      is_popular: true,
      category: 'zupy',
    },
  ],
  desery: [
    {
      id: '2',
      name: 'Sernik',
      description: 'Opis2',
      price: 15,
      image_url: 'img2.jpg',
      available: true,
      is_popular: false,
      category: 'desery',
    },
  ],
};

describe('useMenuData', () => {
  it('zwraca isLoading true na początku', () => {
    mockedAxios.get.mockResolvedValue({ data: mockApiMenu });
    const { result } = renderHook(() => useMenuData());
    expect(result.current.isLoading).toBe(true);
  });

  it('zwraca kategorie po udanym fetchu', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApiMenu });
    const { result } = renderHook(() => useMenuData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.menu).toHaveLength(2);
  });

  it('mapuje klucz zupy na Zupy', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApiMenu });
    const { result } = renderHook(() => useMenuData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.menu[0].categoryName).toBe('Zupy');
  });

  it('mapuje klucz desery na Desery', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApiMenu });
    const { result } = renderHook(() => useMenuData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.menu[1].categoryName).toBe('Desery');
  });

  it('używa klucza jako categoryName gdy brak mapowania', async () => {
    mockedAxios.get.mockResolvedValue({ data: { nieznana: [] } });
    const { result } = renderHook(() => useMenuData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.menu[0].categoryName).toBe('nieznana');
  });

  it('zwraca produkty w kategorii', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApiMenu });
    const { result } = renderHook(() => useMenuData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.menu[0].items).toHaveLength(1);
    expect(result.current.menu[0].items[0].name).toBe('Zupa Pomidorowa');
  });

  it('zwraca pustą tablicę gdy fetch się nie powiedzie', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useMenuData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.menu).toHaveLength(0);
  });
});
