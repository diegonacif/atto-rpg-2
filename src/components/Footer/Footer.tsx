import hpOrb from '../../assets/hp-orb.png';
import fpOrb from '../../assets/fp-orb.png';

export const Footer = () => {
  return (
    <div className="footer-container">
      <div className="hp-wrapper">
        <img src={hpOrb} alt="health orb" />
        <span>12</span>
      </div>
      <div className="fp-wrapper">
        <img src={fpOrb} alt="fatigue orb" />
        <span>10</span>
      </div>
    </div>
  )
}
