import { render, screen } from '@testing-library/react';
import OrderFailed from './OrderFailed';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('OrderFailed', () => {
  it('wyświetla nagłówek błędu', () => {
    render(<OrderFailed />);
    expect(screen.getByText('Wystąpił błąd')).toBeInTheDocument();
  });

  it('wyświetla informację o błędzie przetwarzania', () => {
    render(<OrderFailed />);
    expect(screen.getByText(/nie udało się przetworzyć/i)).toBeInTheDocument();
  });

  it('wyświetla numer telefonu', () => {
    render(<OrderFailed />);
    expect(screen.getByText('+48 123 456 789')).toBeInTheDocument();
  });

  it('wyświetla informację o zamówieniu telefonicznym', () => {
    render(<OrderFailed />);
    expect(screen.getByText(/zamówienie telefonicznie/i)).toBeInTheDocument();
  });

  it('wyświetla link powrotu do koszyka', () => {
    render(<OrderFailed />);
    expect(
      screen.getByRole('link', { name: /Wróć do koszyka/i })
    ).toBeInTheDocument();
  });

  it('link prowadzi do /cart', () => {
    render(<OrderFailed />);
    expect(
      screen.getByRole('link', { name: /Wróć do koszyka/i })
    ).toHaveAttribute('href', '/cart');
  });
});
