import { render, screen } from '@testing-library/react';
import App from './App';
import { useAuth } from './context/AuthContext';

jest.mock('./context/AuthContext');
jest.mock('./context/CartContext', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useCart: () => ({
    cart: [],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
  }),
}));

jest.mock('./pages/Home/Home', () => ({
  __esModule: true,
  default: () => <div>Home Page</div>,
}));
jest.mock('./pages/Menu/Menu', () => ({
  __esModule: true,
  default: () => <div>Menu Page</div>,
}));
jest.mock('./pages/About/About', () => ({
  __esModule: true,
  default: () => <div>About Page</div>,
}));
jest.mock('./pages/Cart/Cart', () => ({
  __esModule: true,
  default: () => <div>Cart Page</div>,
}));
jest.mock('./pages/Checkout/Checkout', () => ({
  __esModule: true,
  default: () => <div>Checkout Page</div>,
}));
jest.mock('./pages/OrderStatus/OrderStatus', () => ({
  __esModule: true,
  default: () => <div>OrderStatus Page</div>,
}));
jest.mock('./pages/Auth/Login', () => ({
  __esModule: true,
  default: () => <div>Login Page</div>,
}));
jest.mock('./pages/Auth/Register', () => ({
  __esModule: true,
  default: () => <div>Register Page</div>,
}));
jest.mock('./pages/Profile/Profile', () => ({
  __esModule: true,
  default: () => <div>Profile Page</div>,
}));
jest.mock('./pages/Profile/OrderDetails', () => ({
  __esModule: true,
  default: () => <div>OrderDetails Page</div>,
}));
jest.mock('./pages/Admin/Admin', () => ({
  __esModule: true,
  default: () => <div>Admin Page</div>,
}));
jest.mock('./pages/Admin/AdminLogin', () => ({
  __esModule: true,
  default: () => <div>AdminLogin Page</div>,
}));
jest.mock('./components/Navbar/Navbar', () => ({
  __esModule: true,
  default: () => <nav>Navbar</nav>,
}));
jest.mock('./components/Footer/Footer', () => ({
  __esModule: true,
  default: () => <footer>Footer</footer>,
}));
jest.mock('./components/ScrollToTop/ScrollToTop', () => ({
  __esModule: true,
  default: () => null,
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const renderWithPath = (path: string) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

beforeEach(() => {
  mockUseAuth.mockReturnValue({
    user: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  });
});

describe('App — routing publiczny', () => {
  it('renderuje Navbar i Footer', () => {
    renderWithPath('/');
    expect(screen.getByText('Navbar')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renderuje Home na /', () => {
    renderWithPath('/');
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renderuje Menu na /menu', () => {
    renderWithPath('/menu');
    expect(screen.getByText('Menu Page')).toBeInTheDocument();
  });

  it('renderuje About na /about', () => {
    renderWithPath('/about');
    expect(screen.getByText('About Page')).toBeInTheDocument();
  });

  it('renderuje Cart na /cart', () => {
    renderWithPath('/cart');
    expect(screen.getByText('Cart Page')).toBeInTheDocument();
  });

  it('renderuje Checkout na /checkout', () => {
    renderWithPath('/checkout');
    expect(screen.getByText('Checkout Page')).toBeInTheDocument();
  });

  it('renderuje OrderStatus na /status', () => {
    renderWithPath('/status');
    expect(screen.getByText('OrderStatus Page')).toBeInTheDocument();
  });

  it('renderuje Login na /login', () => {
    renderWithPath('/login');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renderuje Register na /register', () => {
    renderWithPath('/register');
    expect(screen.getByText('Register Page')).toBeInTheDocument();
  });

  it('renderuje AdminLogin na /admin', () => {
    renderWithPath('/admin');
    expect(screen.getByText('AdminLogin Page')).toBeInTheDocument();
  });

  it('renderuje Admin na /admin/dashboard', () => {
    renderWithPath('/admin/dashboard');
    expect(screen.getByText('Admin Page')).toBeInTheDocument();
  });

  it('renderuje 404 na nieznanej ścieżce', () => {
    renderWithPath('/nieznana-strona');
    expect(screen.getByText(/404/)).toBeInTheDocument();
  });
});

describe('App — trasy chronione', () => {
  it('przekierowuje na /login gdy niezalogowany użytkownik wchodzi na /profile', () => {
    renderWithPath('/profile');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Profile Page')).not.toBeInTheDocument();
  });

  it('przekierowuje na /login gdy niezalogowany użytkownik wchodzi na /profile/orders/:id', () => {
    renderWithPath('/profile/orders/ORD-001');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('OrderDetails Page')).not.toBeInTheDocument();
  });

  it('renderuje Profile gdy użytkownik jest zalogowany', () => {
    mockUseAuth.mockReturnValue({
      user: { firstName: 'Jan', lastName: 'Nowak', email: 'jan@test.com' },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });
    renderWithPath('/profile');
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });

  it('renderuje OrderDetails gdy użytkownik jest zalogowany', () => {
    mockUseAuth.mockReturnValue({
      user: { firstName: 'Jan', lastName: 'Nowak', email: 'jan@test.com' },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });
    renderWithPath('/profile/orders/ORD-001');
    expect(screen.getByText('OrderDetails Page')).toBeInTheDocument();
  });
});
