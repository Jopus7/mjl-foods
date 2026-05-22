import { useState, useEffect } from 'react';
import { Category } from '../types';

export const useMenuData = () => {
  const [menu, setMenu] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tu będzie pobieranie danych z backendu
    // Na razie zwracamy mockowe dane jako placeholder
    const fetchMenu = async () => {
      setIsLoading(true);
      const mockData: Category[] = [
        {
          categoryName: 'Pizze',
          items: [
            {
              id: 1,
              name: 'Margherita',
              description: 'Klasyka: sos, mozarella',
              price: 32,
              imageUrl: 'https://via.placeholder.com/150',
            },
            {
              id: 2,
              name: 'Capriciosa',
              description: 'Szynka, pieczarki',
              price: 38,
              imageUrl: 'https://via.placeholder.com/150',
            },
          ],
        },
        {
          categoryName: 'Burgery',
          items: [
            {
              id: 3,
              name: 'Classic Burger',
              description: 'Wołowina 100%',
              price: 35,
              imageUrl: 'https://via.placeholder.com/150',
            },
          ],
        },
      ];

      setMenu(mockData);
      setIsLoading(false);
    };

    fetchMenu();
  }, []);

  return { menu, isLoading };
};
