import { Link } from 'react-router-dom';
import './Footer.scss';

const footerLinks = [
  { id: 'link-privacy',  label: 'Privacy Policy',       to: '/privacy' },
  { id: 'link-terms',    label: 'Terms of Service',      to: '/terms'   },
  { id: 'link-donor',    label: 'Donor Guidelines',      to: '/terms#donor-conduct' },
  { id: 'link-contact',  label: 'Contact Medical Team',  to: '/about'   },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer" role="contentinfo">
      <div className="container">
        <div className="footer__main">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo" id="footer-logo" aria-label="LifeStream home">
              Life<span>Stream</span>
            </Link>
            <p className="footer__tagline">
              Connecting donors with those in critical need.
            </p>
          </div>

          {/* Links */}
          <nav className="footer__links" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.id}
                id={link.id}
                to={link.to}
                className="footer__link"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} LifeStream Blood Network. Every drop counts.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
