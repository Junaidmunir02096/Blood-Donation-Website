import './Footer.scss';

const footerLinks = [
  { id: 'link-privacy', label: 'Privacy Policy', href: '#' },
  { id: 'link-terms', label: 'Terms of Service', href: '#' },
  { id: 'link-donor', label: 'Donor Guidelines', href: '#' },
  { id: 'link-contact', label: 'Contact Medical Team', href: '#' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer" role="contentinfo">
      <div className="container">
        <div className="footer__main">
          {/* Brand */}
          <div className="footer__brand">
            <a href="#" className="footer__logo" id="footer-logo" aria-label="LifeStream home">
              Life<span>Stream</span>
            </a>
            <p className="footer__tagline">
              Connecting donors with those in critical need.
            </p>
          </div>

          {/* Links */}
          <nav className="footer__links" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <a
                key={link.id}
                id={link.id}
                href={link.href}
                className="footer__link"
              >
                {link.label}
              </a>
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
