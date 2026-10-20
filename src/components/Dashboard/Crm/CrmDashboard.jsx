import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faDownload,
  faHeartPulse,
} from '@fortawesome/free-solid-svg-icons';
import AppSpinner from '../../AppSpinner/AppSpinner';
import { downloadCrmCsv, fetchCrmOverview } from '../../../services/crm.service';
import CrmFilters from './CrmFilters';
import CrmKpiGrid from './CrmKpiGrid';
import DonationTrendChart from './charts/DonationTrendChart';
import BloodGroupBarChart from './charts/BloodGroupBarChart';
import DonorMixDonut from './charts/DonorMixDonut';
import CityHotspotsChart from './charts/CityHotspotsChart';
import EmergencyRequestList from './lists/EmergencyRequestList';
import RecentDonationsList from './lists/RecentDonationsList';
import './CrmDashboard.scss';

const DEFAULT_FILTERS = {
  period: 'month',
  city: 'all',
  bloodGroup: 'all',
};

const Panel = ({ title, subtitle, action, children }) => (
  <section className="crm-panel">
    <header className="crm-panel__header">
      <div>
        <h2 className="crm-panel__title">{title}</h2>
        {subtitle && <p className="crm-panel__subtitle">{subtitle}</p>}
      </div>
      {action}
    </header>
    {children}
  </section>
);

const CrmDashboard = ({ onTabChange }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (nextFilters) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCrmOverview(nextFilters);
      setOverview(data);
    } catch {
      setError('Could not load network overview. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  const handleExport = () => {
    if (overview) downloadCrmCsv(overview);
  };

  return (
    <section className="crm" aria-label="Network overview">
      <header className="crm__header">
        <div className="crm__heading">
          <div className="crm__title-row">
            <span className="crm__mark" aria-hidden="true">
              <FontAwesomeIcon icon={faHeartPulse} />
            </span>
            <h1 className="crm__title">Network Overview</h1>
          </div>
          <p className="crm__subtitle">
            Pakistan command center · live demo dataset structured for a future API
          </p>
        </div>

        <div className="crm__toolbar">
          <CrmFilters filters={filters} onChange={setFilters} disabled={loading} />
          <button
            type="button"
            className="crm__export"
            onClick={handleExport}
            disabled={!overview || loading}
            id="crm-export-btn"
          >
            <FontAwesomeIcon icon={faDownload} />
            Export
          </button>
        </div>
      </header>

      {error && (
        <p className="crm__error" role="alert">{error}</p>
      )}

      {loading && !overview ? (
        <AppSpinner label="Loading network overview..." />
      ) : overview ? (
        <div className={`crm__body${loading ? ' crm__body--refreshing' : ''}`}>
          <CrmKpiGrid kpis={overview.kpis} />

          <div className="crm__grid crm__grid--charts">
            <Panel
              title="Donation vs demand"
              subtitle="Completed collections against new requests"
            >
              <DonationTrendChart data={overview.donationTrend} />
            </Panel>
            <Panel
              title="Group availability"
              subtitle="Green stable · amber low · red critical"
            >
              <BloodGroupBarChart data={overview.bloodGroupAvailability} />
            </Panel>
          </div>

          <div className="crm__grid crm__grid--mix">
            <Panel
              title="Donor mix"
              subtitle="Share of registered donors by blood group"
            >
              <DonorMixDonut data={overview.donorMix} />
            </Panel>
            <Panel
              title="City hotspots"
              subtitle="Registered donors across Pakistan"
            >
              <CityHotspotsChart data={overview.cityHotspots} />
            </Panel>
          </div>

          <div className="crm__grid crm__grid--ops">
            <Panel
              title="Emergency requests"
              subtitle="Critical and urgent cases needing dispatch"
              action={
                <button
                  type="button"
                  className="crm-panel__link"
                  onClick={() => onTabChange?.('admin-panel')}
                >
                  Manage
                </button>
              }
            >
              <EmergencyRequestList items={overview.emergencyRequests} />
            </Panel>
            <Panel
              title="Recent donations"
              subtitle="Latest completed collections"
              action={
                <button
                  type="button"
                  className="crm-panel__link"
                  onClick={() => onTabChange?.('donation-history')}
                >
                  View all
                </button>
              }
            >
              <RecentDonationsList items={overview.recentDonations} />
            </Panel>
          </div>

          <p className="crm__footnote">
            <FontAwesomeIcon icon={faCircleInfo} />
            Demo snapshot ({overview.source}). Replace <code>fetchCrmOverview</code> with
            <code> GET /api/crm/overview</code> when MongoDB is connected — the dashboard DTO stays the same.
          </p>
        </div>
      ) : null}
    </section>
  );
};

export default CrmDashboard;
