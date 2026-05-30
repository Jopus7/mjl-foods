import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import About from './pages/About/About';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderStatus from './pages/OrderStatus/OrderStatus';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import OrderDetails from './pages/Profile/OrderDetails';
import { useAuth } from './context/AuthContext';
import './index.css';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Admin from './pages/Admin/Admin';
import AdminLogin from './pages/Admin/AdminLogin';
import OrderFailed from './pages/OrderFailed/OrderFailed';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/status/:id" element={<OrderStatus />} />
          <Route path="/failed" element={<OrderFailed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminLogin />} />

          <Route path="/admin/dashboard" element={<Admin />} />

          <Route
            path="*"
            element={
              <div className="not-found">404 — Nie znaleziono strony</div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
