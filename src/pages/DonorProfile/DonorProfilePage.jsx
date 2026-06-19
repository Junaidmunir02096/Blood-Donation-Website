import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppSpinner from '../../components/AppSpinner/AppSpinner';
import { fetchDonorById } from '../../api/services';
import usePageTitle from '../../hooks/usePageTitle';
import './DonorProfilePage.scss';

/* ── Avatar color palette (same as Search page) ── */
const AVATAR_COLORS = [
  '#c0392b', '#2980b9', '#27ae60', '#8e44ad',
  '#e67e22', '#16a085', '#d35400', '#2c3e50',
];
const getAvatarColor = (id) => AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];

/* ── Donor details enriched beyond the list card ── */
const DONOR_EXTRA = {
  1:  { donations: 14, lives: 42, streak: 5, joined: 'March 2022',  phone: '+1 (206) 555-0101', canContact: true  },
  2:  { donations: 8,  lives: 24, streak: 3, joined: 'July 2022',   phone: '+1 (425) 555-0182', canContact: true  },
  3:  { donations: 3,  lives: 9,  streak: 1, joined: 'January 2023', phone: null,               canContact: false },
  4:  { donations: 22, lives: 66, streak: 8, joined: 'September 2021', phone: '+1 (425) 555-0211', canContact: true },
  5:  { donations: 11, lives: 33, streak: 4, joined: 'April 2022',  phone: '+1 (425) 555-0177', canContact: true  },
  6:  { donations: 17, lives: 51, streak: 6, joined: 'December 2021', phone: '+1 (425) 555-0134', canContact: true },
  7:  { donations: 9,  lives: 27, streak: 2, joined: 'June 2022',   phone: '+1 (425) 555-0198', canContact: true  },
  8:  { donations: 2,  lives: 6,  streak: 1, joined: 'March 2023',  phone: null,               canContact: false },
  9:  { donations: 7,  lives: 21, streak: 3, joined: 'August 2022', phone: '+1 (253) 555-0163', canContact: true  },
  10: { donations: 12, lives: 36, streak: 5, joined: 'November 2021', phone: '+1 (253) 555-0145', canContact: true },
  11: { donations: 1,  lives: 3,  streak: 1, joined: 'May 2023',    phone: null,               canContact: false },
  12: { donations: 28, lives: 84, streak: 11, joined: 'January 2021', phone: '+1 (425) 555-0122', canContact: true },
};

/* ── Info row item ── */
const InfoItem = ({ icon, label, value }) => (
  <div className="donor-profile__info-item">
    <div className="donor-profile__info-item-icon" aria-hidden="true">{icon}</div>
    <div className="donor-profile__info-item-text">
      <p>{label}</p>
      <p>{value}</p>
    </div>
  </div>
);

const BloodSvg = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);

const LocationSvg = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const CalSvg = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
  </svg>
);

const PhoneSvg = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════
   Main Page Component
═══════════════════════════════════════════════════════ */
const DonorProfilePage = () => {
  const { id } = useParams();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageTitle(donor ? `${donor.name} — Donor Profile` : 'Donor Profile');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchDonorById(id);
      setDonor(data);
      setLoading(false);
    };
    load();
  }, [id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="donor-profile">
        <div className="donor-profile__hero" />
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
          <AppSpinner label="Loading donor profile..." />
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!donor) {
    return (
      <div className="donor-profile" id="donor-profile-page">
        <div className="donor-profile__hero">
          <Link to="/search" className="donor-profile__back-link" id="back-to-search-from-404">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            Back to Search
          </Link>
        </div>
        <div className="donor-profile__not-found">
          <span className="donor-profile__not-found-icon" aria-hidden="true">🔍</span>
          <h2>Donor not found</h2>
          <p>This donor profile doesn't exist or may have been removed.</p>
          <Link to="/search" className="not-found__btn-primary" id="search-again-btn" style={{ textDecoration: 'none' }}>
            Find another donor
          </Link>
        </div>
      </div>
    );
  }

  const extra = DONOR_EXTRA[donor.id] ?? { donations: 1, lives: 3, streak: 1, joined: '2024', canContact: false };
  const isVerified = donor.status === 'verified';
  const avatarColor = getAvatarColor(donor.id);

  return (
    <div className="donor-profile" id={`donor-profile-${donor.id}`}>

      {/* ── Hero Banner ─────────────────────────── */}
      <div className="donor-profile__hero">
        <Link to="/search" className="donor-profile__back-link" id="back-to-search-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Search
        </Link>
      </div>

      {/* ── Profile Card ────────────────────────── */}
      <div className="donor-profile__card" id="donor-profile-card">

        {/* Header */}
        <div className="donor-profile__header">

          {/* Avatar */}
          <div
            className="donor-profile__avatar"
            style={{ background: avatarColor }}
            aria-label={`${donor.name}'s avatar`}
          >
            {donor.avatar}
            {isVerified && (
              <span className="donor-profile__avatar-status" aria-label="Active donor" />
            )}
          </div>

          {/* Name + meta */}
          <div className="donor-profile__name-group">
            <h1 className="donor-profile__name">{donor.name}</h1>

            {isVerified ? (
              <span className="donor-profile__verified">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
                Verified Donor
              </span>
            ) : (
              <span style={{ display: 'inline-block', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, marginBottom: '0.5rem' }}>
                ⏳ Pending Verification
              </span>
            )}

            <div className="donor-profile__tags">
              <span className="donor-profile__tag">
                <LocationSvg />{donor.city}
              </span>
              <span className="donor-profile__tag">
                <CalSvg />Joined {extra.joined}
              </span>
              <span className="donor-profile__tag">
                🕐 Last donated: {donor.lastDonated}
              </span>
            </div>
          </div>

          {/* Blood group badge */}
          <div className="donor-profile__blood-badge" aria-label={`Blood group ${donor.bloodGroup}`}>
            <span className="donor-profile__blood-badge-label">Blood</span>
            <span className="donor-profile__blood-badge-group">{donor.bloodGroup}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="donor-profile__stats" role="list" aria-label="Donation statistics">
          <div className="donor-profile__stat" role="listitem" id={`stat-donations-${donor.id}`}>
            <span className="donor-profile__stat-value">{extra.donations}</span>
            <span className="donor-profile__stat-label">Total Donations</span>
          </div>
          <div className="donor-profile__stat" role="listitem" id={`stat-lives-${donor.id}`}>
            <span className="donor-profile__stat-value">{extra.lives}</span>
            <span className="donor-profile__stat-label">Lives Impacted</span>
          </div>
          <div className="donor-profile__stat" role="listitem" id={`stat-streak-${donor.id}`}>
            <span className="donor-profile__stat-value">{extra.streak}×</span>
            <span className="donor-profile__stat-label">Donation Streak</span>
          </div>
        </div>

        {/* Info grid */}
        <div className="donor-profile__info-grid">
          <InfoItem icon={<BloodSvg />}    label="Blood Group" value={donor.bloodGroup} />
          <InfoItem icon={<LocationSvg />} label="Location" value={donor.city} />
          <InfoItem icon={<CalSvg />}      label="Last Donation" value={donor.lastDonated} />
          <InfoItem icon={<CalSvg />}      label="Member Since" value={extra.joined} />
          {extra.canContact && extra.phone && (
            <InfoItem icon={<PhoneSvg />} label="Contact" value={extra.phone} />
          )}
          <InfoItem
            icon={isVerified
              ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
              : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            }
            label="Status"
            value={isVerified ? 'Verified ✓' : 'Pending Verification'}
          />
        </div>

        {/* Actions */}
        <div className="donor-profile__actions">
          {extra.canContact && extra.phone ? (
            <a
              href={`tel:${extra.phone}`}
              className="donor-profile__btn-primary"
              id={`call-donor-${donor.id}`}
            >
              <PhoneSvg />
              Call Donor
            </a>
          ) : (
            <button
              className="donor-profile__btn-primary"
              id={`request-contact-${donor.id}`}
              type="button"
              style={{ cursor: 'not-allowed', opacity: 0.6 }}
              title="Contact unavailable until donor is verified"
              disabled
            >
              Contact Unavailable
            </button>
          )}
          <Link to="/search" className="donor-profile__btn-secondary" id="find-another-donor-btn">
            Find Another Donor
          </Link>
        </div>

      </div>
    </div>
  );
};

export default DonorProfilePage;
