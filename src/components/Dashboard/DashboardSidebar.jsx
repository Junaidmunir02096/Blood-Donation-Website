import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faDroplet,
  faEnvelope,
  faGear,
  faShieldHalved,
  faTableColumns,
  faCircleQuestion,
  faRightFromBracket,
  faPlus,
  faBars,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import './DashboardSidebar.scss';

const tabs = [
  { id: 'dashboard',        label: 'Dashboard',       icon: faTableColumns },
  { id: 'donation-history', label: 'Donation History', icon: faClock        },
  { id: 'active-requests',  label: 'Active Requests',  icon: faDroplet      },
  { id: 'messages',         label: 'Messages',         icon: faEnvelope     },
  { id: 'admin-panel',      label: 'Admin Panel',      icon: faShieldHalved },
  { id: 'settings',         label: 'Settings',         icon: faGear         },
];

const DashboardSidebar = ({ activeTab, onTabChange }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const firstFocusableRef = useRef(null);

  /* ── close drawer on route change ── */
  const handleTab = (id) => {
    onTabChange(id);
    setDrawerOpen(false);
  };

  /* ── close drawer when clicking the backdrop ── */
  const handleBackdropClick = (e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) {
      setDrawerOpen(false);
    }
  };

  /* ── trap body scroll while drawer is open ── */
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      /* focus first interactive element inside drawer */
      setTimeout(() => firstFocusableRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  /* ── close drawer on Escape ── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ────────────────────────────────────────────────────────────
     Shared sidebar content — used in both desktop & drawer
  ──────────────────────────────────────────────────────────── */
  const SidebarContent = ({ isMobile = false }) => (
    <>
      {/* Profile */}
      <div className="dashboard-sidebar__profile">
        <div className="dashboard-sidebar__avatar-fallback" aria-hidden="true">AJ</div>
        <div>
          <p className="dashboard-sidebar__welcome">Welcome back,</p>
          <p className="dashboard-sidebar__name">Donor ID: #8821</p>
        </div>
      </div>

      {/* New Request CTA */}
      <button
        className="dashboard-sidebar__cta"
        id={isMobile ? 'mobile-new-request' : 'dashboard-new-request'}
        type="button"
        onClick={() => handleTab('active-requests')}
        ref={isMobile ? firstFocusableRef : null}
      >
        <FontAwesomeIcon icon={faPlus} />
        New Request
      </button>

      {/* Main Navigation */}
      <nav className="dashboard-sidebar__nav" aria-label="Main navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`dashboard-sidebar__tab${activeTab === tab.id ? ' dashboard-sidebar__tab--active' : ''}`}
            onClick={() => handleTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="dashboard-sidebar__tab-icon" aria-hidden="true">
              <FontAwesomeIcon icon={tab.icon} />
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Links */}
      <div className="dashboard-sidebar__footer">
        <button
          type="button"
          className="dashboard-sidebar__footer-link"
          onClick={() => handleTab('help-center')}
          id={isMobile ? 'mobile-sidebar-help' : 'sidebar-help'}
        >
          <span className="dashboard-sidebar__footer-icon" aria-hidden="true">
            <FontAwesomeIcon icon={faCircleQuestion} />
          </span>
          Help Center
        </button>
        <button
          type="button"
          className="dashboard-sidebar__footer-link dashboard-sidebar__footer-link--muted"
          onClick={() => handleTab('logout')}
          id={isMobile ? 'mobile-sidebar-logout' : 'sidebar-logout'}
        >
          <span className="dashboard-sidebar__footer-icon" aria-hidden="true">
            <FontAwesomeIcon icon={faRightFromBracket} />
          </span>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          DESKTOP Sidebar  (hidden below $bp-lg)
      ══════════════════════════════════════════════════════ */}
      <aside className="dashboard-sidebar dashboard-sidebar--desktop" aria-label="Dashboard navigation">
        <SidebarContent isMobile={false} />
      </aside>

      {/* ══════════════════════════════════════════════════════
          MOBILE Top-bar  (visible below $bp-lg)
      ══════════════════════════════════════════════════════ */}
      <header className="db-topbar" role="banner">
        {/* Brand */}
        <div className="db-topbar__brand">
          <span className="db-topbar__logo-icon" aria-hidden="true">
            <FontAwesomeIcon icon={faDroplet} />
          </span>
          <span className="db-topbar__brand-name">
            Life<strong>Stream</strong>
          </span>
        </div>

        {/* Active page label */}
        <span className="db-topbar__page-label" aria-live="polite">
          {tabs.find((t) => t.id === activeTab)?.label ?? 'Dashboard'}
        </span>

        {/* Hamburger */}
        <button
          className="db-topbar__menu-btn"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          aria-controls="db-drawer"
          id="db-menu-toggle"
          onClick={() => setDrawerOpen(true)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </header>

      {/* ══════════════════════════════════════════════════════
          Backdrop overlay
      ══════════════════════════════════════════════════════ */}
      <div
        className={`db-backdrop${drawerOpen ? ' db-backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
      />

      {/* ══════════════════════════════════════════════════════
          DRAWER  (slides in from right)
      ══════════════════════════════════════════════════════ */}
      <aside
        id="db-drawer"
        className={`db-drawer${drawerOpen ? ' db-drawer--open' : ''}`}
        aria-label="Navigation drawer"
        aria-hidden={!drawerOpen}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer header */}
        <div className="db-drawer__header">
          <div className="db-drawer__brand">
            <span className="db-drawer__logo-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faDroplet} />
            </span>
            <span className="db-drawer__brand-name">
              Life<strong>Stream</strong>
            </span>
          </div>
          <button
            className="db-drawer__close-btn"
            type="button"
            aria-label="Close navigation menu"
            id="db-drawer-close"
            onClick={() => setDrawerOpen(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Drawer body — reuse sidebar content */}
        <div className="db-drawer__body">
          <SidebarContent isMobile={true} />
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
