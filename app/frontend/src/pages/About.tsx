import React from "react";

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1>O nas</h1>
      <p>
        Jesteśmy pasjonatami dobrego jedzenia. Nasza kuchnia łączy tradycję z
        nowoczesnością.
      </p>
      <img src="/kitchen.jpg" alt="Nasza kuchnia" />
    </div>
  );
};

export default About;
