import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDroplet,
  faHeart,
  faLocationDot,
  faMagnifyingGlass,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import './DashboardOverview.scss';
import AppSpinner from '../AppSpinner/AppSpinner';
import { fetchDashboardData } from '../../api/services';
import { useAuth } from '../../hooks/useAuth';
import EmptyState from '../EmptyState/EmptyState';


const DashboardOverview = ({ onTabChange }) => {
  const { currentUser } = useAuth();
  const firstName = currentUser?.fullName?.split(' ')[0] ?? 'there';
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const [activeRequests, setActiveRequests] = useState([]);
  const [nearbyDonors, setNearbyDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchDashboardData();
      setActiveRequests(data.activeRequests);
      setNearbyDonors(data.nearbyDonors);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <section className="dashboard-overview" aria-label="Dashboard overview">
        <AppSpinner label="Loading dashboard..." />
      </section>
    );
  }

  return (
    <section className="dashboard-overview" aria-label="Dashboard overview">

      {/* ── Header ── */}
      <header className="dashboard-overview__header">
        <div className="dashboard-overview__heading-group">
          <h1 className="dashboard-overview__title">Hello, {firstName} 👋</h1>
          <p className="dashboard-overview__subtitle">
            Your local blood network is active today. Every drop counts.
          </p>
        </div>
        <form
          className="dashboard-overview__search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = searchValue.trim();
            navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
          }}
        >
          <label htmlFor="dashboard-search" className="visually-hidden">Search donors</label>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="dashboard-overview__search-icon"
            aria-hidden="true"
          />
          <input
            id="dashboard-search"
            type="search"
            placeholder="Search blood type, location..."
            aria-label="Search donors"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </header>

      {/* ── Action Cards ── */}
      <div className="dashboard-overview__actions">

        {/* Request Blood */}
        <article className="dashboard-overview__card dashboard-overview__card--primary" id="card-request-blood">
          <div className="dashboard-overview__card-header">
            <span className="dashboard-overview__card-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faDroplet} />
            </span>
            <span className="dashboard-overview__card-badge">Urgent Need</span>
          </div>
          <h2 className="dashboard-overview__card-title">Request Blood</h2>
          <p className="dashboard-overview__card-desc">
            Initiate an emergency or scheduled blood request for a patient in need.
          </p>
          <button 
            className="dashboard-overview__card-cta dashboard-overview__card-cta--primary" 
            type="button"
            onClick={() => navigate('/request')}
          >
            Start Request
          </button>
        </article>

        {/* Become a Donor */}
        <article className="dashboard-overview__card dashboard-overview__card--secondary" id="card-become-donor">
          <div className="dashboard-overview__card-header">
            <span className="dashboard-overview__card-icon dashboard-overview__card-icon--heart" aria-hidden="true">
              <FontAwesomeIcon icon={faHeart} />
            </span>
          </div>
          <h2 className="dashboard-overview__card-title">Become a Donor</h2>
          <p className="dashboard-overview__card-desc">
            Register as a donor so hospitals can reach you when a matching patient needs blood.
          </p>
          <button 
            className="dashboard-overview__card-cta dashboard-overview__card-cta--outline" 
            type="button"
            onClick={() => navigate('/donate')}
          >
            Complete donor profile
          </button>
        </article>

      </div>

      {/* ── Bottom Grid ── */}
      <div className="dashboard-overview__bottom">

        {/* Active Requests */}
        <section className="dashboard-overview__requests" aria-label="Active blood requests">
          <div className="dashboard-overview__section-header">
            <h2>Active Blood Requests</h2>
            <button 
              type="button" 
              className="dashboard-overview__link" 
              id="btn-view-all-requests"
              onClick={() => onTabChange?.('active-requests')}
            >
              View All
            </button>
          </div>
          <div className="dashboard-overview__request-list">
            {activeRequests.length === 0 ? (
              <EmptyState
                title="No active requests"
                message="When hospitals or patients submit urgent needs, they will appear here."
                actionLabel="Submit a request"
                actionTo="/request"
              />
            ) : activeRequests.map((req) => (
              <article key={req.id} className="dashboard-request" aria-label={`Request from ${req.hospital}`}>
                <div className="dashboard-request__badge">
                  <span className="dashboard-request__group">{req.blood}</span>
                  <span className="dashboard-request__label">Type</span>
                </div>
                <div className="dashboard-request__info">
                  <div className="dashboard-request__meta">
                    <span className={`dashboard-request__urgency dashboard-request__urgency--${req.urgency.toLowerCase()}`}>
                      {req.urgency}
                    </span>
                    <span className="dashboard-request__time">
                      <FontAwesomeIcon icon={faClock} aria-hidden="true" />
                      {req.time}
                    </span>
                  </div>
                  <p className="dashboard-request__hospital">{req.hospital}</p>
                  <p className="dashboard-request__details">
                    <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
                    {req.distance} &bull; {req.note}
                  </p>
                </div>
                <button 
                  className="dashboard-request__cta" 
                  type="button" 
                  aria-label={`View ${req.hospital} request`}
                  onClick={() => onTabChange?.('active-requests')}
                >
                  View
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Nearby Donors */}
        <section className="dashboard-overview__donors" aria-label="Nearby donors">
          <div className="dashboard-overview__section-header">
            <h2>Nearby Donors</h2>
          </div>
          <div className="dashboard-overview__donor-list">
            {nearbyDonors.map((donor) => (
              <button
                key={donor.id}
                type="button"
                className="dashboard-donor"
                onClick={() => navigate(`/donor/${donor.id}`)}
              >
                <div className="dashboard-donor__avatar" aria-hidden="true">
                  {donor.initials}
                </div>
                <div className="dashboard-donor__info">
                  <p className="dashboard-donor__name">{donor.name}</p>
                  <p className="dashboard-donor__distance">{donor.distance}</p>
                </div>
                <span className="dashboard-donor__group">{donor.blood}</span>
              </button>
            ))}
          </div>
          <button
            className="dashboard-overview__map-btn"
            type="button"
            id="btn-view-map"
            onClick={() => navigate('/search')}
          >
            Find donors nearby
          </button>
        </section>

      </div>
    </section>
  );
};

export default DashboardOverview;
