import { useState, useEffect } from 'react';
import axios from 'axios';
import { Category } from '../types';
import { API_BASE_URL } from '../../../../config';

const CATEGORY_MAPPING: Record<string, string> = {
  zupy: 'Zupy',
  daniaGlowne: 'Dania główne',
  desery: 'Desery',
  napoje: 'Napoje',
};

export const useMenuData = () => {
  const [menu, setMenu] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/menu`);
        const backendData = response.data;

        const formattedMenu: Category[] = Object.keys(backendData).map(
          (key) => ({
            categoryName: CATEGORY_MAPPING[key] || key,
            items: backendData[key].map((item: any) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              imageUrl: item.image_url,
              available: item.available,
              isPopular: item.is_popular,
              category: item.category,
            })),
          })
        );

        setMenu(formattedMenu);
      } catch (error) {
        setMenu([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { menu, isLoading };
};
