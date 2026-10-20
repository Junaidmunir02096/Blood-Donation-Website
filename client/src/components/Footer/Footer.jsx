import { Link } from 'react-router-dom';
import './Footer.scss';

const footerLinks = [
  { id: 'link-eligibility',   label: 'Eligibility',        to: '/eligibility' },
  { id: 'link-compatibility', label: 'Compatibility',      to: '/compatibility' },
  { id: 'link-faq',           label: 'FAQ',                to: '/faq' },
  { id: 'link-contact',       label: 'Contact',            to: '/contact' },
  { id: 'link-privacy',       label: 'Privacy Policy',     to: '/privacy' },
  { id: 'link-terms',         label: 'Terms of Service',   to: '/terms' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer" role="contentinfo">
      <div className="container">
        <div className="footer__main">
          <div className="footer__brand">
            <Link to="/" className="footer__logo" id="footer-logo" aria-label="LifeStream home">
              Life<span>Stream</span>
            </Link>
            <p className="footer__tagline">
              Connecting donors with patients across Pakistan.
            </p>
          </div>

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
            © {year} LifeStream Blood Network (FYP demo). Every drop counts.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
