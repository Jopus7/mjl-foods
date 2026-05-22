import React from 'react';
import { useMenuData } from '../../hooks/useMenuData';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Menu.module.css';

const Menu: React.FC = () => {
  const { menu, isLoading } = useMenuData();

  if (isLoading) {
    return <div className={styles.loading}>Ładowanie pyszności...</div>;
  }

  return (
    <div className={styles.menuContainer}>
      <h1 className={styles.mainTitle}>Nasze Menu</h1>
      {menu.map((category) => (
        <section key={category.categoryName} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>{category.categoryName}</h2>
          <div className={styles.grid}>
            {category.items.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Menu;
