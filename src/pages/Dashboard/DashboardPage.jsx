import React, { useState } from 'react';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar';
import DashboardOverview from '../../components/Dashboard/DashboardOverview';
import './DashboardPage.scss';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div className="dashboard-layout">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="dashboard-main" aria-live="polite">
          {activeTab === 'dashboard' ? (
            <DashboardOverview />
          ) : (
            <div className="dashboard-placeholder" role="status">
              <p className="dashboard-placeholder__title">{activeTab.split('-').join(' ')}</p>
              <p className="dashboard-placeholder__text">
                This section is ready for content. Select Dashboard to return to the overview.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
