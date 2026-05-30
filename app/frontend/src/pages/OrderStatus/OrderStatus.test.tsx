import { render, screen } from '@testing-library/react';
import OrderStatus from './OrderStatus';
import { useOrderStatus } from '../../hooks/useOrderStatus';

jest.mock('../../hooks/useOrderStatus');
const mockUseOrderStatus = useOrderStatus as jest.MockedFunction<
  typeof useOrderStatus
>;

describe('OrderStatus', () => {
  it('wyświetla nagłówek sukcesu', () => {
    mockUseOrderStatus.mockReturnValue({ timeLeft: '29:45' });
    render(<OrderStatus />);
    expect(screen.getByText('Zamówienie przyjęte!')).toBeInTheDocument();
  });

  it('wyświetla timer', () => {
    mockUseOrderStatus.mockReturnValue({ timeLeft: '29:45' });
    render(<OrderStatus />);
    expect(screen.getByText('29:45')).toBeInTheDocument();
  });

  it('wyświetla etykietę czasu dostawy', () => {
    mockUseOrderStatus.mockReturnValue({ timeLeft: '15:00' });
    render(<OrderStatus />);
    expect(screen.getByText('Czas do dostawy')).toBeInTheDocument();
  });

  it('wyświetla Dostarczono! gdy timeLeft to Dostarczono!', () => {
    mockUseOrderStatus.mockReturnValue({
      timeLeft: 'Dostarczono!',
    });
    render(<OrderStatus />);
    expect(screen.getByText('Dostarczono!')).toBeInTheDocument();
  });
});
