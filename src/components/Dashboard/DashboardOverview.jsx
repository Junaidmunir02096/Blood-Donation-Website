import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faDroplet,
  faMapLocationDot,
  faMagnifyingGlass,
  faReply,
} from '@fortawesome/free-solid-svg-icons';
import './DashboardOverview.scss';

const actionCards = [
  {
    id: 'request-blood',
    title: 'Request Blood',
    badge: 'Urgent Need',
    description: 'Initiate an emergency or scheduled blood request for a patient in need.',
    cta: 'Start Request',
    tone: 'primary',
    icon: faDroplet,
  },
  {
    id: 'become-donor',
    title: 'Become a Donor',
    badge: 'Save Lives',
    description: 'Schedule your next donation at a nearby center and save up to 3 lives.',
    cta: 'Schedule Appointment',
    tone: 'secondary',
    icon: faCalendarCheck,
  },
];

const activeRequests = [
  {
    id: 'req-1',
    blood: 'O+',
    urgency: 'Critical',
    hospital: 'City General Hospital',
    distance: '12 km away',
    time: '2 hrs ago',
    note: 'Surgery Patient',
  },
  {
    id: 'req-2',
    blood: 'A-',
    urgency: 'Routine',
    hospital: "Metro Children's Clinic",
    distance: '4 km away',
    time: '5 hrs ago',
    note: 'Routine Supply',
  },
];

const nearbyDonors = [
  { id: 'donor-1', name: 'Sarah Jenkins', distance: '2.1 km away', blood: 'O-' },
  { id: 'donor-2', name: 'Marcus Thorne', distance: '3.5 km away', blood: 'B+' },
  { id: 'donor-3', name: 'Elena Rodriguez', distance: '5.0 km away', blood: 'A+' },
];

const DashboardOverview = () => {
  return (
    <section className="dashboard-overview" aria-label="Dashboard overview">
      <header className="dashboard-overview__header">
        <div>
          <p className="dashboard-overview__eyebrow">Hello, Alexander</p>
          <h1 className="dashboard-overview__title">Your local blood network is active today.</h1>
          <p className="dashboard-overview__subtitle">Every drop counts. Let us know where you can help.</p>
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

      <div className="dashboard-overview__actions">
        {actionCards.map((card) => (
          <article
            key={card.id}
            className={`dashboard-overview__card dashboard-overview__card--${card.tone}`}
          >
            <div className="dashboard-overview__card-header">
              <span className="dashboard-overview__card-icon" aria-hidden="true">
                <FontAwesomeIcon icon={card.icon} className="dashboard-overview__card-icon-svg" />
              </span>
              <span className="dashboard-overview__card-badge">{card.badge}</span>
            </div>
            <h2 className="dashboard-overview__card-title">{card.title}</h2>
            <p className="dashboard-overview__card-desc">{card.description}</p>
            <button className="dashboard-overview__card-cta" type="button">
              {card.cta}
            </button>
          </article>
        ))}
      </div>

      <div className="dashboard-overview__bottom">
        <section className="dashboard-overview__requests">
          <div className="dashboard-overview__section-header">
            <h3>Active Blood Requests</h3>
            <button type="button" className="dashboard-overview__link">View All</button>
          </div>
          <div className="dashboard-overview__request-list">
            {activeRequests.map((request) => (
              <article key={request.id} className="dashboard-request">
                <div className="dashboard-request__badge">
                  <span className="dashboard-request__group">{request.blood}</span>
                  <span className="dashboard-request__label">Type</span>
                </div>
                <div className="dashboard-request__info">
                  <div className="dashboard-request__meta">
                    <span className={`dashboard-request__urgency dashboard-request__urgency--${request.urgency.toLowerCase()}`}>
                      {request.urgency}
                    </span>
                    <span>{request.time}</span>
                  </div>
                  <p className="dashboard-request__hospital">{request.hospital}</p>
                  <p className="dashboard-request__details">
                    {request.distance} • {request.note}
                  </p>
                </div>
                <button className="dashboard-request__cta" type="button">
                  <FontAwesomeIcon icon={faReply} className="dashboard-request__cta-icon" />
                  Respond
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-overview__donors">
          <div className="dashboard-overview__section-header">
            <h3>Nearby Donors</h3>
          </div>
          <div className="dashboard-overview__donor-list">
            {nearbyDonors.map((donor) => (
              <div key={donor.id} className="dashboard-donor">
                <div className="dashboard-donor__avatar" aria-hidden="true">
                  {donor.name.split(' ').map((part) => part[0]).join('')}
                </div>
                <div className="dashboard-donor__info">
                  <p className="dashboard-donor__name">{donor.name}</p>
                  <p className="dashboard-donor__distance">{donor.distance}</p>
                </div>
                <span className="dashboard-donor__group">{donor.blood}</span>
              </div>
            ))}
          </div>
          <button className="dashboard-overview__map-btn" type="button">
            <FontAwesomeIcon icon={faMapLocationDot} className="dashboard-overview__map-icon" />
            View Map
          </button>
        </section>
      </div>
    </section>
  );
};

export default DashboardOverview;
