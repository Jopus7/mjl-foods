import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface LocationState {
  deliveryTime?: string;
  orderId?: string;
}

export const useOrderStatus = () => {
  const { state } = useLocation();
  const locationState = state as LocationState | null;
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!locationState?.deliveryTime) return;

    const timer = setInterval(() => {
      const delivery = new Date(locationState.deliveryTime!).getTime();
      const now = new Date().getTime();
      const diff = delivery - now;

      if (diff <= 0) {
        setTimeLeft('Dostarczono!');
        clearInterval(timer);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [locationState]);

  return {
    isSuccess: !!locationState,
    timeLeft,
  };
};
