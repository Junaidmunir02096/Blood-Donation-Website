import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import './styles/global.scss';

const HIDE_NAV_PREFIXES = [
  '/auth',
  '/donate',
  '/dashboard',
  '/forgot-password',
  '/reset-password',
];

function App() {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const hideNavFooter = HIDE_NAV_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const routes = <AppRoutes />;

  if (hideNavFooter) {
    return routes;
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        {routes}
      </main>
      <Footer />
    </>
  );
}

export default App;
