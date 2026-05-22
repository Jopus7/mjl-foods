import AboutIllustration from '../../components/AboutIllustration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUtensils,
  faMapMarkerAlt,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles['about-container']}>
      <header className={styles['about-hero']}>
        <span className={styles['hero-eyebrow']}>Nasza historia</span>
        <h1>
          Gotujemy z <em>pasją</em>,<br />
          dostarczamy z <em>sercem</em>.
        </h1>
        <p className={styles['about-lede']}>
          Jesteśmy pasjonatami dobrego jedzenia. Nasza kuchnia łączy tradycję z
          nowoczesnością — sięgamy po lokalne, świeże składniki i serwujemy je w
          sposób, który smakuje jak w domu, a wygląda jak w restauracji.
        </p>
      </header>

      <div className={styles['about-story']}>
        <div className={styles['about-story-text']}>
          <h2>Skąd się wzięliśmy</h2>
          <p>
            MJL Foods zaczęło się od prostej myśli: dobre jedzenie nie powinno
            być luksusem. Zebraliśmy zespół ludzi, dla których kuchnia to coś
            więcej niż praca — to codzienna przyjemność.
          </p>
          <p>
            Od pierwszego dnia stawiamy na lokalnych dostawców, świeże składniki
            i przepisy, które łączą polską klasykę z odważnymi inspiracjami z
            całego świata.
          </p>

          <div className={styles['about-stats']}>
            <div className={styles['about-stat']}>
              <span className={styles['about-stat-num']}>2021</span>
              <span className={styles['about-stat-label']}>Rok założenia</span>
            </div>
            <div className={styles['about-stat']}>
              <span className={styles['about-stat-num']}>15+</span>
              <span className={styles['about-stat-label']}>
                Lokalnych dostawców
              </span>
            </div>
            <div className={styles['about-stat']}>
              <span className={styles['about-stat-num']}>100%</span>
              <span className={styles['about-stat-label']}>
                Świeżych składników
              </span>
            </div>
          </div>
        </div>

        <AboutIllustration />
      </div>

      <div className={styles['about-values']}>
        <h2 className={styles['about-values-title']}>W co wierzymy</h2>
        <div className={styles['values-grid']}>
          <div className={styles['value-card']}>
            <div
              className={`${styles['value-icon']} ${styles['value-icon-orange']}`}
              aria-hidden="true"
            >
              <FontAwesomeIcon icon={faUtensils} />
            </div>
            <h3>Świeżość</h3>
            <p>
              Składniki kupujemy codziennie od lokalnych dostawców. Bez
              mrożenia, bez kompromisów.
            </p>
          </div>

          <div className={styles['value-card']}>
            <div
              className={`${styles['value-icon']} ${styles['value-icon-green']}`}
              aria-hidden="true"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <h3>Lokalność</h3>
            <p>
              Pracujemy z polskimi rolnikami i piekarniami. Wspieramy tych,
              którzy są obok.
            </p>
          </div>

          <div className={styles['value-card']}>
            <div
              className={`${styles['value-icon']} ${styles['value-icon-dark']}`}
              aria-hidden="true"
            >
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <h3>Pasja</h3>
            <p>
              Każde danie powstaje z myślą o osobie, która je dostanie. To nasza
              definicja jakości.
            </p>
          </div>
        </div>
      </div>

      <div className={styles['about-team']}>
        <h2>Zespół, który to tworzy</h2>
        <p>
          Za MJL Foods stoi grupa ludzi, których łączy jedno — przekonanie, że
          jedzenie ma znaczenie. Każdego dnia dbamy o to, żeby smak, jakość i
          obsługa były na poziomie, do którego sami chcielibyśmy wracać.
        </p>
      </div>
    </div>
  );
};

export default About;
