export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isPopular: boolean;
}

export interface Category {
  categoryName: string;
  items: Product[];
}

export interface OrderResponse {
  status: 'success' | 'failed';
  estimatedDeliveryTime: string;
}
