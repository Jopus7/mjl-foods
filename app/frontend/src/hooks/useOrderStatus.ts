import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config';

const firedOrders = new Set<string>();

export const useOrderStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('Ładowanie...');

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!id) {
        navigate('/failed', { replace: true });
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać statusu zamówienia');
        }
        const data = await response.json();
        setDeliveryTime(data.estimatedDeliveryTime);

        if (!firedOrders.has(id)) {
          firedOrders.add(id);
          await fetch(`${API_BASE_URL}/orders/send-success-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: id }),
          });
        }
      } catch (error) {
        navigate('/failed', { replace: true });
      }
    };
    fetchOrderStatus();
  }, [id, navigate]);

  useEffect(() => {
    if (!deliveryTime) return;

    const formattedTime = deliveryTime.replace(/(\.\d{3})\d+/, '$1');
    const delivery = new Date(formattedTime).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const diff = delivery - now;

      if (diff <= 0) {
        if (id) {
          navigate(`/profile/orders/${id}`, { replace: true });
        } else {
          setTimeLeft('Dostarczono!');
        }
        return false;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      return true;
    };

    const hasTimeLeft = calculateTimeLeft();
    if (!hasTimeLeft) return;

    const timer = setInterval(() => {
      const active = calculateTimeLeft();
      if (!active) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deliveryTime, id, navigate]);

  return {
    timeLeft,
  };
};
