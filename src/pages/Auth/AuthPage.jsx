import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';
import './AuthPage.scss';
import authHero from '../../assets/auth-hero.png';

import { BLOOD_GROUPS } from '../../constants/blood';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: '20px', height: '20px' }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: '20px', height: '20px' }}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ── Password strength checker ── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const levels = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Weak', color: '#e74c3c' },
    { score: 2, label: 'Fair', color: '#f39c12' },
    { score: 3, label: 'Good', color: '#3498db' },
    { score: 4, label: 'Strong', color: '#27ae60' },
  ];
  return levels[score];
};

// ─── Register Form ────────────────────────────────────────────────────────────
const RegisterForm = ({ onSwitch, onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const strength = getStrength(formData.password);

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required.';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = 'Enter a valid email address.';
    if (formData.password.length < 8)
      e.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleBloodGroup = (group) => {
    setFormData((prev) => ({
      ...prev,
      bloodGroup: prev.bloodGroup === group ? '' : group,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    setIsSubmitting(true);
    const res = await register(formData);
    setIsSubmitting(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      setServerError(res.error);
    }
  };

  if (submitted) {
    return (
      <div className="auth__success" id="register-success">
        <div className="auth__success-icon">🎉</div>
        <h2>Welcome aboard!</h2>
        <p>Your account has been created. You are now part of the LifeStream network.</p>
        <button className="auth__btn auth__btn--primary" onClick={onSuccess}>
          Go to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div className="auth__form-wrapper" id="register-form">
      <h1 className="auth__title">Create an Account</h1>
      <p className="auth__subtitle">Register as a donor or medical coordinator.</p>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="auth__server-error">{serverError}</div>}
        
        {/* Full Name */}

        <div className={`auth__field ${errors.fullName ? 'auth__field--error' : ''}`}>
          <label htmlFor="reg-fullname" className="auth__label">Full Name</label>
          <div className="auth__input-wrap">
            <svg className="auth__input-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            <input
              id="reg-fullname"
              name="fullName"
              type="text"
              className="auth__input"
              placeholder="Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'reg-fullname-error' : undefined}
            />
          </div>
          {errors.fullName && <span className="auth__error" id="reg-fullname-error" role="alert">{errors.fullName}</span>}
        </div>

        {/* Email */}
        <div className={`auth__field ${errors.email ? 'auth__field--error' : ''}`}>
          <label htmlFor="reg-email" className="auth__label">Email Address</label>
          <div className="auth__input-wrap">
            <svg className="auth__input-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="auth__input"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {errors.email && <span className="auth__error">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className={`auth__field ${errors.password ? 'auth__field--error' : ''}`}>
          <label htmlFor="reg-password" className="auth__label">Password</label>
          <div className="auth__input-wrap">
            <svg className="auth__input-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <input
              id="reg-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="auth__input"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth__toggle-pw"
              id="reg-toggle-pw"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Strength meter */}
          {formData.password && (
            <div className="auth__strength">
              <div className="auth__strength-bar">
                <div
                  className="auth__strength-fill"
                  style={{
                    width: `${(strength.score / 4) * 100}%`,
                    background: strength.color,
                  }}
                />
              </div>
              <span className="auth__strength-label" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          {errors.password && <span className="auth__error">{errors.password}</span>}
        </div>

        {/* Confirm Password */}
        <div className={`auth__field ${errors.confirmPassword ? 'auth__field--error' : ''}`}>
          <label htmlFor="reg-confirm-password" className="auth__label">Confirm Password</label>
          <div className="auth__input-wrap">
            <svg className="auth__input-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <input
              id="reg-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="auth__input"
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth__toggle-pw"
              id="reg-confirm-toggle-pw"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.confirmPassword && <span className="auth__error">{errors.confirmPassword}</span>}
        </div>

        {/* Blood Group */}
        <div className="auth__field">
          <label className="auth__label">Blood Group <span className="auth__optional">(Optional)</span></label>
          <div className="auth__blood-group-grid" id="blood-group-select">
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                type="button"
                id={`blood-group-${group.replace('+', 'pos').replace('-', 'neg')}`}
                className={`auth__blood-btn ${formData.bloodGroup === group ? 'auth__blood-btn--active' : ''}`}
                onClick={() => handleBloodGroup(group)}
                aria-pressed={formData.bloodGroup === group}
              >
                {formData.bloodGroup === group && (
                  <svg viewBox="0 0 24 24" className="auth__drop-icon" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                  </svg>
                )}
                {group}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="auth__btn auth__btn--primary auth__btn--full"
          id="register-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account →'}
        </button>
      </form>


      <p className="auth__switch-text">
        Already a member?{' '}
        <button className="auth__switch-link" id="go-to-login" onClick={onSwitch}>
          Log in here
        </button>
      </p>
    </div>
  );
};

// ─── Login Form ───────────────────────────────────────────────────────────────
const LoginForm = ({ onSwitch, onSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');


  const validate = () => {
    const e = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = 'Enter a valid email address.';
    if (!formData.password) e.password = 'Password is required.';
    return e;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    setIsSubmitting(true);
    const res = await login(formData);
    setIsSubmitting(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      setServerError(res.error);
    }
  };

  if (submitted) {
    return (
      <div className="auth__success" id="login-success">
        <div className="auth__success-icon">✅</div>
        <h2>Welcome back!</h2>
        <p>You've successfully logged in to LifeStream.</p>
        <button
          type="button"
          className="auth__btn auth__btn--primary"
          onClick={onSuccess}
        >
          Go to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div className="auth__form-wrapper" id="login-form">
      <h1 className="auth__title">Welcome Back</h1>
      <p className="auth__subtitle">Log in to your LifeStream account.</p>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="auth__server-error">{serverError}</div>}
        <div className={`auth__field ${errors.email ? 'auth__field--error' : ''}`}>

          <label htmlFor="login-email" className="auth__label">Email Address</label>
          <div className="auth__input-wrap">
            <svg className="auth__input-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <input
              id="login-email"
              name="email"
              type="email"
              className="auth__input"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {errors.email && <span className="auth__error">{errors.email}</span>}
        </div>

        <div className={`auth__field ${errors.password ? 'auth__field--error' : ''}`}>
          <label htmlFor="login-password" className="auth__label">
            Password
            <Link to="/forgot-password" className="auth__forgot-link" id="forgot-password-btn">
              Forgot password?
            </Link>
          </label>
          <div className="auth__input-wrap">
            <svg className="auth__input-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="auth__input"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth__toggle-pw"
              id="login-toggle-pw"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.password && <span className="auth__error">{errors.password}</span>}
        </div>

        <button
          type="submit"
          className="auth__btn auth__btn--primary auth__btn--full"
          id="login-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging In...' : 'Log In →'}
        </button>
      </form>


      <p className="auth__switch-text">
        Don't have an account?{' '}
        <button className="auth__switch-link" id="go-to-register" onClick={onSwitch}>
          Register here
        </button>
      </p>
    </div>
  );
};

// ─── Main Auth Page ───────────────────────────────────────────────────────────
const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode);
  usePageTitle(mode === 'login' ? 'Login' : 'Create Account');

  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/dashboard';

  const goHome = () => navigate('/');
  const onSuccess = () => navigate(safeRedirect, { replace: true });

  return (
    <div className="auth" id="auth-page">
      {/* Left Panel */}
      <div className="auth__left">
        {/* Logo + Back */}
        <div className="auth__top-bar">
          <button
            className="auth__back-btn"
            id="auth-back-btn"
            onClick={goHome}
            aria-label="Back to home"
          >
            <svg viewBox="0 0 24 24" className="auth__back-icon" aria-hidden="true">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back
          </button>
          <button
            type="button"
            className="auth__brand"
            id="auth-brand"
            onClick={goHome}
            aria-label="Go to home"
          >
            <span className="auth__brand-icon-wrap" aria-hidden="true">
              <FontAwesomeIcon icon={faDroplet} className="auth__brand-icon" />
            </span>
            Life<span>Stream</span>
          </button>
        </div>

        {/* Hero Image */}
        <div className="auth__hero-img-wrap">
          <img src={authHero} alt="LifeStream hero – be a safe hero" className="auth__hero-img" />
        </div>

        {/* Text overlay */}
        <div className="auth__left-text">
          <h2 className="auth__hero-title">Every drop counts.</h2>
          <p className="auth__hero-subtitle">
            Join the network of life savers. Your contribution directly impacts patients in urgent need in your local community.
          </p>
          <div className="auth__hero-badge">
            <span>BE A SAFE HERO</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth__right">
        {mode === 'register' ? (
          <RegisterForm onSwitch={() => setMode('login')} onSuccess={onSuccess} />
        ) : (
          <LoginForm onSwitch={() => setMode('register')} onSuccess={onSuccess} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
