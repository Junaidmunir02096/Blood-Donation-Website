import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import './styles/global.scss';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const activePage = (() => {
    if (pathname === '/search') return 'search';
    if (pathname === '/request') return 'request';
    if (pathname === '/about') return 'about';
    return 'landing';
  })();

  const hideNavFooter = ['/auth', '/donate', '/dashboard'].includes(pathname);

  const routes = (
    <AppRoutes
      onBack={() => navigate('/')}
      onLoginSuccess={() => navigate('/dashboard')}
      onDonateClick={() => navigate('/donate')}
    />
  );

  if (hideNavFooter) {
    return routes;
  }

  return (
    <>
      <Navbar
        activePage={activePage}
        onLoginClick={() => navigate('/auth')}
        onDonateClick={() => navigate('/donate')}
        onSearchClick={() => navigate('/search')}
        onRequestClick={() => navigate('/request')}
        onHomeClick={() => navigate('/')}
        onAboutClick={() => navigate('/about')}
      />
      <main id="main-content">
        {routes}
      </main>
      <Footer />
    </>
  );
}

export default App;

