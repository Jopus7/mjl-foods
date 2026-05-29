import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../types';
import { API_BASE_URL } from '../../../../config';

export const useHomeData = () => {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/popular`);
        const data = response.data;

        if (Array.isArray(data)) {
          const formattedProducts: Product[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.image_url || item.imageUrl,
            available: item.available,
            isPopular: item.is_popular || item.isPopular,
            category: item.category,
          }));
          setPopularProducts(formattedProducts);
        }
      } catch (error) {
        setPopularProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return { popularProducts, isLoading };
};
