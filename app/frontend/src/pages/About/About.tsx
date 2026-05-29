import { useEffect, useRef } from 'react';
import AboutIllustration from '../../components/AboutIllustration/AboutIllustration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUtensils,
  faMapMarkerAlt,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import styles from './About.module.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const About = () => {
  const position: [number, number] = [52.2297, 21.0122];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: position,
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(position)
      .addTo(map)
      .bindPopup(
        '<strong>MJL Foods</strong><br />ul. Marszałkowska 100<br />00-016 Warszawa'
      );

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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

      <div className={`${styles['about-team']} ${styles['about-location']}`}>
        <h2>Gdzie nas znajdziesz?</h2>
        <p>Zapraszamy do naszej restauracji w sercu Warszawy!</p>
        <div className={styles['map-wrapper']}>
          <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default About;
