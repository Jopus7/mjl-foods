import logo from '../../assets/logo.png';
import styles from './Footer.module.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
        <div className={styles['footer-top']}>
          <div className={styles['footer-brand']}>
            <img src={logo} alt="MJL Foods" className={styles['footer-logo']} />
            <p className={styles['footer-tagline']}>
              Smak, który czujesz. Świeżość, którą widać.
            </p>
          </div>

          <div className={styles['footer-cols']}>
            <div className={styles['footer-col']}>
              <h4>Kontakt</h4>
              <ul>
                <li>
                  <a href="mailto:hello@mjlfoods.pl">hello@mjlfoods.pl</a>
                </li>
                <li>
                  <a href="tel:+48000000000">+48 000 000 000</a>
                </li>
                <li>Pon–Nie · 11:00–22:00</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles['footer-bottom']}>
          <span className={styles['footer-copy']}>
            © {year} MJL Foods. Wszelkie prawa zastrzeżone.
          </span>
          <span className={styles['footer-credit']}>
            Stworzone przez:&nbsp;
            <strong>Maja Maj</strong>
            <span aria-hidden="true"> · </span>
            <strong>Michał Jopa</strong>
            <span aria-hidden="true"> · </span>
            <strong>Marcin Ligocki</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
