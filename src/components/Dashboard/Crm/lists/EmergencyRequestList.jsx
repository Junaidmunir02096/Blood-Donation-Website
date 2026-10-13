import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import EmptyState from '../../../EmptyState/EmptyState';

const EmergencyRequestList = ({ items = [], onViewAll }) => (
  <div className="crm-list">
    {items.length === 0 ? (
      <EmptyState
        title="No emergency requests"
        message="Critical and urgent cases matching these filters will appear here."
      />
    ) : (
      <ul className="crm-emergency">
        {items.map((req) => (
          <li key={req.id}>
            <article className="crm-emergency__item">
              <div className="crm-emergency__badge">
                <span>{req.bloodGroup}</span>
                <small>Type</small>
              </div>
              <div className="crm-emergency__body">
                <div className="crm-emergency__meta">
                  <span className={`crm-pill crm-pill--${String(req.urgency).toLowerCase()}`}>
                    {req.urgency}
                  </span>
                  <span className="crm-emergency__time">
                    <FontAwesomeIcon icon={faClock} />
                    {req.time}
                  </span>
                </div>
                <p className="crm-emergency__hospital">{req.hospital}</p>
                <p className="crm-emergency__detail">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {req.city} · {req.units === 1 ? '1 unit' : `${req.units} units`} · {req.patient}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    )}
    {onViewAll && items.length > 0 && (
      <button type="button" className="crm-panel__link crm-panel__link--block" onClick={onViewAll}>
        Open Admin Panel
      </button>
    )}
  </div>
);

export default EmergencyRequestList;
