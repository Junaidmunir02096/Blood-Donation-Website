import { useState, useEffect, useRef } from 'react';
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
import { useAuth } from '../../context/AuthContext';

const allTabs = [
  { id: 'dashboard',        label: 'Dashboard',        icon: faTableColumns, adminOnly: false },
  { id: 'donation-history', label: 'Donation History', icon: faClock,        adminOnly: false },
  { id: 'active-requests',  label: 'Active Requests',  icon: faDroplet,      adminOnly: false },
  { id: 'messages',         label: 'Messages',         icon: faEnvelope,     adminOnly: false },
  { id: 'admin-panel',      label: 'Admin Panel',      icon: faShieldHalved, adminOnly: true  },
  { id: 'settings',         label: 'Settings',         icon: faGear,         adminOnly: false },
];

const SidebarContent = ({ activeTab, onSelect, isMobile = false, ctaRef, currentUser }) => {
  const initials = currentUser?.fullName
    ? currentUser.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const displayName = currentUser?.fullName ?? 'Guest';
  const role        = currentUser?.role ?? 'donor';
  const isAdmin     = role === 'admin';
  const tabs        = allTabs.filter((t) => !t.adminOnly || isAdmin);

  return (
    <>
      <div className="dashboard-sidebar__profile">
        <div className="dashboard-sidebar__avatar-fallback" aria-hidden="true">{initials}</div>
        <div>
          <p className="dashboard-sidebar__welcome">Welcome back,</p>
          <p className="dashboard-sidebar__name">{displayName}</p>
        </div>
      </div>

      <button
        className="dashboard-sidebar__cta"
        id={isMobile ? 'mobile-new-request' : 'dashboard-new-request'}
        type="button"
        onClick={() => onSelect('active-requests')}
        ref={isMobile ? ctaRef : null}
      >
        <FontAwesomeIcon icon={faPlus} />
        New Request
      </button>

      <nav className="dashboard-sidebar__nav" aria-label="Main navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`dashboard-sidebar__tab${activeTab === tab.id ? ' dashboard-sidebar__tab--active' : ''}`}
            onClick={() => onSelect(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="dashboard-sidebar__tab-icon" aria-hidden="true">
              <FontAwesomeIcon icon={tab.icon} />
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="dashboard-sidebar__footer">
        <button
          type="button"
          className="dashboard-sidebar__footer-link"
          onClick={() => onSelect('help-center')}
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
          onClick={() => onSelect('logout')}
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
};

const DashboardSidebar = ({ activeTab, onTabChange }) => {
  const { currentUser } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const firstFocusableRef = useRef(null);

  const handleSelect = (id) => {
    onTabChange(id);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      const id = setTimeout(() => firstFocusableRef.current?.focus(), 50);
      return () => {
        clearTimeout(id);
        document.body.style.overflow = '';
      };
    }
    document.body.style.overflow = '';
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <aside className="dashboard-sidebar dashboard-sidebar--desktop" aria-label="Dashboard navigation">
        <SidebarContent activeTab={activeTab} onSelect={handleSelect} currentUser={currentUser} />
      </aside>

      <header className="db-topbar" role="banner">
        <div className="db-topbar__brand">
          <span className="db-topbar__logo-icon" aria-hidden="true">
            <FontAwesomeIcon icon={faDroplet} />
          </span>
          <span className="db-topbar__brand-name">
            Life<strong>Stream</strong>
          </span>
        </div>

        <span className="db-topbar__page-label" aria-live="polite">
          {allTabs.find((t) => t.id === activeTab)?.label ?? 'Dashboard'}
        </span>

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

      <div
        className={`db-backdrop${drawerOpen ? ' db-backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        id="db-drawer"
        className={`db-drawer${drawerOpen ? ' db-drawer--open' : ''}`}
        aria-label="Navigation drawer"
        aria-hidden={!drawerOpen}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
      >
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

        <div className="db-drawer__body">
          <SidebarContent
            activeTab={activeTab}
            onSelect={handleSelect}
            isMobile
            ctaRef={firstFocusableRef}
            currentUser={currentUser}
          />
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
