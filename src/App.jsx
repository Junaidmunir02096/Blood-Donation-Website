import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import usePageTitle from './hooks/usePageTitle';
import './styles/global.scss';

/* ── Page title map for nav-visible pages ── */
const PAGE_TITLES = {
  '/':        'LifeStream — Blood Donation Network',
  '/search':  'Find a Donor',
  '/request': 'Request Blood',
  '/about':   'About Us',
  '/terms':   'Terms of Service',
  '/privacy': 'Privacy Policy',
};

/* ── Routes that should hide the global Navbar + Footer ── */
const HIDE_NAV_PREFIXES = [
  '/auth',
  '/donate',
  '/dashboard',
  '/forgot-password',
  '/reset-password',
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  // Page title (only for non-fullscreen pages; others set their own)
  usePageTitle(PAGE_TITLES[pathname] ?? null);

  const activePage = (() => {
    if (pathname === '/search')  return 'search';
    if (pathname === '/request') return 'request';
    if (pathname === '/about')   return 'about';
    return 'landing';
  })();

  // Hide Navbar + Footer for fullscreen/app pages
  const hideNavFooter = HIDE_NAV_PREFIXES.some((prefix) => pathname.startsWith(prefix));

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
