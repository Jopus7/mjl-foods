import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';
import { useAuth } from '../../context/AuthContext';

const mockNavigate = jest.fn();
const mockRegister = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock('../../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

beforeEach(() => {
  mockNavigate.mockClear();
  mockRegister.mockClear();
  mockUseAuth.mockReturnValue({
    user: null,
    login: jest.fn(),
    register: mockRegister,
    logout: jest.fn(),
  });
  global.fetch = jest.fn();
});

const fillForm = (overrides: Partial<Record<string, string>> = {}) => {
  const values = {
    firstName: 'Jan',
    lastName: 'Nowak',
    email: 'jan@test.com',
    password: 'haslo123',
    confirmPassword: 'haslo123',
    ...overrides,
  };
  fireEvent.change(screen.getByPlaceholderText('Anna'), {
    target: { value: values.firstName },
  });
  fireEvent.change(screen.getByPlaceholderText('Kowalska'), {
    target: { value: values.lastName },
  });
  fireEvent.change(screen.getByPlaceholderText('twoj@email.pl'), {
    target: { value: values.email },
  });
  fireEvent.change(screen.getByPlaceholderText('Min. 8 znaków'), {
    target: { value: values.password },
  });
  fireEvent.change(screen.getByPlaceholderText('••••••••'), {
    target: { value: values.confirmPassword },
  });
};

const submitForm = () => {
  fireEvent.submit(
    screen.getByRole('button', { name: /Załóż konto/i }).closest('form')!
  );
};

describe('Register', () => {
  it('renderuje tytuł', () => {
    render(<Register />);
    expect(screen.getByRole('heading', { name: /Załóż/i })).toBeInTheDocument();
  });

  it('renderuje wszystkie pola formularza', () => {
    render(<Register />);
    expect(screen.getByPlaceholderText('Anna')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Kowalska')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('twoj@email.pl')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min. 8 znaków')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renderuje link do logowania', () => {
    render(<Register />);
    expect(
      screen.getByRole('link', { name: /Zaloguj się/i })
    ).toBeInTheDocument();
  });

  it('wyświetla błąd gdy pola są puste', async () => {
    render(<Register />);
    submitForm();
    expect(
      await screen.findByText('Wypełnij wszystkie pola.')
    ).toBeInTheDocument();
  });

  it('wyświetla błąd gdy hasła nie są takie same', async () => {
    render(<Register />);
    fillForm({ confirmPassword: 'innehaslo' });
    submitForm();
    expect(
      await screen.findByText('Hasła nie są takie same.')
    ).toBeInTheDocument();
  });

  it('wyświetla błąd gdy hasło jest za krótkie', async () => {
    render(<Register />);
    fillForm({ password: 'abc', confirmPassword: 'abc' });
    submitForm();
    expect(
      await screen.findByText('Hasło musi mieć co najmniej 8 znaków.')
    ).toBeInTheDocument();
  });

  it('wywołuje register z poprawnymi danymi', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Rejestracja pomyślna' }),
    });
    mockRegister.mockResolvedValueOnce(undefined);

    render(<Register />);
    fillForm();
    submitForm();

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'Jan',
        'Nowak',
        'jan@test.com',
        'haslo123'
      );
    });
  });

  it('nawiguje do /profile po udanej rejestracji', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Rejestracja pomyślna' }),
    });
    mockRegister.mockResolvedValueOnce(undefined);

    render(<Register />);
    fillForm();
    submitForm();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  it('wyświetla błąd gdy backend zwraca błąd rejestracji', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        detail: 'Użytkownik o podanym adresie e-mail już istnieje.',
      }),
    });

    render(<Register />);
    fillForm();
    submitForm();

    expect(
      await screen.findByText(
        'Użytkownik o podanym adresie e-mail już istnieje.'
      )
    ).toBeInTheDocument();
  });
});
