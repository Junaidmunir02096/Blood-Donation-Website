import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faDroplet,
  faLocationDot,
  faEnvelope,
  faPhone,
  faRightFromBracket,
  faKey,
  faShieldHalved,
  faHeart,
  faCheck,
  faFire,
  faTint,
  faCalendarCheck,
  faCircleCheck,
  faChevronRight,
  faStar,
  faAward,
  faBell,
  faMoon,
  faSun,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import './MyProfile.scss';
import { lifestyleItems, timelineEvents, achievements, notifPrefs } from '../../data/profile.data';


/* ─── Editable Field ─────────────────────────────────── */
const EditableField = ({ label, value, type = 'text', id }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="profile-field">
      <label className="profile-field__label" htmlFor={id}>{label}</label>
      {editing ? (
        <div className="profile-field__edit-row">
          <input
            id={id}
            type={type}
            className="profile-field__input"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            autoFocus
          />
          <button className="profile-field__save-btn" type="button" onClick={handleSave} id={`${id}-save`}>
            <FontAwesomeIcon icon={faCheck} /> Save
          </button>
        </div>
      ) : (
        <div className="profile-field__view-row">
          <span className="profile-field__value">{val}</span>
          <button
            className="profile-field__edit-btn"
            type="button"
            onClick={() => setEditing(true)}
            id={`${id}-edit`}
            aria-label={`Edit ${label}`}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          {saved && <span className="profile-field__saved-tag"><FontAwesomeIcon icon={faCircleCheck} /> Saved</span>}
        </div>
      )}
    </div>
  );
};

/* ─── Lifestyle Tracker Card ─────────────────────────── */
const LifestyleTracker = () => (
  <div className="profile-lifestyle">
    <div className="profile-lifestyle__header">
      <div className="profile-lifestyle__title-group">
        <span className="profile-lifestyle__icon-wrap" aria-hidden="true">
          <FontAwesomeIcon icon={faFire} />
        </span>
        <div>
          <h3 className="profile-lifestyle__title">Lifestyle Tracker</h3>
          <p className="profile-lifestyle__subtitle">Today's wellness metrics</p>
        </div>
      </div>
      <span className="profile-lifestyle__score">Score: <strong>76</strong>/100</span>
    </div>
    <div className="profile-lifestyle__items">
      {lifestyleItems.map((item) => (
        <div className="profile-lifestyle__item" key={item.id} id={item.id}>
          <div className="profile-lifestyle__item-top">
            <div className="profile-lifestyle__item-label">
              <span className="profile-lifestyle__item-icon" style={{ color: item.color }} aria-hidden="true">
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <span className="profile-lifestyle__item-name">{item.label}</span>
            </div>
            <span className="profile-lifestyle__item-value">{item.value}</span>
          </div>
          <div className="profile-lifestyle__bar-track" role="progressbar" aria-valuenow={item.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.label}: ${item.pct}%`}>
            <div
              className="profile-lifestyle__bar-fill"
              style={{ width: `${item.pct}%`, background: item.color }}
            />
          </div>
          <p className="profile-lifestyle__item-target">Target: {item.target}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Donation Timeline ──────────────────────────────── */
const DonationTimeline = () => (
  <div className="profile-timeline">
    <div className="profile-timeline__header">
      <h3 className="profile-timeline__title">
        <FontAwesomeIcon icon={faCalendarCheck} className="profile-timeline__title-icon" />
        Donation History
      </h3>
      <span className="profile-timeline__count">14 Total</span>
    </div>
    <ol className="profile-timeline__list" aria-label="Donation history timeline">
      {timelineEvents.map((ev, idx) => (
        <li className="profile-timeline__item" key={ev.id} id={ev.id}>
          <div className="profile-timeline__dot" aria-hidden="true">
            <FontAwesomeIcon icon={faDroplet} />
          </div>
          {idx < timelineEvents.length - 1 && <div className="profile-timeline__line" aria-hidden="true" />}
          <div className="profile-timeline__content">
            <div className="profile-timeline__top">
              <p className="profile-timeline__hospital">{ev.hospital}</p>
              <span className="profile-timeline__badge">{ev.badge}</span>
            </div>
            <p className="profile-timeline__meta">
              <FontAwesomeIcon icon={faCalendarCheck} />
              {ev.date} &bull; {ev.units} donated
            </p>
          </div>
        </li>
      ))}
    </ol>
    <button className="profile-timeline__show-more" type="button" id="profile-timeline-more">
      View all 14 donations <FontAwesomeIcon icon={faChevronRight} />
    </button>
  </div>
);

/* ─── Achievement Badges ─────────────────────────────── */
const Achievements = () => (
  <div className="profile-achievements">
    <h3 className="profile-achievements__title">
      <FontAwesomeIcon icon={faAward} className="profile-achievements__title-icon" />
      Achievements
    </h3>
    <div className="profile-achievements__grid">
      {achievements.map((a) => (
        <div
          key={a.id}
          id={a.id}
          className={`profile-achievements__item${a.earned ? '' : ' profile-achievements__item--locked'}`}
          title={a.earned ? `Earned: ${a.desc}` : `Locked – ${a.desc}`}
        >
          <span className="profile-achievements__icon" aria-hidden="true">
            <FontAwesomeIcon icon={a.icon} />
          </span>
          <p className="profile-achievements__label">{a.label}</p>
          <p className="profile-achievements__desc">{a.desc}</p>
          {a.earned && <span className="profile-achievements__check" aria-label="Earned"><FontAwesomeIcon icon={faCircleCheck} /></span>}
        </div>
      ))}
    </div>
  </div>
);

/* ─── Notification Prefs ─────────────────────────────── */
const NotificationSettings = () => {
  const [prefs, setPrefs] = useState(
    notifPrefs.reduce((acc, p) => ({ ...acc, [p.id]: p.default }), {})
  );

  return (
    <div className="profile-notif">
      <h3 className="profile-notif__title">
        <FontAwesomeIcon icon={faBell} className="profile-notif__title-icon" />
        Notification Preferences
      </h3>
      <div className="profile-notif__list">
        {notifPrefs.map((pref) => (
          <div className="profile-notif__item" key={pref.id}>
            <span className="profile-notif__pref-icon" aria-hidden="true">
              <FontAwesomeIcon icon={pref.icon} />
            </span>
            <div className="profile-notif__text">
              <p className="profile-notif__label">{pref.label}</p>
              <p className="profile-notif__desc">{pref.desc}</p>
            </div>
            <label className="profile-toggle" htmlFor={pref.id} aria-label={`Toggle ${pref.label}`}>
              <input
                type="checkbox"
                id={pref.id}
                className="profile-toggle__input"
                checked={prefs[pref.id]}
                onChange={() => setPrefs((prev) => ({ ...prev, [pref.id]: !prev[pref.id] }))}
              />
              <span className="profile-toggle__track">
                <span className="profile-toggle__thumb" aria-hidden="true">
                  <FontAwesomeIcon icon={prefs[pref.id] ? faSun : faMoon} />
                </span>
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main MyProfile Component ───────────────────────── */
const MyProfile = () => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const nextDonationDays = 12;

  return (
    <section className="my-profile" aria-labelledby="my-profile-title">

      {/* ── Page Heading ── */}
      <div className="my-profile__heading">
        <div>
          <h1 className="my-profile__title" id="my-profile-title">My Profile</h1>
          <p className="my-profile__subtitle">Manage your personal information and donation settings.</p>
        </div>
      </div>

      {/* ══ Row 1: Hero Card + Blood Group ══════════════════ */}
      <div className="my-profile__hero-row">

        {/* Hero Card */}
        <div className="profile-hero-card">
          {/* Avatar */}
          <div className="profile-hero-card__avatar-wrap">
            {!imgError ? (
              <img
                src="/profile_avatar.png"
                alt="Elena Rostova profile photo"
                className="profile-hero-card__avatar"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="profile-hero-card__avatar-fallback" aria-hidden="true">ER</div>
            )}
            <button
              className="profile-hero-card__avatar-overlay"
              type="button"
              aria-label="Change profile photo"
              id="profile-change-photo"
            >
              <FontAwesomeIcon icon={faCamera} />
            </button>
          </div>

          {/* Info */}
          <div className="profile-hero-card__info">
            <div className="profile-hero-card__name-row">
              <h2 className="profile-hero-card__name">Elena Rostova</h2>
              <button
                className="profile-hero-card__edit-btn"
                type="button"
                id="profile-edit-btn"
                onClick={() => setEditingProfile(!editingProfile)}
                aria-pressed={editingProfile}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                {editingProfile ? 'Done' : 'Edit Profile'}
              </button>
            </div>

            <div className="profile-hero-card__meta-row">
              <span className="profile-hero-card__verified-badge">
                <FontAwesomeIcon icon={faShieldHalved} />
                Verified Donor
              </span>
              <span className="profile-hero-card__joined">Joined March 2022</span>
            </div>

            <p className="profile-hero-card__bio">
              Dedicated blood donor committed to helping the local community. Always ready to respond to urgent medical requests.
            </p>
          </div>
        </div>

        {/* Blood Group Card */}
        <div className="profile-blood-card" id="profile-blood-group-card">
          <p className="profile-blood-card__label">
            <FontAwesomeIcon icon={faDroplet} className="profile-blood-card__label-icon" />
            BLOOD GROUP
          </p>
          <div className="profile-blood-card__group" aria-label="Blood group O positive">O+</div>
          <p className="profile-blood-card__eligibility">
            Eligible to donate in{' '}
            <strong className="profile-blood-card__days">{nextDonationDays} days</strong>
          </p>
          <div className="profile-blood-card__countdown-bar" aria-hidden="true">
            <div
              className="profile-blood-card__countdown-fill"
              style={{ width: `${((90 - nextDonationDays) / 90) * 100}%` }}
            />
          </div>
          <p className="profile-blood-card__countdown-hint">90-day donation cycle</p>
        </div>
      </div>

      {/* ══ Row 2: Contact + Lifetime Impact ════════════════ */}
      <div className="my-profile__mid-row">

        {/* Contact Details */}
        <div className="profile-contact-card">
          <h3 className="profile-contact-card__title">Contact Details</h3>

          {editingProfile ? (
            <div className="profile-contact-card__fields">
              <EditableField id="field-location" label="Primary Location" value="Portland Metro Area, Oregon" />
              <EditableField id="field-center"   label="Preferred Center" value="Westside General" />
              <EditableField id="field-email"    label="Email Address"    value="elena.rostova@example.com" type="email" />
              <EditableField id="field-phone"    label="Phone Number"     value="+1 (503) 555-0182" type="tel" />
            </div>
          ) : (
            <div className="profile-contact-card__items">
              <div className="profile-contact-item" id="contact-location">
                <span className="profile-contact-item__icon profile-contact-item__icon--location" aria-hidden="true">
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>
                <div>
                  <p className="profile-contact-item__primary">Primary Location</p>
                  <p className="profile-contact-item__value">Portland Metro Area, Oregon</p>
                  <p className="profile-contact-item__sub">Preferred Center: Westside General</p>
                </div>
              </div>

              <div className="profile-contact-item" id="contact-email">
                <span className="profile-contact-item__icon profile-contact-item__icon--email" aria-hidden="true">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <div>
                  <p className="profile-contact-item__primary">Email Address</p>
                  <p className="profile-contact-item__value">elena.rostova@example.com</p>
                </div>
              </div>

              <div className="profile-contact-item" id="contact-phone">
                <span className="profile-contact-item__icon profile-contact-item__icon--phone" aria-hidden="true">
                  <FontAwesomeIcon icon={faPhone} />
                </span>
                <div>
                  <p className="profile-contact-item__primary">Phone Number</p>
                  <p className="profile-contact-item__value">+1 (503) 555-0182</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lifetime Impact */}
        <div className="profile-impact-card" id="profile-lifetime-impact">
          <div className="profile-impact-card__header">
            <span className="profile-impact-card__icon" aria-hidden="true">
              <FontAwesomeIcon icon={faHeart} />
            </span>
            <div>
              <h3 className="profile-impact-card__title">Lifetime Impact</h3>
              <p className="profile-impact-card__subtitle">Your contributions matter</p>
            </div>
          </div>

          <div className="profile-impact-card__stats">
            <div className="profile-impact-stat" id="impact-total-donations">
              <span className="profile-impact-stat__value">14</span>
              <span className="profile-impact-stat__label">TOTAL DONATIONS</span>
            </div>
            <div className="profile-impact-divider" aria-hidden="true" />
            <div className="profile-impact-stat" id="impact-lives-saved">
              <span className="profile-impact-stat__value">42</span>
              <span className="profile-impact-stat__label">POTENTIAL LIVES SAVED</span>
            </div>
          </div>

          <div className="profile-impact-card__extra">
            <div className="profile-impact-mini" id="impact-ml-donated">
              <span className="profile-impact-mini__val">6,300<span className="profile-impact-mini__unit">ml</span></span>
              <span className="profile-impact-mini__lbl">Blood Donated</span>
            </div>
            <div className="profile-impact-mini" id="impact-streak">
              <span className="profile-impact-mini__val">5<span className="profile-impact-mini__unit">×</span></span>
              <span className="profile-impact-mini__lbl">Streak</span>
            </div>
            <div className="profile-impact-mini" id="impact-rank">
              <span className="profile-impact-mini__val">Top<span className="profile-impact-mini__unit"> 10%</span></span>
              <span className="profile-impact-mini__lbl">Donor Rank</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Row 3: Lifestyle Tracker + Achievements ═════════ */}
      <div className="my-profile__tracker-row">
        <LifestyleTracker />
        <Achievements />
      </div>

      {/* ══ Row 4: Donation Timeline + Notification Prefs ═══ */}
      <div className="my-profile__bottom-row">
        <DonationTimeline />
        <NotificationSettings />
      </div>

      {/* ══ Account Security ════════════════════════════════ */}
      <div className="profile-security-card" id="profile-account-security">
        <div className="profile-security-card__left">
          <span className="profile-security-card__icon" aria-hidden="true">
            <FontAwesomeIcon icon={faShieldHalved} />
          </span>
          <div>
            <p className="profile-security-card__title">Account Security</p>
            <p className="profile-security-card__desc">Manage your password or sign out of your current session.</p>
          </div>
        </div>
        <div className="profile-security-card__actions">
          <button
            className="profile-security-card__btn profile-security-card__btn--outline"
            type="button"
            id="profile-change-password"
            onClick={() => setShowPasswordModal(true)}
          >
            <FontAwesomeIcon icon={faKey} />
            Change Password
          </button>
          <button
            className="profile-security-card__btn profile-security-card__btn--danger"
            type="button"
            id="profile-logout"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </button>
        </div>
      </div>

      {/* ══ Change Password Modal ════════════════════════════ */}
      {showPasswordModal && (
        <div
          className="profile-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => e.target === e.currentTarget && setShowPasswordModal(false)}
        >
          <div className="profile-modal">
            <h3 className="profile-modal__title" id="modal-title">
              <FontAwesomeIcon icon={faKey} /> Change Password
            </h3>
            <div className="profile-modal__fields">
              <div className="profile-field">
                <label className="profile-field__label" htmlFor="modal-current-pw">Current Password</label>
                <input id="modal-current-pw" type="password" className="profile-field__input" placeholder="••••••••" />
              </div>
              <div className="profile-field">
                <label className="profile-field__label" htmlFor="modal-new-pw">New Password</label>
                <input id="modal-new-pw" type="password" className="profile-field__input" placeholder="Min. 8 characters" />
              </div>
              <div className="profile-field">
                <label className="profile-field__label" htmlFor="modal-confirm-pw">Confirm New Password</label>
                <input id="modal-confirm-pw" type="password" className="profile-field__input" placeholder="Repeat new password" />
              </div>
            </div>
            <div className="profile-modal__actions">
              <button
                className="profile-security-card__btn profile-security-card__btn--outline"
                type="button"
                id="modal-cancel"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="profile-security-card__btn profile-security-card__btn--primary"
                type="button"
                id="modal-save-password"
                onClick={() => setShowPasswordModal(false)}
              >
                <FontAwesomeIcon icon={faCheck} /> Update Password
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default MyProfile;
