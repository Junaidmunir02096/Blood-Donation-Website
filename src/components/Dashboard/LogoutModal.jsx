import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDroplet,
  faRightFromBracket,
  faShieldHalved,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import './LogoutModal.scss';

/**
 * LogoutModal
 * ──────────────────────────────────────────────────────────
 * Full-screen overlay shown when the user clicks "Logout" in
 * the dashboard sidebar.
 *
 * Props:
 *   onStay  () → void   — dismiss the modal, stay on dashboard
 */
const LogoutModal = ({ onStay }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();


  /* Lock body scroll while modal is open */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* ESC key → stay logged in */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onStay(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onStay]);

  const handleLogout = () => {
    logout();       // ← clears AuthContext state + localStorage
    navigate('/');
  };


  return (
    <div
      className="logout-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
      onClick={(e) => e.target === e.currentTarget && onStay()}
    >
      {/* ── Top Brand Bar ── */}
      <header className="logout-topbar" role="banner">
        <a href="/" className="logout-topbar__brand" aria-label="LifeStream home">
          <FontAwesomeIcon icon={faDroplet} className="logout-topbar__logo-icon" />
          Life<strong>Stream</strong>
        </a>
      </header>

      {/* ── Card ── */}
      <div className="logout-card" role="document">

        {/* Icon */}
        <div className="logout-card__icon-wrap" aria-hidden="true">
          <FontAwesomeIcon icon={faHeart} className="logout-card__icon" />
          <span className="logout-card__icon-drop" aria-hidden="true">
            <FontAwesomeIcon icon={faDroplet} />
          </span>
        </div>

        {/* Heading */}
        <h1 className="logout-card__title" id="logout-title">
          Are you sure you want<br />to log out?
        </h1>

        <p className="logout-card__desc" id="logout-desc">
          You will need to log back in to manage your donations or requests.
          Every drop counts, and we hope to see you back soon.
        </p>

        {/* ── Action Buttons ── */}
        <div className="logout-card__actions">
          <button
            className="logout-btn logout-btn--confirm"
            type="button"
            id="btn-confirm-logout"
            onClick={handleLogout}
            autoFocus
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Log Out
          </button>

          <button
            className="logout-btn logout-btn--stay"
            type="button"
            id="btn-stay-logged-in"
            onClick={onStay}
          >
            <FontAwesomeIcon icon={faShieldHalved} />
            Stay Logged In
          </button>
        </div>

        {/* Divider + Quote */}
        <div className="logout-card__divider" role="separator" aria-hidden="true" />
        <p className="logout-card__quote">
          "Saving lives, one logout at a time. See you later!"
        </p>
      </div>

      {/* ── Slim Footer ── */}
      <footer className="logout-footer" role="contentinfo">
        <nav className="logout-footer__links" aria-label="Footer navigation">
          {['Privacy Policy', 'Terms of Service', 'Contact Us', 'Careers', 'Press Kit'].map((label) => (
            <a
              key={label}
              href="#"
              className="logout-footer__link"
              id={`logout-footer-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {label}
            </a>
          ))}
        </nav>
        <p className="logout-footer__copy">
          © {new Date().getFullYear()} LifeStream. Every drop counts.
        </p>
      </footer>
    </div>
  );
};

export default LogoutModal;
