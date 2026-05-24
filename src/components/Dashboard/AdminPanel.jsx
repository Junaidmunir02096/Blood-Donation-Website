import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faDroplet,
  faUserGroup,
  faFlask,
  faMagnifyingGlass,
  faFilter,
  faCheck,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faTriangleExclamation,
  faArrowTrendUp,
  faEllipsisVertical,
  faCircleCheck,
  faCircleXmark,
  faHourglassHalf,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import './AdminPanel.scss';

/* ─── Mock Data ─────────────────────────────────────────── */
const REQUESTS_DATA = [
  {
    id: 'REQ-7829',
    hospital: 'St. Jude Medical Center',
    patient: 'Sarah Jenkins',
    bloodGroup: 'O-',
    units: 4,
    urgency: 'Critical',
    date: 'Oct 24, 09:30 AM',
    status: 'pending',
  },
  {
    id: 'REQ-7828',
    hospital: 'Mercy General Hospital',
    patient: 'Michael Chang',
    bloodGroup: 'A+',
    units: 2,
    urgency: 'Standard',
    date: 'Oct 24, 08:15 AM',
    status: 'pending',
  },
  {
    id: 'REQ-7827',
    hospital: 'City Health Clinic',
    patient: 'Elena Rodriguez',
    bloodGroup: 'B-',
    units: 1,
    urgency: 'High',
    date: 'Oct 23, 11:45 PM',
    status: 'pending',
  },
  {
    id: 'REQ-7826',
    hospital: 'Sunrise Medical Hub',
    patient: 'Daniel Osei',
    bloodGroup: 'AB+',
    units: 3,
    urgency: 'Standard',
    date: 'Oct 23, 04:00 PM',
    status: 'approved',
  },
  {
    id: 'REQ-7825',
    hospital: 'Northern Health Center',
    patient: 'Fatima Al-Rashid',
    bloodGroup: 'O+',
    units: 2,
    urgency: 'High',
    date: 'Oct 23, 01:30 PM',
    status: 'rejected',
  },
];

const DONORS_DATA = [
  {
    id: 'DNR-1021',
    name: 'Ahmed Al-Farouq',
    bloodGroup: 'O+',
    city: 'Karachi',
    phone: '+92-300-1234567',
    lastDonation: 'Oct 10, 2025',
    status: 'active',
  },
  {
    id: 'DNR-1020',
    name: 'Hina Zafar',
    bloodGroup: 'A-',
    city: 'Lahore',
    phone: '+92-321-9876543',
    lastDonation: 'Sep 18, 2025',
    status: 'pending',
  },
  {
    id: 'DNR-1019',
    name: 'Marcus Williams',
    bloodGroup: 'B+',
    city: 'Islamabad',
    phone: '+92-333-5554433',
    lastDonation: 'Aug 30, 2025',
    status: 'active',
  },
  {
    id: 'DNR-1018',
    name: 'Priya Sharma',
    bloodGroup: 'AB-',
    city: 'Rawalpindi',
    phone: '+92-311-7778899',
    lastDonation: 'Oct 01, 2025',
    status: 'pending',
  },
  {
    id: 'DNR-1017',
    name: 'Lucas Müller',
    bloodGroup: 'O-',
    city: 'Faisalabad',
    phone: '+92-346-2221110',
    lastDonation: 'Jul 15, 2025',
    status: 'inactive',
  },
];

const USERS_DATA = [
  {
    id: 'USR-3041',
    name: 'Sophia Carter',
    email: 'sophia.c@email.com',
    role: 'Recipient',
    joined: 'Oct 20, 2025',
    status: 'active',
  },
  {
    id: 'USR-3040',
    name: 'James Okonkwo',
    email: 'james.ok@email.com',
    role: 'Donor',
    joined: 'Oct 18, 2025',
    status: 'pending',
  },
  {
    id: 'USR-3039',
    name: 'Aisha Patel',
    email: 'aisha.p@email.com',
    role: 'Recipient',
    joined: 'Oct 15, 2025',
    status: 'active',
  },
  {
    id: 'USR-3038',
    name: 'Benjamin Osei',
    email: 'benny.o@email.com',
    role: 'Donor',
    joined: 'Oct 12, 2025',
    status: 'pending',
  },
  {
    id: 'USR-3037',
    name: 'Lena Schreiber',
    email: 'lena.s@email.com',
    role: 'Admin',
    joined: 'Sep 28, 2025',
    status: 'active',
  },
];

/* ─── Urgency Badge ─────────────────────────────────────── */
const UrgencyBadge = ({ urgency }) => {
  const map = {
    Critical: 'critical',
    High: 'high',
    Standard: 'standard',
  };
  const cls = map[urgency] || 'standard';
  return (
    <span className={`admin-badge admin-badge--${cls}`}>
      {urgency === 'Critical' && (
        <FontAwesomeIcon icon={faTriangleExclamation} className="admin-badge__icon" />
      )}
      {urgency}
    </span>
  );
};

/* ─── Status Pill ───────────────────────────────────────── */
const StatusPill = ({ status }) => {
  const map = {
    pending: { cls: 'pending', icon: faHourglassHalf, label: 'Pending' },
    approved: { cls: 'approved', icon: faCircleCheck, label: 'Approved' },
    active: { cls: 'approved', icon: faCircleCheck, label: 'Active' },
    rejected: { cls: 'rejected', icon: faCircleXmark, label: 'Rejected' },
    inactive: { cls: 'rejected', icon: faCircleXmark, label: 'Inactive' },
  };
  const { cls, icon, label } = map[status] || map['pending'];
  return (
    <span className={`admin-status admin-status--${cls}`}>
      <FontAwesomeIcon icon={icon} />
      {label}
    </span>
  );
};

/* ─── Blood Group Badge ─────────────────────────────────── */
const BloodBadge = ({ group }) => (
  <span className="admin-blood-badge" aria-label={`Blood group ${group}`}>
    {group}
  </span>
);

/* ─── Pagination ────────────────────────────────────────── */
const Pagination = ({ current, total, onChange }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="admin-pagination">
      <button
        className="admin-pagination__btn"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        aria-label="Previous page"
        id="admin-pagination-prev"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`admin-pagination__btn admin-pagination__btn--num${current === p ? ' admin-pagination__btn--active' : ''}`}
          onClick={() => onChange(p)}
          aria-current={current === p ? 'page' : undefined}
          id={`admin-pagination-page-${p}`}
        >
          {p}
        </button>
      ))}
      <button
        className="admin-pagination__btn"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        aria-label="Next page"
        id="admin-pagination-next"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

/* ─── Requests Table ────────────────────────────────────── */
const RequestsTable = () => {
  const [data, setData] = useState(REQUESTS_DATA);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 3;

  const filtered = data.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.hospital.toLowerCase().includes(search.toLowerCase()) ||
      r.patient.toLowerCase().includes(search.toLowerCase())
  );
  const total = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAction = (id, action) => {
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  return (
    <div className="admin-table-section">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="admin-search-wrap__icon" />
          <input
            type="text"
            className="admin-search-wrap__input"
            placeholder="Search requests…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            aria-label="Search requests"
            id="admin-requests-search"
          />
        </div>
        <button className="admin-filter-btn" id="admin-requests-filter" type="button">
          <FontAwesomeIcon icon={faFilter} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table" role="table" aria-label="Blood requests table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Hospital / Patient</th>
              <th>Blood Group</th>
              <th>Units</th>
              <th>Urgency</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-table__empty">No requests found.</td>
              </tr>
            ) : (
              paged.map((req) => (
                <tr key={req.id} className={`admin-table__row admin-table__row--${req.status}`}>
                  <td className="admin-table__id">{req.id}</td>
                  <td>
                    <p className="admin-table__primary">{req.hospital}</p>
                    <p className="admin-table__secondary">Patient: {req.patient}</p>
                  </td>
                  <td><BloodBadge group={req.bloodGroup} /></td>
                  <td className="admin-table__units">{req.units} {req.units === 1 ? 'Unit' : 'Units'}</td>
                  <td><UrgencyBadge urgency={req.urgency} /></td>
                  <td className="admin-table__date">{req.date}</td>
                  <td>
                    {req.status === 'pending' ? (
                      <div className="admin-actions">
                        <button
                          className="admin-actions__btn admin-actions__btn--approve"
                          onClick={() => handleAction(req.id, 'approved')}
                          aria-label={`Approve request ${req.id}`}
                          id={`approve-req-${req.id}`}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                          Approve
                        </button>
                        <button
                          className="admin-actions__btn admin-actions__btn--reject"
                          onClick={() => handleAction(req.id, 'rejected')}
                          aria-label={`Reject request ${req.id}`}
                          id={`reject-req-${req.id}`}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <StatusPill status={req.status} />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="admin-table-footer">
        <p className="admin-table-footer__info">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} to{' '}
          {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} entries
        </p>
        <Pagination current={page} total={total} onChange={setPage} />
      </div>
    </div>
  );
};

/* ─── Donors Table ──────────────────────────────────────── */
const DonorsTable = () => {
  const [data, setData] = useState(DONORS_DATA);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 4;

  const filtered = data.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase())
  );
  const total = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAction = (id, action) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: action === 'approve' ? 'active' : 'inactive' } : d
      )
    );
  };

  return (
    <div className="admin-table-section">
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="admin-search-wrap__icon" />
          <input
            type="text"
            className="admin-search-wrap__input"
            placeholder="Search donors…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            aria-label="Search donors"
            id="admin-donors-search"
          />
        </div>
        <button className="admin-filter-btn" id="admin-donors-filter" type="button">
          <FontAwesomeIcon icon={faFilter} />
          Filter
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table" role="table" aria-label="Donors table">
          <thead>
            <tr>
              <th>Donor ID</th>
              <th>Name</th>
              <th>Blood Group</th>
              <th>City</th>
              <th>Last Donation</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-table__empty">No donors found.</td>
              </tr>
            ) : (
              paged.map((donor) => (
                <tr key={donor.id} className="admin-table__row">
                  <td className="admin-table__id">{donor.id}</td>
                  <td>
                    <p className="admin-table__primary">{donor.name}</p>
                    <p className="admin-table__secondary">{donor.phone}</p>
                  </td>
                  <td><BloodBadge group={donor.bloodGroup} /></td>
                  <td className="admin-table__secondary">{donor.city}</td>
                  <td className="admin-table__date">{donor.lastDonation}</td>
                  <td><StatusPill status={donor.status} /></td>
                  <td>
                    {donor.status === 'pending' ? (
                      <div className="admin-actions">
                        <button
                          className="admin-actions__btn admin-actions__btn--approve"
                          onClick={() => handleAction(donor.id, 'approve')}
                          aria-label={`Approve donor ${donor.id}`}
                          id={`approve-donor-${donor.id}`}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                          Approve
                        </button>
                        <button
                          className="admin-actions__btn admin-actions__btn--reject"
                          onClick={() => handleAction(donor.id, 'reject')}
                          aria-label={`Reject donor ${donor.id}`}
                          id={`reject-donor-${donor.id}`}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        className="admin-actions__btn admin-actions__btn--more"
                        aria-label={`More options for donor ${donor.id}`}
                        id={`more-donor-${donor.id}`}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-table-footer">
        <p className="admin-table-footer__info">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} to{' '}
          {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} entries
        </p>
        <Pagination current={page} total={total} onChange={setPage} />
      </div>
    </div>
  );
};

/* ─── Users Table ───────────────────────────────────────── */
const UsersTable = () => {
  const [data, setData] = useState(USERS_DATA);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 4;

  const filtered = data.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
  );
  const total = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAction = (id, action) => {
    setData((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: action === 'approve' ? 'active' : 'inactive' } : u
      )
    );
  };

  return (
    <div className="admin-table-section">
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="admin-search-wrap__icon" />
          <input
            type="text"
            className="admin-search-wrap__input"
            placeholder="Search users…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            aria-label="Search users"
            id="admin-users-search"
          />
        </div>
        <button className="admin-filter-btn" id="admin-users-filter" type="button">
          <FontAwesomeIcon icon={faFilter} />
          Filter
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table" role="table" aria-label="Users table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-table__empty">No users found.</td>
              </tr>
            ) : (
              paged.map((user) => (
                <tr key={user.id} className="admin-table__row">
                  <td className="admin-table__id">{user.id}</td>
                  <td className="admin-table__primary">{user.name}</td>
                  <td className="admin-table__secondary">{user.email}</td>
                  <td>
                    <span className={`admin-role admin-role--${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="admin-table__date">{user.joined}</td>
                  <td><StatusPill status={user.status} /></td>
                  <td>
                    {user.status === 'pending' ? (
                      <div className="admin-actions">
                        <button
                          className="admin-actions__btn admin-actions__btn--approve"
                          onClick={() => handleAction(user.id, 'approve')}
                          aria-label={`Approve user ${user.id}`}
                          id={`approve-user-${user.id}`}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                          Approve
                        </button>
                        <button
                          className="admin-actions__btn admin-actions__btn--reject"
                          onClick={() => handleAction(user.id, 'reject')}
                          aria-label={`Reject user ${user.id}`}
                          id={`reject-user-${user.id}`}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        className="admin-actions__btn admin-actions__btn--more"
                        aria-label={`More options for user ${user.id}`}
                        id={`more-user-${user.id}`}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-table-footer">
        <p className="admin-table-footer__info">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} to{' '}
          {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} entries
        </p>
        <Pagination current={page} total={total} onChange={setPage} />
      </div>
    </div>
  );
};

/* ─── Main AdminPanel ───────────────────────────────────── */
const TABS = ['Donors', 'Requests', 'Users'];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('Requests');
  const [notifCount] = useState(3);

  const stats = [
    {
      label: 'Pending Requests',
      value: '42',
      trend: '+12%',
      icon: faDroplet,
      iconClass: 'red',
      id: 'stat-pending',
    },
    {
      label: 'Active Donors',
      value: '1,204',
      trend: '+5%',
      icon: faUserGroup,
      iconClass: 'teal',
      id: 'stat-donors',
    },
    {
      label: 'Total Blood Units',
      value: '8,450',
      unit: 'ml available',
      icon: faFlask,
      iconClass: 'indigo',
      id: 'stat-units',
    },
  ];

  return (
    <section className="admin-panel" aria-labelledby="admin-panel-title">
      {/* Header */}
      <div className="admin-panel__header">
        <div className="admin-panel__header-text">
          <div className="admin-panel__title-row">
            <span className="admin-panel__shield-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faShieldHalved} />
            </span>
            <h1 className="admin-panel__title" id="admin-panel-title">
              System Administration
            </h1>
          </div>
          <p className="admin-panel__subtitle">
            Manage donors, hospital requests, and user accounts.
          </p>
        </div>
        <button
          className="admin-panel__notif-btn"
          aria-label={`${notifCount} notifications`}
          id="admin-notifications-btn"
          type="button"
        >
          <FontAwesomeIcon icon={faBell} />
          {notifCount > 0 && (
            <span className="admin-panel__notif-badge" aria-hidden="true">
              {notifCount}
            </span>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats" role="region" aria-label="Administration statistics">
        {stats.map((s) => (
          <div className="admin-stats__card" key={s.id} id={s.id}>
            <div className="admin-stats__card-body">
              <p className="admin-stats__label">{s.label}</p>
              <div className="admin-stats__value-row">
                <span className="admin-stats__value">{s.value}</span>
                {s.unit && <span className="admin-stats__unit">{s.unit}</span>}
                {s.trend && (
                  <span className="admin-stats__trend" aria-label={`Trend: ${s.trend}`}>
                    <FontAwesomeIcon icon={faArrowTrendUp} />
                    {s.trend}
                  </span>
                )}
              </div>
            </div>
            <div className={`admin-stats__icon-wrap admin-stats__icon-wrap--${s.iconClass}`} aria-hidden="true">
              <FontAwesomeIcon icon={s.icon} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs" role="tablist" aria-label="Data management tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            type="button"
            className={`admin-tabs__tab${activeTab === tab ? ' admin-tabs__tab--active' : ''}`}
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            id={`admin-tab-${tab.toLowerCase()}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="admin-tab-content"
        role="tabpanel"
        aria-labelledby={`admin-tab-${activeTab.toLowerCase()}`}
      >
        {activeTab === 'Donors' && <DonorsTable />}
        {activeTab === 'Requests' && <RequestsTable />}
        {activeTab === 'Users' && <UsersTable />}
      </div>
    </section>
  );
};

export default AdminPanel;
