import React from 'react';
import './Navbar.scss';

const Navbar = () => {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="navbar__inner">
          {/* Logo */}
          <a href="#" className="navbar__logo" id="nav-logo">
            Life<span>Stream</span>
          </a>

          {/* Nav Links */}
          <ul className="navbar__nav" role="menubar">
            <li role="none">
              <a href="#home" className="navbar__link navbar__link--active" id="nav-home" role="menuitem">Home</a>
            </li>
            <li role="none">
              <a href="#search" className="navbar__link" id="nav-search" role="menuitem">Search Blood</a>
            </li>
            <li role="none">
              <a href="#requests" className="navbar__link" id="nav-requests" role="menuitem">Requests</a>
            </li>
            <li role="none">
              <a href="#about" className="navbar__link" id="nav-about" role="menuitem">About Us</a>
            </li>
          </ul>

          {/* Search */}
          <div className="navbar__search" role="search">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Search..." id="nav-search-input" aria-label="Search" />
          </div>

          {/* Actions */}
          <div className="navbar__actions">
            <button className="navbar__login-btn" id="btn-login" aria-label="Login">Login</button>
            <button className="navbar__donate-btn" id="btn-donate-nav" aria-label="Donate Now">Donate Now</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
