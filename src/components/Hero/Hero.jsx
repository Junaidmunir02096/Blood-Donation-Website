import { Link } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import './Hero.scss';

const Hero = () => {
  const { getStats } = useAppData();
  const pending = getStats().activeRequests;

  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero__inner">
          <div className="hero__content">
            <div className="hero__badge" role="status" aria-live="polite">
              <span className="badge-dot" aria-hidden="true"></span>
              {pending > 0
                ? `${pending} pending blood request${pending === 1 ? '' : 's'} in this demo`
                : 'Search verified donors across Pakistan'}
            </div>

            <h1 className="hero__heading" id="hero-heading">
              Donate Blood,<br />
              <span className="highlight">Save Lives.</span>
            </h1>

            <p className="hero__description">
              LifeStream matches voluntary donors with patients in Pakistani cities.
              Search by blood group, submit a hospital request, or register as a donor.
            </p>

            <div className="hero__actions">
              <Link to="/donate" className="hero__btn-primary" id="btn-become-donor" aria-label="Become a Donor">
                Become a Donor
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/search" className="hero__btn-secondary" id="btn-find-blood" aria-label="Find Blood">
                Find Blood
              </Link>
            </div>
          </div>

          <div className="hero__image-wrapper">
            <div className="hero__image-decoration" aria-hidden="true"></div>
            <div className="hero__image-decoration-2" aria-hidden="true"></div>
            <div className="hero__image-card">
              <img
                src="/hero-image.png"
                alt="Medical blood donation equipment on a clinical table"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
