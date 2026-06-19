import { Route, Routes } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Stats from '../components/Stats/Stats';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import AuthPage from '../pages/Auth/AuthPage';
import SearchBloodPage from '../pages/SearchBlood/SearchBloodPage';
import RequestPage from '../pages/Request/RequestPage';
import DonorRegistrationPage from '../pages/DonorRegistration/DonorRegistrationPage';
import AboutPage from '../pages/About/AboutPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';

// ── Priority 2: New Pages ──────────────────────────────────────────────────────
import ForgotPasswordPage from '../pages/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage  from '../pages/ResetPassword/ResetPasswordPage';
import NotFoundPage       from '../pages/NotFound/NotFoundPage';
import TermsPage          from '../pages/Legal/TermsPage';
import PrivacyPage        from '../pages/Legal/PrivacyPage';
import DonorProfilePage   from '../pages/DonorProfile/DonorProfilePage';


const LandingPage = () => (
  <>
    <Hero />
    <Stats />
    <HowItWorks />
  </>
);

const AppRoutes = ({ onBack, onLoginSuccess, onDonateClick }) => {
  return (
    <Routes>
      {/* ── Public ────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={<AuthPage onBack={onBack} onLoginSuccess={onLoginSuccess} />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />}  />
      <Route path="/search"  element={<SearchBloodPage />} />
      <Route path="/request" element={<RequestPage />} />
      <Route path="/about"   element={<AboutPage onDonateClick={onDonateClick} />} />
      <Route path="/donor/:id" element={<DonorProfilePage />} />
      <Route path="/terms"   element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* ── Protected ─────────────────────────────── */}
      <Route
        path="/donate"
        element={
          <PrivateRoute>
            <DonorRegistrationPage onBack={onBack} />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* ── 404 Catch-all ─────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
