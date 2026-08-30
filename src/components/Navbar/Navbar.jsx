import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faDroplet,
  faHouse,
  faMagnifyingGlass,
  faHandHoldingDroplet,
  faCircleInfo,
  faRightToBracket,
  faHeartPulse,
  faGaugeHigh,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/avatar';
import './Navbar.scss';

const NAV_LINKS = [
  { to: '/',        label: 'Home',         icon: faHouse,             end: true },
  { to: '/search',  label: 'Search Blood', icon: faMagnifyingGlass },
  { to: '/request', label: 'Requests',     icon: faHandHoldingDroplet },
  { to: '/about',   label: 'About Us',     icon: faCircleInfo },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const triggerRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const initials = getInitials(currentUser?.fullName);

  return (
    <>
      <nav
        className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <div className="container">
          <div className="navbar__inner">
            <Link
              to="/"
              className="navbar__logo"
              id="nav-logo"
              aria-label="Go to home"
            >
              <span className="navbar__logo-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faDroplet} />
              </span>
              Life<span>Stream</span>
            </Link>

            <ul className="navbar__nav">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `navbar__link${isActive ? ' navbar__link--active' : ''}`
                    }
                    id={`nav-${link.to === '/' ? 'landing' : link.to.slice(1)}`}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <form onSubmit={handleSearchSubmit} className="navbar__search" role="search">
              <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search city, name, or blood group"
                id="nav-search-input"
                aria-label="Search donors by city, name, or blood group"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="navbar__actions">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="navbar__user"
                    id="nav-dashboard-link"
                    aria-label={`Open dashboard for ${currentUser?.fullName || 'account'}`}
                  >
                    <span className="navbar__avatar" aria-hidden="true">{initials}</span>
                    <span className="navbar__user-name">{currentUser?.fullName?.split(' ')[0]}</span>
                  </Link>
                  <button
                    type="button"
                    className="navbar__login-btn"
                    id="btn-logout-nav"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  <Link
                    to="/donate"
                    className="navbar__donate-btn"
                    id="btn-donate-nav"
                  >
                    Donate Now
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth?mode=login"
                    className="navbar__login-btn"
                    id="btn-login"
                  >
                    Login
                  </Link>
                  <Link
                    to="/donate"
                    className="navbar__donate-btn"
                    id="btn-donate-nav"
                  >
                    Donate Now
                  </Link>
                </>
              )}
            </div>

            <button
              ref={triggerRef}
              className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
              type="button"
              id="nav-menu-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="nav-mobile-drawer"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="navbar__hamburger-bar" />
              <span className="navbar__hamburger-bar" />
              <span className="navbar__hamburger-bar" />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`nav-backdrop${menuOpen ? ' nav-backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />

      <aside
        id="nav-mobile-drawer"
        className={`nav-drawer${menuOpen ? ' nav-drawer--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
      >
        <div className="nav-drawer__header">
          <div className="nav-drawer__brand">
            <span className="nav-drawer__brand-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faDroplet} />
            </span>
            <span className="nav-drawer__brand-name">
              Life<strong>Stream</strong>
            </span>
          </div>
          <button
            className="nav-drawer__close"
            type="button"
            aria-label="Close menu"
            id="nav-drawer-close"
            onClick={() => setMenuOpen(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="nav-drawer__search-wrap" role="search">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="nav-drawer__search-icon" aria-hidden="true" />
          <input
            type="search"
            className="nav-drawer__search-input"
            placeholder="Search blood type, city, or name…"
            aria-label="Search donors"
            id="nav-drawer-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <nav className="nav-drawer__nav" aria-label="Mobile navigation links">
          <p className="nav-drawer__section-label">Navigation</p>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `nav-drawer__link${isActive ? ' nav-drawer__link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-drawer__link-icon" aria-hidden="true">
                <FontAwesomeIcon icon={link.icon} />
              </span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav-drawer__divider" aria-hidden="true" />

        <div className="nav-drawer__actions">
          <p className="nav-drawer__section-label">Account</p>
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="nav-drawer__login-btn"
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faGaugeHigh} />
                Dashboard
              </Link>
              <button
                className="nav-drawer__login-btn"
                type="button"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth?mode=login"
              className="nav-drawer__login-btn"
              onClick={() => setMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faRightToBracket} />
              Login
            </Link>
          )}
          <Link
            to="/donate"
            className="nav-drawer__donate-btn"
            onClick={() => setMenuOpen(false)}
          >
            <FontAwesomeIcon icon={faHeartPulse} />
            Donate Now
          </Link>
        </div>

        <div className="nav-drawer__footer">
          <FontAwesomeIcon icon={faDroplet} className="nav-drawer__footer-icon" aria-hidden="true" />
          <p>Every drop of blood saves a life.</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
