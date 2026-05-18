import React, { useState } from 'react';
import './DonorRegistrationPage.scss';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// ─── Application Status Banner ────────────────────────────────────────────────
const StatusBanner = ({ status }) => {
  const config = {
    pending: {
      icon: (
        <svg viewBox="0 0 24 24" className="status-banner__icon" aria-hidden="true">
          <path d="M6 2v6l4 4-4 4v6h12v-6l-4-4 4-4V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/>
        </svg>
      ),
      label: 'Application Status: Pending Approval',
      message: 'Your previous application is currently under review by our medical team. You can update your details below if needed.',
      modifier: 'status-banner--pending',
    },
    approved: {
      icon: (
        <svg viewBox="0 0 24 24" className="status-banner__icon" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/>
        </svg>
      ),
      label: 'Application Status: Approved',
      message: 'Your donor profile is active. You may update your details at any time.',
      modifier: 'status-banner--approved',
    },
  };

  if (!config[status]) return null;
  const { icon, label, message, modifier } = config[status];

  return (
    <div className={`status-banner ${modifier}`} role="status" id="application-status-banner">
      <div className="status-banner__icon-wrap">{icon}</div>
      <div>
        <p className="status-banner__label">{label}</p>
        <p className="status-banner__message">{message}</p>
      </div>
    </div>
  );
};

// ─── Donor Registration Page ───────────────────────────────────────────────────
const DonorRegistrationPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    bloodGroup: 'O+',
    lastDonationDate: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Demo: show pending banner if name is pre-filled (simulates returning user)
  const showBanner = true;

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required.';
    if (!formData.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^\+?[\d\s\-().]{7,20}$/.test(formData.phone)) e.phone = 'Enter a valid phone number.';
    if (!formData.city.trim()) e.city = 'City is required.';
    if (!formData.bloodGroup) e.bloodGroup = 'Please select a blood group.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBloodGroup = (group) => {
    setFormData((prev) => ({ ...prev, bloodGroup: group }));
    setErrors((prev) => ({ ...prev, bloodGroup: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="donor-reg-page" id="donor-registration-page">
        <div className="donor-reg-page__bg-deco" aria-hidden="true" />
        <div className="donor-reg-card" id="donor-reg-success-card">
          <div className="donor-reg-card__header">
            <div className="donor-reg-card__logo" aria-label="LifeStream">
              Life<span>Stream</span>
            </div>
          </div>
          <div className="donor-reg-page__success">
            <div className="donor-reg-page__success-icon" aria-hidden="true">🎉</div>
            <h2>Registration Submitted!</h2>
            <p>
              Thank you, <strong>{formData.fullName}</strong>! Your donor registration is now under review.
              Our medical team will verify your details within 24–48 hours.
            </p>
            <div className="donor-reg-page__success-detail">
              <span className="donor-reg-page__success-tag">
                Blood Group: {formData.bloodGroup}
              </span>
              <span className="donor-reg-page__success-tag">
                City: {formData.city}
              </span>
            </div>
            <button
              className="donor-reg-btn donor-reg-btn--primary"
              id="back-to-home-after-register"
              onClick={onBack}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="donor-reg-page" id="donor-registration-page">
      {/* Decorative blobs */}
      <div className="donor-reg-page__bg-deco" aria-hidden="true" />

      <div className="donor-reg-card" id="donor-reg-card">
        {/* Card Header */}
        <div className="donor-reg-card__header">
          <div className="donor-reg-card__logo" id="donor-reg-logo" aria-label="LifeStream">
            Life<span>Stream</span>
          </div>
          <h1 className="donor-reg-card__title">Donor Registration</h1>
          <p className="donor-reg-card__subtitle">Join our network and help save lives.</p>
        </div>

        {/* Divider */}
        <div className="donor-reg-card__divider" aria-hidden="true" />

        {/* Status Banner */}
        {showBanner && <StatusBanner status="pending" />}

        {/* Form */}
        <form
          className="donor-reg-form"
          id="donor-registration-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Full Name */}
          <div className={`donor-reg-form__field ${errors.fullName ? 'donor-reg-form__field--error' : ''}`}>
            <label htmlFor="donor-fullname" className="donor-reg-form__label">Full Name</label>
            <input
              id="donor-fullname"
              name="fullName"
              type="text"
              className="donor-reg-form__input"
              placeholder="Alex Johnson"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.fullName && <span className="donor-reg-form__error">{errors.fullName}</span>}
          </div>

          {/* Phone + City */}
          <div className="donor-reg-form__row">
            <div className={`donor-reg-form__field ${errors.phone ? 'donor-reg-form__field--error' : ''}`}>
              <label htmlFor="donor-phone" className="donor-reg-form__label">Phone Number</label>
              <div className="donor-reg-form__input-wrap">
                <svg viewBox="0 0 24 24" className="donor-reg-form__input-icon" aria-hidden="true">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <input
                  id="donor-phone"
                  name="phone"
                  type="tel"
                  className="donor-reg-form__input donor-reg-form__input--icon"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <span className="donor-reg-form__error">{errors.phone}</span>}
            </div>

            <div className={`donor-reg-form__field ${errors.city ? 'donor-reg-form__field--error' : ''}`}>
              <label htmlFor="donor-city" className="donor-reg-form__label">City</label>
              <div className="donor-reg-form__input-wrap">
                <svg viewBox="0 0 24 24" className="donor-reg-form__input-icon" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <input
                  id="donor-city"
                  name="city"
                  type="text"
                  className="donor-reg-form__input donor-reg-form__input--icon"
                  placeholder="Portland"
                  value={formData.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                />
              </div>
              {errors.city && <span className="donor-reg-form__error">{errors.city}</span>}
            </div>
          </div>

          {/* Blood Group */}
          <div className={`donor-reg-form__field ${errors.bloodGroup ? 'donor-reg-form__field--error' : ''}`}>
            <label className="donor-reg-form__label">Blood Group</label>
            <div className="donor-reg-form__blood-grid" id="donor-blood-group-grid" role="group" aria-label="Select blood group">
              {BLOOD_GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  id={`donor-blood-${group.replace('+', 'pos').replace('-', 'neg')}`}
                  className={`donor-reg-form__blood-btn ${formData.bloodGroup === group ? 'donor-reg-form__blood-btn--active' : ''}`}
                  onClick={() => handleBloodGroup(group)}
                  aria-pressed={formData.bloodGroup === group}
                >
                  {formData.bloodGroup === group && (
                    <svg viewBox="0 0 24 24" className="donor-reg-form__blood-drop" aria-hidden="true">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                  )}
                  {group}
                </button>
              ))}
            </div>
            {errors.bloodGroup && <span className="donor-reg-form__error">{errors.bloodGroup}</span>}
          </div>

          {/* Last Donation Date */}
          <div className="donor-reg-form__field">
            <label htmlFor="donor-last-date" className="donor-reg-form__label">
              Last Donation Date
              <span className="donor-reg-form__optional">(Optional)</span>
            </label>
            <div className="donor-reg-form__input-wrap">
              <svg viewBox="0 0 24 24" className="donor-reg-form__input-icon" aria-hidden="true">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              <input
                id="donor-last-date"
                name="lastDonationDate"
                type="date"
                className="donor-reg-form__input donor-reg-form__input--icon donor-reg-form__input--date"
                value={formData.lastDonationDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="donor-reg-form__actions">
            <button
              type="button"
              className="donor-reg-btn donor-reg-btn--cancel"
              id="donor-reg-cancel-btn"
              onClick={onBack}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="donor-reg-btn donor-reg-btn--primary"
              id="donor-reg-submit-btn"
            >
              Update Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonorRegistrationPage;
