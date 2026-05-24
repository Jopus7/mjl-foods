export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'in_progress' | 'cancelled';
  total: number;
  items: OrderItem[];
  address: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2026-0142',
    date: '2026-05-20',
    status: 'delivered',
    total: 87,
    address: 'ul. Słoneczna 12/4, 96-100 Skierniewice',
    items: [
      { id: 101, name: 'Margherita', price: 32, quantity: 1 },
      { id: 103, name: 'Sałatka Cezar', price: 28, quantity: 1 },
      { id: 201, name: 'Cola 0.5L', price: 9, quantity: 3 },
    ],
  },
  {
    id: 'ORD-2026-0128',
    date: '2026-05-12',
    status: 'delivered',
    total: 114,
    address: 'ul. Słoneczna 12/4, 96-100 Skierniewice',
    items: [
      { id: 102, name: 'Burger Classic', price: 38, quantity: 2 },
      { id: 104, name: 'Pad Thai', price: 42, quantity: 1 },
    ],
  },
  {
    id: 'ORD-2026-0119',
    date: '2026-05-03',
    status: 'in_progress',
    total: 64,
    address: 'ul. Słoneczna 12/4, 96-100 Skierniewice',
    items: [
      { id: 101, name: 'Margherita', price: 32, quantity: 2 },
    ],
  },
  {
    id: 'ORD-2026-0098',
    date: '2026-04-18',
    status: 'delivered',
    total: 56,
    address: 'ul. Słoneczna 12/4, 96-100 Skierniewice',
    items: [
      { id: 103, name: 'Sałatka Cezar', price: 28, quantity: 2 },
    ],
  },
  {
    id: 'ORD-2026-0071',
    date: '2026-03-30',
    status: 'cancelled',
    total: 42,
    address: 'ul. Słoneczna 12/4, 96-100 Skierniewice',
    items: [
      { id: 104, name: 'Pad Thai', price: 42, quantity: 1 },
    ],
  },
];

export const useOrders = () => {
  return { orders: MOCK_ORDERS };
};

export const useOrderById = (id: string | undefined) => {
  const order = MOCK_ORDERS.find((o) => o.id === id);
  return { order };
};
