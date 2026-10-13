import { lazy, Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar';
import LogoutModal from '../../components/Dashboard/LogoutModal';
import AppSpinner from '../../components/AppSpinner/AppSpinner';
import { useAuth } from '../../hooks/useAuth';
import usePageTitle from '../../hooks/usePageTitle';
import './DashboardPage.scss';

const DashboardOverview = lazy(() => import('../../components/Dashboard/DashboardOverview'));
const CrmDashboard = lazy(() => import('../../components/Dashboard/Crm/CrmDashboard'));
const DonationHistory = lazy(() => import('../../components/Dashboard/DonationHistory'));
const ActiveRequests = lazy(() => import('../../components/Dashboard/ActiveRequests'));
const AdminPanel = lazy(() => import('../../components/Dashboard/AdminPanel'));
const MyProfile = lazy(() => import('../../components/Dashboard/MyProfile'));
const HelpCenter = lazy(() => import('../../components/Dashboard/HelpCenter'));

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
          <Suspense fallback={<AppSpinner label="Loading dashboard section…" />}>
            {renderContent()}
          </Suspense>
        </div>
      </div>

      {showLogout && (
        <LogoutModal onStay={() => setShowLogout(false)} />
      )}
    </div>
  );
};

export default DashboardPage;
