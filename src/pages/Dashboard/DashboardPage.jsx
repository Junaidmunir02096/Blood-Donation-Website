import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar';
import DashboardOverview from '../../components/Dashboard/DashboardOverview';
import CrmDashboard from '../../components/Dashboard/Crm';
import DonationHistory from '../../components/Dashboard/DonationHistory';
import ActiveRequests from '../../components/Dashboard/ActiveRequests';
import AdminPanel from '../../components/Dashboard/AdminPanel';
import MyProfile from '../../components/Dashboard/MyProfile';
import HelpCenter from '../../components/Dashboard/HelpCenter';
import LogoutModal from '../../components/Dashboard/LogoutModal';
import { useAuth } from '../../hooks/useAuth';
import usePageTitle from '../../hooks/usePageTitle';
import './DashboardPage.scss';

const TAB_TITLES = {
  'dashboard':        'Dashboard',
  'donation-history': 'Donation History',
  'active-requests':  'Active Requests',
  'admin-panel':      'Admin Panel',
  'settings':         'My Profile',
  'help-center':      'Help Center',
};

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [params, setParams] = useSearchParams();
  const initialTab = TAB_TITLES[params.get('tab')] ? params.get('tab') : 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showLogout, setShowLogout] = useState(false);
  usePageTitle(TAB_TITLES[activeTab] ?? 'Dashboard');

  const handleTabChange = (tab) => {
    if (tab === 'logout') {
      setShowLogout(true);
    } else {
      setActiveTab(tab);
      setParams(tab === 'dashboard' ? {} : { tab }, { replace: true });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return isAdmin
          ? <CrmDashboard onTabChange={handleTabChange} />
          : <DashboardOverview onTabChange={handleTabChange} />;
      case 'donation-history':
        return <DonationHistory />;
      case 'active-requests':
        return <ActiveRequests />;
      case 'admin-panel':
        return <AdminPanel />;
      case 'settings':
        return <MyProfile onLogout={() => setShowLogout(true)} />;
      case 'help-center':
        return <HelpCenter />;
      default:
        return isAdmin
          ? <CrmDashboard onTabChange={handleTabChange} />
          : <DashboardOverview onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div className="dashboard-layout">
        <DashboardSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="dashboard-main" aria-live="polite">
          {renderContent()}
        </div>
      </div>

      {showLogout && (
        <LogoutModal onStay={() => setShowLogout(false)} />
      )}
    </div>
  );
};

export default DashboardPage;
