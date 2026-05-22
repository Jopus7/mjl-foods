import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import About from './pages/About/About';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderStatus from './pages/OrderStatus/OrderStatus';
import { CartProvider } from './context/CartContext';
import './index.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/status" element={<OrderStatus />} />

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
    </CartProvider>
  );
}

export default App;
