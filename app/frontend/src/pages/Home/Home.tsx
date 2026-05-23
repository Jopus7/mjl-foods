import { Link } from 'react-router-dom';
import { useHomeData } from '../../hooks/useHomeData';
import ProductCard from '../../components/ProductCard/ProductCard';
import logo from '../../assets/logo.png';
import styles from './Home.module.css';

const Home = () => {
  const { popularProducts, isLoading } = useHomeData();

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

      {isLoading && (
        <div className={styles['popular-items']}>
          <p style={{ textAlign: 'center' }}>Ładowanie popularnych dań...</p>
        </div>
      )}

      {!isLoading && popularProducts.length > 0 && (
        <div className={styles['popular-items']}>
          <div className={styles['section-head']}>
            <h2>Najpopularniejsze</h2>
          </div>
          <div className={styles['product-grid']}>
            {popularProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
