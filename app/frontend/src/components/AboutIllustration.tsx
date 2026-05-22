const AboutIllustration = () => {
  return (
    <figure className="about-story-figure" aria-hidden="true">
      <svg
        className="about-figure-svg"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="aboutWarmGlow" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FBE7CF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#F3ECDE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="180" fill="url(#aboutWarmGlow)" />

        <circle
          className="about-figure-ring"
          cx="200"
          cy="200"
          r="155"
          fill="none"
          stroke="#5A9A2E"
          strokeWidth="1.5"
          strokeDasharray="3 8"
          opacity="0.5"
        />

        <line
          x1="40"
          y1="200"
          x2="80"
          y2="200"
          stroke="#5A9A2E"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="320"
          y1="200"
          x2="360"
          y2="200"
          stroke="#5A9A2E"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <g
          className="about-figure-steam"
          stroke="#5A9A2E"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M165 130 Q160 115 170 100 Q180 85 170 70" />
          <path d="M200 130 Q195 115 205 100 Q215 85 205 70" />
          <path d="M235 130 Q230 115 240 100 Q250 85 240 70" />
        </g>

        <g>
          <circle cx="200" cy="138" r="6" fill="#E07A1A" />
          <path
            d="M 130 215 Q 130 150 200 150 Q 270 150 270 215 Z"
            fill="none"
            stroke="#E07A1A"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M 160 190 Q 165 175 180 170"
            fill="none"
            stroke="#E07A1A"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
          <rect x="115" y="213" width="170" height="12" rx="6" fill="#E07A1A" />
          <circle cx="135" cy="232" r="4" fill="#E07A1A" />
          <circle cx="265" cy="232" r="4" fill="#E07A1A" />
        </g>

        <g fill="#5A9A2E">
          <ellipse
            cx="95"
            cy="265"
            rx="14"
            ry="6"
            transform="rotate(-30 95 265)"
          />
          <ellipse
            cx="110"
            cy="280"
            rx="11"
            ry="5"
            transform="rotate(-15 110 280)"
          />
          <ellipse
            cx="305"
            cy="265"
            rx="14"
            ry="6"
            transform="rotate(30 305 265)"
          />
          <ellipse
            cx="290"
            cy="280"
            rx="11"
            ry="5"
            transform="rotate(15 290 280)"
          />
        </g>

        <g fill="#1F1F2E" opacity="0.35">
          <circle cx="320" cy="120" r="3" />
          <circle cx="80" cy="135" r="2" />
          <circle cx="345" cy="290" r="2.5" />
          <circle cx="65" cy="310" r="3" />
        </g>
      </svg>
    </figure>
  );
};

export default AboutIllustration;
