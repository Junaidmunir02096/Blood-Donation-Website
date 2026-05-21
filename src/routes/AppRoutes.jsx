import React from 'react';
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
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={<AuthPage onBack={onBack} onLoginSuccess={onLoginSuccess} />}
      />
      <Route path="/donate" element={<DonorRegistrationPage onBack={onBack} />} />
      <Route path="/search" element={<SearchBloodPage />} />
      <Route path="/request" element={<RequestPage />} />
      <Route path="/about" element={<AboutPage onDonateClick={onDonateClick} />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;
