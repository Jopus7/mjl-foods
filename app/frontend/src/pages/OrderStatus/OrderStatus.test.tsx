import { render, screen } from '@testing-library/react';
import OrderStatus from './OrderStatus';
import { useOrderStatus } from '../../hooks/useOrderStatus';

jest.mock('../../hooks/useOrderStatus');
const mockUseOrderStatus = useOrderStatus as jest.MockedFunction<
  typeof useOrderStatus
>;

describe('OrderStatus', () => {
  it('wyświetla sukces gdy isSuccess true', () => {
    mockUseOrderStatus.mockReturnValue({ isSuccess: true, timeLeft: '29:45' });
    render(<OrderStatus />);
    expect(screen.getByText('Zamówienie przyjęte!')).toBeInTheDocument();
  });

  it('wyświetla błąd gdy isSuccess false', () => {
    mockUseOrderStatus.mockReturnValue({ isSuccess: false, timeLeft: '' });
    render(<OrderStatus />);
    expect(screen.getByText('Coś poszło nie tak.')).toBeInTheDocument();
  });

  it('wyświetla timer gdy isSuccess true', () => {
    mockUseOrderStatus.mockReturnValue({ isSuccess: true, timeLeft: '29:45' });
    render(<OrderStatus />);
    expect(screen.getByText('29:45')).toBeInTheDocument();
  });

  it('wyświetla etykietę czasu dostawy', () => {
    mockUseOrderStatus.mockReturnValue({ isSuccess: true, timeLeft: '15:00' });
    render(<OrderStatus />);
    expect(screen.getByText('Czas do dostawy')).toBeInTheDocument();
  });

  it('nie wyświetla timera gdy isSuccess false', () => {
    mockUseOrderStatus.mockReturnValue({ isSuccess: false, timeLeft: '' });
    render(<OrderStatus />);
    expect(screen.queryByText('Czas do dostawy')).not.toBeInTheDocument();
  });

  it('wyświetla Dostarczono! gdy timeLeft to Dostarczono!', () => {
    mockUseOrderStatus.mockReturnValue({
      isSuccess: true,
      timeLeft: 'Dostarczono!',
    });
    render(<OrderStatus />);
    expect(screen.getByText('Dostarczono!')).toBeInTheDocument();
  });
});
