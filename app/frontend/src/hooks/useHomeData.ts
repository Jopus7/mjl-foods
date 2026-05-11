import { useState, useEffect } from 'react';
import { Product } from '../types';

export const useHomeData = () => {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Tu będzie pobieranie 4 najpopularniejszych pozycji
    const fetchPopular = async () => {
      const mockPopular: Product[] = [
        {
          id: 1,
          name: 'Popularna Pizza',
          description: 'Najczęściej zamawiana',
          price: 40,
          imageUrl: 'https://via.placeholder.com/300',
        },
        {
          id: 2,
          name: 'Burger XXL',
          description: 'Dla głodnych',
          price: 45,
          imageUrl: 'https://via.placeholder.com/300',
        },
        {
          id: 3,
          name: 'Frytki',
          description: 'Złociste i chrupiące',
          price: 15,
          imageUrl: 'https://via.placeholder.com/300',
        },
        {
          id: 4,
          name: 'Cola',
          description: 'Zimny napój',
          price: 10,
          imageUrl: 'https://via.placeholder.com/300',
        },
      ];
      setPopularProducts(mockPopular);
    };

    fetchPopular();
  }, []);

  return { popularProducts };
};
