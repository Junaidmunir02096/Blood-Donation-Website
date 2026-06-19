import { useState, useRef, useEffect } from 'react';
import './DonorRegistrationPage.scss';
import MapPickerModal from '../../components/MapPicker/MapPickerModal';
import CustomCalendar, { formatDisplayDate } from '../../components/CustomCalendar/CustomCalendar';
import { useAuth } from '../../context/AuthContext';

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
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName ?? '',
    phone: '',
    city: '',
    country: '',
    bloodGroup: currentUser?.bloodGroup ?? 'O+',
    lastDonationDate: '',
  });
  const [errors, setErrors]             = useState({});
  const [submitted, setSubmitted]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapOpen, setIsMapOpen]       = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const dateFieldRef                    = useRef(null); // wraps trigger + inline calendar

  // Show the pending status banner only when user already has a submitted registration.
  // For now this is tied to role: in future replace with a real API check.
  // role === 'donor' means they've completed registration before (mock logic).
  const showBanner = currentUser?.hasPendingRegistration === true;

  // Close calendar when clicking outside the entire date field
  useEffect(() => {
    if (!showCalendar) return;
    const handler = (e) => {
      if (dateFieldRef.current && !dateFieldRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCalendar]);

  // Demo: show pending banner if name is pre-filled (simulates returning user)
  // const showBanner = true;

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

  // Called when user confirms a location in the map modal
  const handleMapConfirm = ({ city, country }) => {
    setFormData((prev) => ({ ...prev, city, country }));
    setErrors((prev) => ({ ...prev, city: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsSubmitting(true);
    // Simulate API call to backend
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSubmitting(false);

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
              <span className="donor-reg-page__success-tag donor-reg-page__success-tag--location">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {formData.city}{formData.country ? `, ${formData.country}` : ''}
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
    <>
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

              {/* ── City: Map Picker field ── */}
              <div className={`donor-reg-form__field ${errors.city ? 'donor-reg-form__field--error' : ''}`}>
                <label htmlFor="donor-city" className="donor-reg-form__label">City / Location</label>
                <div
                  className={`donor-reg-form__map-trigger ${formData.city ? 'donor-reg-form__map-trigger--filled' : ''}`}
                  id="donor-city-map-trigger"
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsMapOpen(true)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsMapOpen(true)}
                  aria-label={formData.city ? `Selected: ${formData.city}. Click to change.` : 'Click to pick city on map'}
                >
                  {/* Pin icon */}
                  <svg viewBox="0 0 24 24" className="donor-reg-form__map-pin-icon" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>

                  <span className={`donor-reg-form__map-trigger-text ${!formData.city ? 'donor-reg-form__map-trigger-text--placeholder' : ''}`}>
                    {formData.city
                      ? `${formData.city}${formData.country ? `, ${formData.country}` : ''}`
                      : 'Pick city on map…'}
                  </span>

                  {/* Open map icon */}
                  <svg viewBox="0 0 24 24" className="donor-reg-form__map-open-icon" aria-hidden="true">
                    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
                  </svg>
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

            {/* Last Donation Date — inline calendar picker */}
            <div className="donor-reg-form__field" ref={dateFieldRef}>
              <label className="donor-reg-form__label">
                Last Donation Date
                <span className="donor-reg-form__optional">(Optional)</span>
              </label>

              {/* Trigger button */}
              <div
                className={`donor-reg-form__date-trigger ${
                  formData.lastDonationDate ? 'donor-reg-form__date-trigger--filled' : ''
                } ${
                  showCalendar ? 'donor-reg-form__date-trigger--open' : ''
                }`}
                id="donor-last-date-trigger"
                role="button" 
                tabIndex={0}
                onClick={() => setShowCalendar((v) => !v)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') && setShowCalendar((v) => !v)
                }
                aria-label={
                  formData.lastDonationDate
                    ? `Last donation: ${formatDisplayDate(formData.lastDonationDate)}. Click to change.`
                    : 'Click to pick last donation date'
                }
                aria-haspopup="dialog"
                aria-expanded={showCalendar}
              >
                {/* Calendar icon */}
                <svg viewBox="0 0 24 24" className="donor-reg-form__date-icon" aria-hidden="true">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>

                <span className={`donor-reg-form__date-text ${
                  !formData.lastDonationDate ? 'donor-reg-form__date-text--placeholder' : ''
                }`}>
                  {formData.lastDonationDate
                    ? formatDisplayDate(formData.lastDonationDate)
                    : 'Select date…'}
                </span>

                {/* Chevron */}
                <svg
                  viewBox="0 0 24 24"
                  className={`donor-reg-form__date-chevron ${
                    showCalendar ? 'donor-reg-form__date-chevron--up' : ''
                  }`}
                  aria-hidden="true"
                >
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>

              {/* Inline Calendar — expands inside the card, no portal needed */}
              {showCalendar && (
                <div className="donor-reg-form__cal-inline">
                  <CustomCalendar
                    value={formData.lastDonationDate}
                    maxDate={new Date().toISOString().split('T')[0]}
                    onChange={(dateStr) =>
                      setFormData((prev) => ({ ...prev, lastDonationDate: dateStr }))
                    }
                    onClose={() => setShowCalendar(false)}
                  />
                </div>
              )}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>

            </div>
          </form>
        </div>
      </div>

      {/* Map Picker Modal */}
      <MapPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onConfirm={handleMapConfirm}
        initialCity={formData.city}
      />
    </>
  );
};

export default DonorRegistrationPage;
