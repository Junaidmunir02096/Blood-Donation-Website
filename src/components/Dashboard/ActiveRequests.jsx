import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCalendarAlt,
  faDroplet,
  faClock,
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import './ActiveRequests.scss';
import AppSpinner from '../AppSpinner/AppSpinner';
import { filters, statusConfig } from '../../data/requests.data';
import { fetchRequests } from '../../api/services';
import { Link } from 'react-router-dom';
import EmptyState from '../EmptyState/EmptyState';
import { requestBloodGroup, normalizeRequestStatus } from '../../utils/status';
import { useAuth } from '../../hooks/useAuth';

// ── iconKey → FontAwesome icon resolver ───────────────────────────────────────
// Keeps data files free of icon-library imports. Add new keys here as needed.
const STATUS_ICONS = {
  clock:       faClock,
  circleCheck: faCircleCheck,
  circleXmark: faCircleXmark,
};



// ── Blood type color modifier ─────────────────────────────────────────────────
const bloodModifier = (type) => {
  if (type.startsWith('O'))  return 'salmon';
  if (type.startsWith('A-')) return 'teal';
  if (type.startsWith('AB')) return 'blush';
  if (type.startsWith('B'))  return 'blue';
  return 'default';
};

// ── Component ─────────────────────────────────────────────────────────────────
const ActiveRequests = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [requests, setRequests]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const { currentUser } = useAuth();

  const handleActionClick = (req) => {
    setSelectedId((id) => (id === req.id ? null : req.id));
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      /* Fetch only this user's requests (plus seed requests for demo) */
      const data = await fetchRequests(currentUser?.id);
      setRequests(data);
      setLoading(false);
    };
    load();
  }, [currentUser?.id]);

  const filtered =
    activeFilter === 'All'
      ? requests
      : requests.filter((r) => r.status === activeFilter);

  if (loading) {
    return (
      <section className="active-requests" aria-label="Request Status">
        <AppSpinner label="Loading requests..." />
      </section>
    );
  }

  return (
    <section className="active-requests" aria-label="Request Status">

      {/* ── Header ── */}
      <div className="ar-header">
        <div className="ar-header__text">
          <h2 className="ar-header__title">Request Status</h2>
          <p className="ar-header__subtitle">
            Track the progress of your submitted blood requests.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="ar-filters" role="tablist" aria-label="Filter requests">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              type="button"
              id={`filter-${f.toLowerCase()}`}
              className={`ar-filters__btn${activeFilter === f ? ' ar-filters__btn--active' : ''}`}
              aria-selected={activeFilter === f}
              onClick={() => setActiveFilter(f)}
            >
              {f}
              {/* count pill */}
              <span className="ar-filters__count">
                {f === 'All'
                  ? requests.length
                  : requests.filter((r) => r.status === f).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Request List ── */}
      <div className="ar-list" role="tabpanel">
        {filtered.length === 0 ? (
          <EmptyState
            title={activeFilter === 'All' ? 'No requests yet' : `No ${activeFilter.toLowerCase()} requests`}
            message={activeFilter === 'All' ? 'Submit a blood request to track it here.' : 'Try another filter.'}
            actionLabel="Submit a request"
            actionTo="/request"
          />
        ) : (
          filtered.map((req, idx) => {
            const blood = requestBloodGroup(req);
            const cfg = statusConfig[normalizeRequestStatus(req.status)] || statusConfig.Pending;
            return (
              <article
                key={req.id}
                className="ar-card"
                style={{ animationDelay: `${idx * 0.06}s` }}
                aria-label={`Request for ${req.hospital}`}
              >
                <div className={`ar-card__blood ar-card__blood--${bloodModifier(blood)}`}>
                  {blood}
                </div>

                {/* Info */}
                <div className="ar-card__info">
                  <p className="ar-card__hospital">{req.hospital}</p>
                  <div className="ar-card__meta">
                    <span>
                      <FontAwesomeIcon icon={faUser} aria-hidden="true" />
                      Patient: {req.patient}
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faCalendarAlt} aria-hidden="true" />
                      Needed by: {req.neededBy}
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faDroplet} aria-hidden="true" />
                      {req.units} Unit{req.units !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Status + action */}
                <div className="ar-card__status-wrap">
                  <span className={`ar-badge ar-badge--${cfg.modifier}`}>
                    <FontAwesomeIcon icon={STATUS_ICONS[cfg.iconKey]} aria-hidden="true" />
                    {cfg.label}
                  </span>
                  <button
                    type="button"
                    className={`ar-card__action ar-card__action--${cfg.modifier}`}
                    id={`action-${req.id}`}
                    aria-label={`${cfg.action} for ${req.hospital}`}
                    onClick={() => handleActionClick(req)}
                  >
                    {selectedId === req.id ? 'Hide details' : 'View details'}
                  </button>
                </div>
                {selectedId === req.id && (
                  <div className="ar-card__details">
                    <p>ID: {req.id}</p>
                    <p>Urgency: {req.urgency}</p>
                    <p>Component: {req.component || 'Whole Blood'}</p>
                    <p>City: {req.location || '—'}</p>
                    <p>Contact: {req.contactNumber || '—'}</p>
                    {req.note && <p>Note: {req.note}</p>}
                    <p>
                      Need compatible donors? <Link to={`/search?q=${encodeURIComponent(blood)}`}>Search {blood}</Link>
                    </p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Summary */}
      <p className="ar-summary">
        Showing <strong>{filtered.length}</strong> of <strong>{requests.length}</strong> requests
      </p>
    </section>
  );
};

export default ActiveRequests;
