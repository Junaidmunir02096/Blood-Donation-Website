import { useState } from 'react';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar';
import DashboardOverview from '../../components/Dashboard/DashboardOverview';
import DonationHistory from '../../components/Dashboard/DonationHistory';
import ActiveRequests from '../../components/Dashboard/ActiveRequests';
import Messages from '../../components/Dashboard/Messages';
import AdminPanel from '../../components/Dashboard/AdminPanel';
import MyProfile from '../../components/Dashboard/MyProfile';
import HelpCenter from '../../components/Dashboard/HelpCenter';
import LogoutModal from '../../components/Dashboard/LogoutModal';
import usePageTitle from '../../hooks/usePageTitle';
import './DashboardPage.scss';

const TAB_TITLES = {
  'dashboard':        'Dashboard',
  'donation-history': 'Donation History',
  'active-requests':  'Active Requests',
  'messages':         'Messages',
  'admin-panel':      'Admin Panel',
  'settings':         'My Profile',
  'help-center':      'Help Center',
};

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogout, setShowLogout] = useState(false);
  usePageTitle(TAB_TITLES[activeTab] ?? 'Dashboard');

  /* Intercept the logout tab so we show the modal instead of switching tabs */
  const handleTabChange = (tab) => {
    if (tab === 'logout') {
      setShowLogout(true);
    } else {
      setActiveTab(tab);
    }
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onTabChange={handleTabChange} />;
      case 'donation-history':
        return <DonationHistory />;
      case 'active-requests':
        return <ActiveRequests />;
      case 'messages':
        return <Messages />;
      case 'admin-panel':
        return <AdminPanel />;
      case 'settings':
        return <MyProfile onLogout={() => setShowLogout(true)} />;
      case 'help-center':
        return <HelpCenter />;

      default:
        return (
          <div className="dashboard-placeholder" role="status">
            <p className="dashboard-placeholder__title">
              {activeTab.split('-').join(' ')}
            </p>
            <p className="dashboard-placeholder__text">
              This section is coming soon. Select Dashboard to return to the overview.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div className="dashboard-layout">
        <DashboardSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <main
          className={`dashboard-main${activeTab === 'messages' ? ' dashboard-main--chat' : ''}`}
          aria-live="polite"
        >
          {renderContent()}
        </main>
      </div>

      {/* Logout confirmation overlay — rendered on top of the entire dashboard */}
      {showLogout && (
        <LogoutModal onStay={() => setShowLogout(false)} />
      )}
    </div>
  );
};


export default DashboardPage;
