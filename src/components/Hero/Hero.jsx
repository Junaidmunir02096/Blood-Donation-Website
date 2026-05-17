import React from 'react';
import './Hero.scss';

const Hero = () => {
  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero__inner">
          {/* Content */}
          <div className="hero__content">
            <div className="hero__badge" role="status" aria-live="polite">
              <span className="badge-dot" aria-hidden="true"></span>
              Urgent Need in Your Area
            </div>

            <h1 className="hero__heading" id="hero-heading">
              Donate Blood,<br />
              <span className="highlight">Save Lives.</span>
            </h1>

            <p className="hero__description">
              Join our modern donor network. Your single donation can save up to 
              three lives. Experience a seamless, compassionate process from 
              registration to recovery.
            </p>

            <div className="hero__actions">
              <button className="hero__btn-primary" id="btn-become-donor" aria-label="Become a Donor">
                Become a Donor
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="hero__btn-secondary" id="btn-find-blood" aria-label="Find Blood">
                Find Blood
              </button>
            </div>
          </div>

          {/* Image */}
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
