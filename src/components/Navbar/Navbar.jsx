import { useState, useEffect, useRef } from 'react';
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
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.scss';

const NAV_LINKS = [
  { id: 'landing',  label: 'Home',         icon: faHouse,               action: 'onHomeClick'    },
  { id: 'search',   label: 'Search Blood', icon: faMagnifyingGlass,      action: 'onSearchClick'  },
  { id: 'request',  label: 'Requests',     icon: faHandHoldingDroplet,   action: 'onRequestClick' },
  { id: 'about',    label: 'About Us',     icon: faCircleInfo,           action: 'onAboutClick'   },
];

const Navbar = ({
  activePage = 'landing',
  onLoginClick,
  onDonateClick,
  onHomeClick,
  onSearchClick,
  onRequestClick,
  onAboutClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const drawerRef  = useRef(null);
  const triggerRef = useRef(null);

  const handlers = { onHomeClick, onSearchClick, onRequestClick, onAboutClick };

  /* ── elevate navbar on scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── lock body scroll while mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* ── close on Escape ── */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNavClick = (actionKey) => {
    handlers[actionKey]?.();
    setMenuOpen(false);
  };

  const handleLogin = () => { onLoginClick?.(); setMenuOpen(false); };
  const handleDonate = () => { onDonateClick?.(); setMenuOpen(false); };

  return (
    <>
      <nav
        className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container">
          <div className="navbar__inner">

            {/* ── Logo ── */}
            <button
              className="navbar__logo"
              id="nav-logo"
              onClick={onHomeClick}
              aria-label="Go to home"
            >
              <span className="navbar__logo-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faDroplet} />
              </span>
              Life<span>Stream</span>
            </button>

            {/* ── Desktop Nav Links ── */}
            <ul className="navbar__nav" role="menubar">
              {NAV_LINKS.map((link) => (
                <li key={link.id} role="none">
                  <button
                    className={`navbar__link${activePage === link.id ? ' navbar__link--active' : ''}`}
                    id={`nav-${link.id}`}
                    role="menuitem"
                    onClick={() => handleNavClick(link.action)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* ── Desktop Search ── */}
            <div className="navbar__search" role="search">
              <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search..."
                id="nav-search-input"
                aria-label="Search"
              />
            </div>

            {/* ── Desktop Actions ── */}
            <div className="navbar__actions">
              <button
                className="navbar__login-btn"
                id="btn-login"
                aria-label="Login"
                onClick={onLoginClick}
              >
                Login
              </button>
              <button
                className="navbar__donate-btn"
                id="btn-donate-nav"
                aria-label="Donate Now"
                onClick={onDonateClick}
              >
                Donate Now
              </button>
            </div>

            {/* ── Mobile Hamburger ── */}
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

      {/* ── Backdrop ── */}
      <div
        className={`nav-backdrop${menuOpen ? ' nav-backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Mobile Drawer ── */}
      <aside
        id="nav-mobile-drawer"
        ref={drawerRef}
        className={`nav-drawer${menuOpen ? ' nav-drawer--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer header */}
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

        {/* Drawer search */}
        <div className="nav-drawer__search-wrap" role="search">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="nav-drawer__search-icon" aria-hidden="true" />
          <input
            type="text"
            className="nav-drawer__search-input"
            placeholder="Search blood type, location…"
            aria-label="Search"
            id="nav-drawer-search"
          />
        </div>

        {/* Drawer nav links */}
        <nav className="nav-drawer__nav" aria-label="Mobile navigation links">
          <p className="nav-drawer__section-label">Navigation</p>
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className={`nav-drawer__link${activePage === link.id ? ' nav-drawer__link--active' : ''}`}
              id={`nav-drawer-${link.id}`}
              onClick={() => handleNavClick(link.action)}
            >
              <span className="nav-drawer__link-icon" aria-hidden="true">
                <FontAwesomeIcon icon={link.icon} />
              </span>
              <span>{link.label}</span>
              {activePage === link.id && (
                <span className="nav-drawer__link-dot" aria-hidden="true" />
              )}
            </button>
          ))}
        </nav>

        {/* Drawer divider */}
        <div className="nav-drawer__divider" aria-hidden="true" />

        {/* Drawer CTA buttons */}
        <div className="nav-drawer__actions">
          <p className="nav-drawer__section-label">Account</p>
          <button
            className="nav-drawer__login-btn"
            type="button"
            id="nav-drawer-login"
            onClick={handleLogin}
          >
            <FontAwesomeIcon icon={faRightToBracket} />
            Login
          </button>
          <button
            className="nav-drawer__donate-btn"
            type="button"
            id="nav-drawer-donate"
            onClick={handleDonate}
          >
            <FontAwesomeIcon icon={faHeartPulse} />
            Donate Now
          </button>
        </div>

        {/* Drawer footer */}
        <div className="nav-drawer__footer">
          <FontAwesomeIcon icon={faDroplet} className="nav-drawer__footer-icon" aria-hidden="true" />
          <p>Every drop of blood saves a life.</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
