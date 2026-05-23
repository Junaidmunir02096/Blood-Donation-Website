import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCalendarAlt,
  faDroplet,
} from '@fortawesome/free-solid-svg-icons';
import './ActiveRequests.scss';
import { requests, filters, statusConfig } from '../../data/requests.data';



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

  const filtered =
    activeFilter === 'All'
      ? requests
      : requests.filter((r) => r.status === activeFilter);

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
          <div className="ar-empty">
            <p>No <strong>{activeFilter.toLowerCase()}</strong> requests found.</p>
          </div>
        ) : (
          filtered.map((req, idx) => {
            const cfg = statusConfig[req.status];
            return (
              <article
                key={req.id}
                className="ar-card"
                style={{ animationDelay: `${idx * 0.06}s` }}
                aria-label={`Request for ${req.hospital}`}
              >
                {/* Blood type badge */}
                <div className={`ar-card__blood ar-card__blood--${bloodModifier(req.blood)}`}>
                  {req.blood}
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
                    <FontAwesomeIcon icon={cfg.icon} aria-hidden="true" />
                    {cfg.label}
                  </span>
                  <button
                    type="button"
                    className={`ar-card__action ar-card__action--${cfg.modifier}`}
                    id={`action-${req.id}`}
                    aria-label={`${cfg.action} for ${req.hospital}`}
                  >
                    {cfg.action}
                  </button>
                </div>
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
