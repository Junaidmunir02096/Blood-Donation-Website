import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Stats from './components/Stats/Stats';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Footer from './components/Footer/Footer';
import AuthPage from './pages/Auth/AuthPage';
import SearchBloodPage from './pages/SearchBlood/SearchBloodPage';
import DonorRegistrationPage from './pages/DonorRegistration/DonorRegistrationPage';
import AboutPage from './pages/About/AboutPage';
import './styles/global.scss';

function App() {
  // 'landing' | 'auth' | 'search' | 'donate' | 'about'
  const [page, setPage] = useState('landing');

  // Auth page — full screen, no Navbar/Footer
  if (page === 'auth') {
    return <AuthPage onBack={() => setPage('landing')} />;
  }

  // Donor registration — full screen, no Navbar/Footer
  if (page === 'donate') {
    return <DonorRegistrationPage onBack={() => setPage('landing')} />;
  }

  // Pages that share Navbar + Footer
  return (
    <>
      <Navbar
        activePage={page}
        onLoginClick={() => setPage('auth')}
        onDonateClick={() => setPage('donate')}
        onSearchClick={() => setPage('search')}
        onHomeClick={() => setPage('landing')}
        onAboutClick={() => setPage('about')}
      />
      <main id="main-content">
        {page === 'search' && <SearchBloodPage />}
        {page === 'about' && <AboutPage onDonateClick={() => setPage('donate')} />}
        {page === 'landing' && (
          <>
            <Hero onDonateClick={() => setPage('auth')} />
            <Stats />
            <HowItWorks />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;

