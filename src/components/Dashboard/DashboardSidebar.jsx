import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faDroplet,
  faEnvelope,
  faGear,
  faShieldHalved,
  faTableColumns,
} from '@fortawesome/free-solid-svg-icons';
import './DashboardSidebar.scss';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: faTableColumns },
  { id: 'donation-history', label: 'Donation History', icon: faClock },
  { id: 'active-requests', label: 'Active Requests', icon: faDroplet },
  { id: 'messages', label: 'Messages', icon: faEnvelope },
  { id: 'admin-panel', label: 'Admin Panel', icon: faShieldHalved },
  { id: 'settings', label: 'Settings', icon: faGear },
];

const DashboardSidebar = ({ activeTab, onTabChange }) => {
  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
      <div className="dashboard-sidebar__profile">
        <div className="dashboard-sidebar__avatar" aria-hidden="true">
          <span>AJ</span>
        </div>
        <div>
          <p className="dashboard-sidebar__welcome">Welcome back,</p>
          <p className="dashboard-sidebar__name">Donor ID: #8821</p>
        </div>
      </div>

      <button className="dashboard-sidebar__cta" id="dashboard-new-request" type="button">
        + New Request
      </button>

      <nav className="dashboard-sidebar__nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`dashboard-sidebar__tab${activeTab === tab.id ? ' dashboard-sidebar__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="dashboard-sidebar__tab-icon">
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
          onClick={() => onTabChange('help-center')}
        >
          Help Center
        </button>
        <button
          type="button"
          className="dashboard-sidebar__footer-link dashboard-sidebar__footer-link--muted"
          onClick={() => onTabChange('logout')}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
