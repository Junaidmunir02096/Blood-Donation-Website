import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDroplet,
  faHeart,
  faLocationDot,
  faMagnifyingGlass,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import './DashboardOverview.scss';
import { activeRequests, nearbyDonors } from '../../data/dashboard.data';


const DashboardOverview = () => {
  return (
    <section className="dashboard-overview" aria-label="Dashboard overview">

      {/* ── Header ── */}
      <header className="dashboard-overview__header">
        <div className="dashboard-overview__heading-group">
          <h1 className="dashboard-overview__title">Hello, Alexander</h1>
          <p className="dashboard-overview__subtitle">
            Your local blood network is active today. Every drop counts.
          </p>
        </div>
        <label className="dashboard-overview__search" htmlFor="dashboard-search">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="dashboard-overview__search-icon"
            aria-hidden="true"
          />
          <input
            id="dashboard-search"
            type="search"
            placeholder="Search blood type, location, or request ID..."
            aria-label="Search dashboard"
          />
        </label>
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
          <button className="dashboard-overview__card-cta dashboard-overview__card-cta--primary" type="button">
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
            Schedule your next donation at a nearby center and save up to 3 lives.
          </p>
          <button className="dashboard-overview__card-cta dashboard-overview__card-cta--outline" type="button">
            Schedule Appointment
          </button>
        </article>

      </div>

      {/* ── Bottom Grid ── */}
      <div className="dashboard-overview__bottom">

        {/* Active Requests */}
        <section className="dashboard-overview__requests" aria-label="Active blood requests">
          <div className="dashboard-overview__section-header">
            <h3>Active Blood Requests</h3>
            <button type="button" className="dashboard-overview__link" id="btn-view-all-requests">
              View All
            </button>
          </div>
          <div className="dashboard-overview__request-list">
            {activeRequests.map((req) => (
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
                <button className="dashboard-request__cta" type="button" aria-label={`Respond to ${req.hospital}`}>
                  Respond
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Nearby Donors */}
        <section className="dashboard-overview__donors" aria-label="Nearby donors">
          <div className="dashboard-overview__section-header">
            <h3>Nearby Donors</h3>
          </div>
          <div className="dashboard-overview__donor-list">
            {nearbyDonors.map((donor) => (
              <div key={donor.id} className="dashboard-donor">
                <div className="dashboard-donor__avatar" aria-hidden="true">
                  {donor.initials}
                </div>
                <div className="dashboard-donor__info">
                  <p className="dashboard-donor__name">{donor.name}</p>
                  <p className="dashboard-donor__distance">{donor.distance}</p>
                </div>
                <span className="dashboard-donor__group">{donor.blood}</span>
              </div>
            ))}
          </div>
          <button className="dashboard-overview__map-btn" type="button" id="btn-view-map">
            View Map
          </button>
        </section>

      </div>
    </section>
  );
};

export default DashboardOverview;
