import { render, screen, fireEvent } from '@testing-library/react';
import Checkout from './Checkout';
import { useCheckout } from '../../hooks/useCheckout';

jest.mock('../../hooks/useCheckout');
const mockUseCheckout = useCheckout as jest.MockedFunction<typeof useCheckout>;

const sendOrderMock = jest.fn();
const setDeliveryMethodMock = jest.fn();
const setNameMock = jest.fn();
const setPhoneMock = jest.fn();
const setStreetMock = jest.fn();
const setBuildingMock = jest.fn();
const setApartmentMock = jest.fn();
const setCityMock = jest.fn();
const setErrorsMock = jest.fn();

const baseHook = {
  deliveryMethod: 'delivery' as const,
  setDeliveryMethod: setDeliveryMethodMock,
  name: '',
  setName: setNameMock,
  phone: '',
  setPhone: setPhoneMock,
  street: '',
  setStreet: setStreetMock,
  building: '',
  setBuilding: setBuildingMock,
  apartment: '',
  setApartment: setApartmentMock,
  city: '',
  setCity: setCityMock,
  errors: {},
  setErrors: setErrorsMock,
  sendOrder: sendOrderMock,
};

beforeEach(() => {
  sendOrderMock.mockClear();
  setDeliveryMethodMock.mockClear();
  mockUseCheckout.mockReturnValue(baseHook);
});

describe('Checkout', () => {
  it('wyświetla nagłówek', () => {
    render(<Checkout />);
    expect(screen.getByText('Dane zamówienia')).toBeInTheDocument();
  });

  it('wyświetla krok 2 z 3', () => {
    render(<Checkout />);
    expect(screen.getByText('Krok 2 z 3')).toBeInTheDocument();
  });

  it('wyświetla przyciski metody dostawy', () => {
    render(<Checkout />);
    expect(screen.getByRole('button', { name: 'Dostawa' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Odbiór osobisty' })
    ).toBeInTheDocument();
  });

  it('wyświetla pole imię i nazwisko', () => {
    render(<Checkout />);
    expect(screen.getByPlaceholderText('Imię i nazwisko')).toBeInTheDocument();
  });

  it('wyświetla pole numer telefonu', () => {
    render(<Checkout />);
    expect(screen.getByPlaceholderText('Numer telefonu')).toBeInTheDocument();
  });

  it('wyświetla pola adresowe przy metodzie delivery', () => {
    render(<Checkout />);
    expect(screen.getByPlaceholderText('Ulica')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nr budynku')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Miasto')).toBeInTheDocument();
  });

  it('nie wyświetla pól adresowych przy metodzie pickup', () => {
    mockUseCheckout.mockReturnValue({ ...baseHook, deliveryMethod: 'pickup' });
    render(<Checkout />);
    expect(screen.queryByPlaceholderText('Ulica')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Nr budynku')).not.toBeInTheDocument();
  });

  it('wywołuje setDeliveryMethod po kliknięciu Odbiór osobisty', () => {
    render(<Checkout />);
    fireEvent.click(screen.getByRole('button', { name: 'Odbiór osobisty' }));
    expect(setDeliveryMethodMock).toHaveBeenCalledWith('pickup');
  });

  it('wywołuje setDeliveryMethod po kliknięciu Dostawa', () => {
    mockUseCheckout.mockReturnValue({ ...baseHook, deliveryMethod: 'pickup' });
    render(<Checkout />);
    fireEvent.click(screen.getByRole('button', { name: 'Dostawa' }));
    expect(setDeliveryMethodMock).toHaveBeenCalledWith('delivery');
  });

  it('wywołuje setName po wpisaniu imienia', () => {
    render(<Checkout />);
    fireEvent.change(screen.getByPlaceholderText('Imię i nazwisko'), {
      target: { value: 'Jan Nowak' },
    });
    expect(setNameMock).toHaveBeenCalledWith('Jan Nowak');
  });

  it('wywołuje setPhone po wpisaniu telefonu', () => {
    render(<Checkout />);
    fireEvent.change(screen.getByPlaceholderText('Numer telefonu'), {
      target: { value: '123456789' },
    });
    expect(setPhoneMock).toHaveBeenCalledWith('123456789');
  });

  it('wywołuje sendOrder po kliknięciu Zamów i zapłać', () => {
    render(<Checkout />);
    fireEvent.click(screen.getByRole('button', { name: /Zamów i zapłać/i }));
    expect(sendOrderMock).toHaveBeenCalled();
  });

  it('wyświetla błąd imienia', () => {
    mockUseCheckout.mockReturnValue({
      ...baseHook,
      errors: { name: 'Imię i nazwisko jest wymagane' },
    });
    render(<Checkout />);
    expect(
      screen.getByText('Imię i nazwisko jest wymagane')
    ).toBeInTheDocument();
  });

  it('wyświetla błąd telefonu', () => {
    mockUseCheckout.mockReturnValue({
      ...baseHook,
      errors: { phone: 'Podaj poprawny 9-cyfrowy numer telefonu' },
    });
    render(<Checkout />);
    expect(
      screen.getByText('Podaj poprawny 9-cyfrowy numer telefonu')
    ).toBeInTheDocument();
  });

  it('wyświetla błąd ulicy', () => {
    mockUseCheckout.mockReturnValue({
      ...baseHook,
      errors: { street: 'Ulica jest wymagana' },
    });
    render(<Checkout />);
    expect(screen.getByText('Ulica jest wymagana')).toBeInTheDocument();
  });

  it('wyświetla błąd miasta', () => {
    mockUseCheckout.mockReturnValue({
      ...baseHook,
      errors: { city: 'Miasto jest wymagane' },
    });
    render(<Checkout />);
    expect(screen.getByText('Miasto jest wymagane')).toBeInTheDocument();
  });
});
