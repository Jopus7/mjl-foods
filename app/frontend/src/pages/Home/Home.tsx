import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Product } from '../../types';
import logo from '../../assets/logo.png';
import styles from './Home.module.css';

const MOCK_POPULAR: Product[] = [
  {
    id: 101,
    name: 'Margherita',
    description:
      'Sos pomidorowy San Marzano, mozzarella fior di latte, świeża bazylia.',
    price: 32,
    imageUrl:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
  },
  {
    id: 102,
    name: 'Burger Classic',
    description:
      'Wołowina 100%, cheddar, karmelizowana cebula, domowa bułka briosz.',
    price: 38,
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  },
  {
    id: 103,
    name: 'Sałatka Cezar',
    description:
      'Rzymska sałata, kurczak grillowany, parmezan, grzanki, klasyczny dressing.',
    price: 28,
    imageUrl:
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80',
  },
  {
    id: 104,
    name: 'Pad Thai',
    description:
      'Makaron ryżowy, krewetki, orzeszki ziemne, limonka, świeża kolendra.',
    price: 42,
    imageUrl:
      'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80',
  },
];

const Home = () => {
  const [popular, setPopular] = useState<Product[]>(MOCK_POPULAR);

  useEffect(() => {
    fetch('https://api.twoja-restauracja.pl/products/popular')
      .then((res) => res.json())
      .then((data: Product[]) => {
        if (Array.isArray(data) && data.length > 0) setPopular(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles['home-container']}>
      <div className={styles.hero}>
        <div className={styles['hero-text']}>
          <span className={styles['hero-eyebrow']}>
            Świeże • Lokalne • Z miłością
          </span>
          <h1>
            Smak, który
            <br />
            <span className={styles['accent-orange']}>czujesz</span>
            <br />
            Świeżość, którą
            <br />
            <span className={styles['accent-green']}>widać</span>
          </h1>
          <p>
            Najlepsze smaki w Twoim mieście — gotowane z pasją, dostarczane
            prosto pod Twoje drzwi.
          </p>
          <div>
            <Link to="/menu" className={styles['hero-cta']}>
              Zobacz menu
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className={styles['hero-visual']} aria-hidden="true">
          <div className={styles.ring} />
          <div className={styles.plate}>
            <img src={logo} alt="logo image" />
          </div>
        </div>
      </div>

      <div className={styles['popular-items']}>
        <div className={styles['section-head']}>
          <h2>Najpopularniejsze</h2>
        </div>
        <div className={styles['product-grid']}>
          {popular.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
