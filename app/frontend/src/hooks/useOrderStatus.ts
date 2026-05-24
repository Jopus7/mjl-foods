import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  deliveryTime?: string;
  orderId?: string;
}

export const useOrderStatus = () => {
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const locationState = state as LocationState | null;

  const params = new URLSearchParams(search);
  const deliveryTime =
  locationState?.deliveryTime ??
  params.get('deliveryTime') ??
  JSON.parse(
    sessionStorage.getItem(
      'deliveryTime'
    ) || 'null'
  ) ??
  null;
  const orderId = locationState?.orderId ?? params.get('orderId') ?? null;

  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    console.log('DELIVERY TIME:', deliveryTime)
    if (!deliveryTime) return;

    const formattedTime =
      deliveryTime.replace(
        /(\.\d{3})\d+/,
        '$1'
      );
    console.log(
    'FORMATTED:',
    formattedTime
  );

  console.log(
    'DATE:',
    new Date(formattedTime)
  );

  console.log(
    'TIMESTAMP:',
    new Date(
      formattedTime
    ).getTime()
  );


    const delivery = new Date(formattedTime).getTime();
    const now = new Date().getTime();

    if (delivery - now <= 0) {
      if (orderId) {
        navigate(`/profile/orders/${orderId}`, { replace: true });
      } else {
        setTimeLeft('Dostarczono!');
      }
      return;
    }

    const timer = setInterval(() => {
      const diff = new Date(formattedTime).getTime() - new Date().getTime();

      if (diff <= 0) {
        clearInterval(timer);
        if (orderId) {
          navigate(`/profile/orders/${orderId}`, { replace: true });
        } else {
          setTimeLeft('Dostarczono!');
        }
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [deliveryTime, orderId, navigate]);

  return {
    isSuccess: !!deliveryTime,
    timeLeft,
  };
};
