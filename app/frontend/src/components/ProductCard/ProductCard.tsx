import { Product } from '../../types';
import styles from './ProductCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Props {
  item: Product;
}

const ProductCard = ({ item }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={item.imageUrl} alt={item.name} className={styles.image} />
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
