import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../../../../config';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Order {
  id: number;
  order_number: string;
  full_name: string;
  status: string;
}

export const useAdmin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');

    if (!isAdmin) {
      navigate('/admin');
      return;
    }

    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then(setProducts);

    fetch(`${API_BASE_URL}/orders`)
      .then((res) => res.json())
      .then(setOrders);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    logout();
    navigate('/admin');
  };

  const deleteProduct = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        alert('Nie udało się usunąć produktu');
      }
    } catch {
      alert('Błąd serwera');
    }
  };

  const createProduct = async () => {
    const token = localStorage.getItem('token');
    const priceNum = Number(newProduct.price);

    let formattedCategory = newProduct.category.trim();
    const lowerCategory = formattedCategory.toLowerCase();

    if (lowerCategory === 'dania główne' || lowerCategory === 'daniaglowne') {
      formattedCategory = 'daniaGlowne';
    } else if (lowerCategory === 'zupy') {
      formattedCategory = 'zupy';
    } else if (lowerCategory === 'desery') {
      formattedCategory = 'desery';
    } else if (lowerCategory === 'napoje') {
      formattedCategory = 'napoje';
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProduct.name.trim(),
          description: 'Standardowy opis produktu dla zamówienia',
          price: priceNum,
          image_url: 'https://placeholder.com/product.jpg',
          available: true,
          is_popular: false,
          category: formattedCategory,
        }),
      });

      if (response.ok) {
        const created = await response.json();
        setProducts([...products, created]);
        setNewProduct({
          name: '',
          price: '',
          category: '',
        });
      } else {
        alert(
          'Backend odrzucił strukturę danych. Upewnij się, że kategoria to: zupy, daniaGlowne, desery lub napoje.'
        );
      }
    } catch {
      alert('Błąd dodawania produktu');
    }
  };

  const editProduct = async (product: Product) => {
    const name = prompt('Nazwa produktu', product.name);
    if (!name) return;

    const price = prompt('Cena produktu', String(product.price));
    if (!price) return;

    const category = prompt('Kategoria', product.category);
    if (!category) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description: '',
          price: Number(price),
          image_url: '',
          available: true,
          is_popular: false,
          category,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setProducts(products.map((p) => (p.id === product.id ? updated : p)));
      }
    } catch {
      alert('Nie udało się edytować produktu');
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/status?status=${status}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      }
    } catch {
      alert('Błąd aktualizacji statusu');
    }
  };

  return {
    products,
    orders,
    newProduct,
    setNewProduct,
    handleLogout,
    deleteProduct,
    createProduct,
    editProduct,
    updateOrderStatus,
  };
};
