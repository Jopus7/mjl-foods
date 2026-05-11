import React from 'react';
import { Product } from '../../types';
import styles from './ProductCard.module.css';

interface Props {
  item: Product;
}

const ProductCard: React.FC<Props> = ({ item }) => {
  return (
    <div className={styles.card}>
      <img src={item.imageUrl} alt={item.name} className={styles.image} />
      <div className={styles.content}>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <span className={styles.price}>{item.price} PLN</span>
        <button className={styles.addButton}>Dodaj +</button>
      </div>
    </div>
  );
};

export default ProductCard;
