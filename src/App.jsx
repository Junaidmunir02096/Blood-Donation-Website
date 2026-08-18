import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import usePageTitle from './hooks/usePageTitle';
import './styles/global.scss';

const PAGE_TITLES = {
  '/':              'LifeStream — Blood Donation Network',
  '/search':        'Find a Donor',
  '/request':       'Request Blood',
  '/about':         'About Us',
  '/terms':         'Terms of Service',
  '/privacy':       'Privacy Policy',
  '/contact':       'Contact Us',
  '/faq':           'FAQ',
  '/eligibility':   'Donation Eligibility',
  '/compatibility': 'Blood Compatibility',
};

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

  usePageTitle(PAGE_TITLES[pathname] ?? null);

  const hideNavFooter = HIDE_NAV_PREFIXES.some((prefix) => pathname.startsWith(prefix));

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
