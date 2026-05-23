import React, { useState } from 'react';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar';
import DashboardOverview from '../../components/Dashboard/DashboardOverview';
import DonationHistory from '../../components/Dashboard/DonationHistory';
import ActiveRequests from '../../components/Dashboard/ActiveRequests';
import Messages from '../../components/Dashboard/Messages';
import AdminPanel from '../../components/Dashboard/AdminPanel';
import MyProfile from '../../components/Dashboard/MyProfile';
import './DashboardPage.scss';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'donation-history':
        return <DonationHistory />;
      case 'active-requests':
        return <ActiveRequests />;
      case 'messages':
        return <Messages />;
      case 'admin-panel':
        return <AdminPanel />;
      case 'settings':
        return <MyProfile />;
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
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main
          className={`dashboard-main${activeTab === 'messages' ? ' dashboard-main--chat' : ''}`}
          aria-live="polite"
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
