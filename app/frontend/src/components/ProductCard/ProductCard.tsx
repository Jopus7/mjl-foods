import { useState } from 'react';
import { Product } from '../../types';
import styles from './ProductCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';

interface Props {
  item: Product;
}

const ProductCard = ({ item }: Props) => {
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {!imgError ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className={styles.image}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.imageFallback}>
            <FontAwesomeIcon
              icon={faUtensils}
              className={styles.fallbackIcon}
            />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.desc}>{item.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>
            {item.price}
            <span className={styles.currency}> zł</span>
          </span>
          <button
            className={styles.addButton}
            aria-label={`Dodaj ${item.name} do koszyka`}
            onClick={() => addToCart(item)}
          >
            <span className={styles.plus}>
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span>Dodaj</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
