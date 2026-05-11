import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { Product } from '../types';

const Home: React.FC = () => {
  const [popular, setPopular] = useState<Product[]>([]);

  useEffect(() => {
    fetch('https://api.twoja-restauracja.pl/products/popular')
      .then((res) => res.json())
      .then((data: Product[]) => setPopular(data));
  }, []);

  return (
    <div className="home-container">
      <section className="hero">
        <img src="/hero-bg.jpg" alt="Restaurant" />
        <div className="hero-text">
          <h1>MJL Foods</h1>
          <p>Najlepsze smaki w Twoim mieście.</p>
        </div>
      </section>

      <section className="popular-items">
        <h2>Najpopularniejsze</h2>
        <div className="product-grid">
          {popular.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
