import { useMenuData } from '../../hooks/useMenuData';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Menu.module.css';

const Menu = () => {
  const { menu, isLoading } = useMenuData();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingDot} />
        <span className={styles.loadingDot} />
        <span className={styles.loadingDot} />
        <p>Ładowanie pyszności…</p>
      </div>
    );
  }

  return (
    <div className={styles.menuContainer}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>
          Nasze <em>Menu</em>
        </h1>
        <p className={styles.lede}>
          Klasyki, którym ufasz, i nowości, które warto spróbować.
        </p>
      </header>

      {menu.map((category) => (
        <div key={category.categoryName} className={styles.categorySection}>
          <div className={styles.categoryHead}>
            <h2 className={styles.categoryTitle}>{category.categoryName}</h2>
            <span className={styles.categoryCount}>
              {category.items.length}{' '}
              {category.items.length === 1 ? 'pozycja' : 'pozycji'}
            </span>
          </div>
          <div className={styles.grid}>
            {category.items.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
