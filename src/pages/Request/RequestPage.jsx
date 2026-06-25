import { useState } from 'react';
import './RequestPage.scss';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const URGENCY_OPTIONS = [
  {
    id: 'routine',
    label: 'Routine',
    detail: 'Within 48-72 hours',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'urgent',
    label: 'Urgent',
    detail: 'Within 12-24 hours',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C7.03 2 3 6.03 3 11c0 4.23 3.14 7.74 7.22 8.74L12 22l1.78-2.26C17.86 18.74 21 15.23 21 11c0-4.97-4.03-9-9-9z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'critical',
    label: 'Critical',
    detail: 'Immediate requirement',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 4.5 5.08 9.58 6.38 10.82.36.34.88.34 1.24 0C13.92 18.58 19 13.5 19 9c0-3.87-3.13-7-7-7z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 9h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 5v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const DropIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" />
  </svg>
);

const HospitalIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7v10M7 12h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
  </svg>
);

const RequestPage = () => {
  usePageTitle('Request Blood');
  const { addRequest } = useAppData();
  const { currentUser } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [urgency, setUrgency] = useState('critical');
  const [formData, setFormData] = useState({
    hospitalName: '',
    location: '',
    patientName: '',
    contactNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.hospitalName.trim()) e.hospitalName = 'Required';
    if (!formData.location.trim()) e.location = 'Required';
    if (!formData.patientName.trim()) e.patientName = 'Required';
    if (!formData.contactNumber.trim()) e.contactNumber = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    /* Store the request in the global state / localStorage */
    const urgencyLabel = urgency.charAt(0).toUpperCase() + urgency.slice(1);
    const neededByDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newRequest = addRequest({
      blood:       selectedGroup,
      hospital:    formData.hospitalName,
      patient:     formData.patientName,
      location:    formData.location,
      contactNumber: formData.contactNumber,
      units:       1,
      urgency:     urgencyLabel,
      note:        urgencyLabel,
      neededBy:    neededByDate,
      time:        'Just now',
      distance:    '—',
      userId:      currentUser?.id ?? null,
    });

    setIsSubmitting(false);
    setSubmittedId(newRequest.id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="request-page" id="request-page-success">
        <section className="request-page__hero">
          <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h1 className="request-page__title">Request Submitted!</h1>
            <p className="request-page__subtitle">
              Your blood request has been successfully submitted and is now active.
            </p>
            {submittedId && (
              <p style={{ marginTop: '0.75rem', opacity: 0.7, fontSize: '0.9rem' }}>
                Request ID: <strong>{submittedId}</strong>
              </p>
            )}
            <p style={{ marginTop: '0.5rem', opacity: 0.6, fontSize: '0.85rem' }}>
              You can track its status in your Dashboard under &ldquo;Active Requests&rdquo;.
            </p>
            <button 
              className="request-group-btn request-group-btn--active"
              style={{ marginTop: '2rem', padding: '0.75rem 2rem', borderRadius: '99px' }}
              onClick={() => {
                setSubmitted(false);
                setSubmittedId('');
                setFormData({ hospitalName: '', location: '', patientName: '', contactNumber: '' });
              }}
            >
              Submit Another Request
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="request-page" id="request-page">
      <section className="request-page__hero" aria-labelledby="request-heading">
        <div className="container">
          <h1 className="request-page__title" id="request-heading">Submit Blood Request</h1>
          <p className="request-page__subtitle">
            Please provide accurate details to help us match you with compatible donors as quickly as possible.
          </p>
        </div>
      </section>

      <section className="request-page__form" aria-label="Blood request form">
        <div className="container">
          <form className="request-card" onSubmit={handleSubmit} noValidate>
            <div className="request-section">

              <div className="request-section__header">
                <span className="request-section__icon"><DropIcon /></span>
                <h2 className="request-section__title">Required Blood Group</h2>
              </div>
              <div className="request-groups" role="group" aria-label="Select blood group">
                {BLOOD_GROUPS.map((group) => (
                  <button
                    key={group}
                    type="button"
                    className={`request-group-btn ${selectedGroup === group ? 'request-group-btn--active' : ''}`}
                    aria-pressed={selectedGroup === group}
                    onClick={() => setSelectedGroup(group)}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            <div className="request-divider" aria-hidden="true" />

            <div className="request-section">
              <div className="request-section__header">
                <span className="request-section__icon request-section__icon--clock">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <h2 className="request-section__title">Urgency Level</h2>
              </div>
              <div className="urgency-grid" role="group" aria-label="Select urgency">
                {URGENCY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`urgency-card ${urgency === option.id ? 'urgency-card--active' : ''}`}
                    aria-pressed={urgency === option.id}
                    onClick={() => setUrgency(option.id)}
                  >
                    <div className="urgency-card__icon">{option.icon}</div>
                    <div className="urgency-card__text">
                      <span className="urgency-card__label">{option.label}</span>
                      <span className="urgency-card__detail">{option.detail}</span>
                    </div>
                    {option.id === 'critical' && (
                      <span className="urgency-card__flag" aria-hidden="true">*</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="request-divider" aria-hidden="true" />

            <div className="request-section">
              <div className="request-section__header">
                <span className="request-section__icon"><HospitalIcon /></span>
                <h2 className="request-section__title">Hospital Details</h2>
              </div>

              <div className="request-field">
                <label className="request-field__label" htmlFor="hospital-name">Hospital/Clinic Name</label>
                <div className={`request-field__input ${errors.hospitalName ? 'error' : ''}`}>
                  <span className="request-field__icon"><HospitalIcon /></span>
                  <input id="hospital-name" name="hospitalName" value={formData.hospitalName} onChange={handleChange} type="text" placeholder="e.g. City General Hospital" />
                </div>
              </div>

              <div className="request-field">
                <label className="request-field__label" htmlFor="hospital-location">City / Area</label>
                <div className={`request-field__input ${errors.location ? 'error' : ''}`}>
                  <span className="request-field__icon"><LocationIcon /></span>
                  <input id="hospital-location" name="location" value={formData.location} onChange={handleChange} type="text" placeholder="Search location..." />
                </div>
              </div>

              <div className="request-grid">
                <div className="request-field">
                  <label className="request-field__label" htmlFor="patient-name">Patient Name</label>
                  <div className={`request-field__input ${errors.patientName ? 'error' : ''}`}>
                    <span className="request-field__icon">@</span>
                    <input id="patient-name" name="patientName" value={formData.patientName} onChange={handleChange} type="text" placeholder="Full Name" />
                  </div>
                </div>
                <div className="request-field">
                  <label className="request-field__label" htmlFor="contact-number">Contact Number</label>
                  <div className={`request-field__input ${errors.contactNumber ? 'error' : ''}`}>
                    <span className="request-field__icon"><PhoneIcon /></span>
                    <input id="contact-number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
              </div>

            </div>

            <div className="request-footer">
              <p className="request-footer__note">
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
              <button className="request-footer__submit" type="submit" disabled={isSubmitting}>
                <span className="request-footer__submit-icon">&#9654;</span>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>

      </section>
    </div>
  );
};

export default RequestPage;
