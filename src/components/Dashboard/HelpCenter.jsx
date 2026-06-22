import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDroplet,
  faBolt,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faSearch,
  faHeadset,
  faEnvelope,
  faCircleCheck,
  faHeartPulse,
  faUserShield,
  faBookOpen,
  faArrowRight,
  faPhone,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import './HelpCenter.scss';
import { HELP_CATEGORIES, FAQS } from '../../data/helpcenter.data';

/* ── iconKey → FontAwesome icon resolver ─────────────────────────────── */
const CATEGORY_ICONS = {
  heartPulse:  faHeartPulse,
  userShield:  faUserShield,
  droplet:     faDroplet,
  circleCheck: faCircleCheck,
  bookOpen:    faBookOpen,
  bolt:        faBolt,
};

/* ── FAQ Item ─────────────────────────────────────────── */
const FaqItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`hc-faq__item${open ? ' hc-faq__item--open' : ''}`} id={item.id}>
      <button
        className="hc-faq__trigger"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        id={`${item.id}-btn`}
      >
        <span className="hc-faq__question">{item.question}</span>
        <span className="hc-faq__chevron" aria-hidden="true">
          <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
        </span>
      </button>
      {open && (
        <div className="hc-faq__answer" role="region" aria-labelledby={`${item.id}-btn`}>
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
};

/* ── Main Component ───────────────────────────────────── */
const HelpCenter = () => {
  const [search, setSearch] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleEmailSupport = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <section className="help-center" aria-labelledby="hc-title">

      {/* ── Page Header ── */}
      <div className="hc-header">
        <div className="hc-header__icon-wrap" aria-hidden="true">
          <FontAwesomeIcon icon={faHeadset} />
        </div>
        <div>
          <h1 className="hc-header__title" id="hc-title">Help Center</h1>
          <p className="hc-header__subtitle">
            Find answers, guides, and support for your blood donation journey.
          </p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="hc-search" role="search">
        <FontAwesomeIcon icon={faSearch} className="hc-search__icon" aria-hidden="true" />
        <input
          type="search"
          className="hc-search__input"
          placeholder="Search help articles, FAQs, topics…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search help center"
          id="hc-search-input"
        />
        {search && (
          <span className="hc-search__count">
            {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Category Cards ── */}
      {!search && (
        <div className="hc-categories" role="region" aria-label="Help categories">
          {HELP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`hc-cat-card hc-cat-card--${cat.color}`}
              id={`hc-cat-${cat.id}`}
              aria-label={`Browse ${cat.title}`}
            >
              <div className="hc-cat-card__top">
                <span className="hc-cat-card__icon" aria-hidden="true">
                  <FontAwesomeIcon icon={CATEGORY_ICONS[cat.iconKey]} />
                </span>
                <FontAwesomeIcon icon={faChevronRight} className="hc-cat-card__arrow" aria-hidden="true" />
              </div>
              <h3 className="hc-cat-card__title">{cat.title}</h3>
              <p className="hc-cat-card__desc">{cat.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* ── FAQ Section ── */}
      <div className="hc-faq" role="region" aria-label="Frequently asked questions">
        <div className="hc-faq__header">
          <h2 className="hc-faq__title">
            {search ? `Results for "${search}"` : 'Frequently Asked Questions'}
          </h2>
          {!search && (
            <p className="hc-faq__subtitle">
              Quick answers to common questions from our donor community.
            </p>
          )}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="hc-faq__empty">
            <FontAwesomeIcon icon={faSearch} className="hc-faq__empty-icon" aria-hidden="true" />
            <p>No results found for <strong>"{search}"</strong></p>
            <p className="hc-faq__empty-hint">Try a different keyword or browse the categories above.</p>
          </div>
        ) : (
          <div className="hc-faq__list">
            {filteredFaqs.map((faq) => (
              <FaqItem key={faq.id} item={faq} />
            ))}
          </div>
        )}
      </div>

      {/* ── Still Need Help Banner ── */}
      <div className="hc-support-banner" role="region" aria-label="Contact support">
        <div className="hc-support-banner__left">
          <div className="hc-support-banner__icon-wrap" aria-hidden="true">
            <FontAwesomeIcon icon={faHeadset} />
          </div>
          <div>
            <h2 className="hc-support-banner__title">Still need help?</h2>
            <p className="hc-support-banner__desc">
              Our support team is available 24/7 to assist with urgent medical
              queries or technical issues.
            </p>
            <div className="hc-support-banner__meta">
              <span>
                <FontAwesomeIcon icon={faClock} aria-hidden="true" />
                Avg. response: &lt; 2 min
              </span>
              <span>
                <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
                +1 (800) LIFE-STREAM
              </span>
            </div>
          </div>
        </div>

        <div className="hc-support-banner__actions">
          {/* Live Chat */}
          <button
            className="hc-support-btn hc-support-btn--chat"
            type="button"
            id="hc-live-chat-btn"
            onClick={() => setChatOpen(true)}
          >
            <span className="hc-support-btn__icon" aria-hidden="true">
              <FontAwesomeIcon icon={faHeadset} />
              <span className="hc-support-btn__pulse" aria-hidden="true" />
            </span>
            <span className="hc-support-btn__text">
              <span className="hc-support-btn__label">Live Chat</span>
              <span className="hc-support-btn__sub">Online now</span>
            </span>
            <FontAwesomeIcon icon={faArrowRight} className="hc-support-btn__arrow" aria-hidden="true" />
          </button>

          {/* Email Support */}
          <button
            className={`hc-support-btn hc-support-btn--email${emailSent ? ' hc-support-btn--sent' : ''}`}
            type="button"
            id="hc-email-support-btn"
            onClick={handleEmailSupport}
          >
            <span className="hc-support-btn__icon" aria-hidden="true">
              <FontAwesomeIcon icon={emailSent ? faCircleCheck : faEnvelope} />
            </span>
            <span className="hc-support-btn__text">
              <span className="hc-support-btn__label">
                {emailSent ? 'Request Sent!' : 'Email Support'}
              </span>
              <span className="hc-support-btn__sub">
                {emailSent ? 'We\'ll reply shortly' : 'Reply within 1 hour'}
              </span>
            </span>
            {!emailSent && (
              <FontAwesomeIcon icon={faArrowRight} className="hc-support-btn__arrow" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ── Live Chat Modal ── */}
      {chatOpen && (
        <div
          className="hc-chat-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Live chat support"
          onClick={(e) => e.target === e.currentTarget && setChatOpen(false)}
        >
          <div className="hc-chat-modal">
            <div className="hc-chat-modal__header">
              <div className="hc-chat-modal__agent">
                <div className="hc-chat-modal__avatar" aria-hidden="true">
                  <FontAwesomeIcon icon={faHeadset} />
                  <span className="hc-chat-modal__online-dot" aria-hidden="true" />
                </div>
                <div>
                  <p className="hc-chat-modal__agent-name">LifeStream Support</p>
                  <p className="hc-chat-modal__agent-status">
                    <span className="hc-chat-modal__status-dot" aria-hidden="true" />
                    Online · Typically replies instantly
                  </p>
                </div>
              </div>
              <button
                className="hc-chat-modal__close"
                type="button"
                aria-label="Close chat"
                id="hc-chat-close"
                onClick={() => setChatOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="hc-chat-modal__body">
              <div className="hc-chat-modal__message hc-chat-modal__message--them">
                <p>👋 Hi there! I'm here to help you with any questions about blood donation, your account, or urgent requests.</p>
                <span className="hc-chat-modal__time">Just now</span>
              </div>
              <div className="hc-chat-modal__message hc-chat-modal__message--them">
                <p>What can I help you with today?</p>
                <span className="hc-chat-modal__time">Just now</span>
              </div>
            </div>

            <div className="hc-chat-modal__input-row">
              <input
                type="text"
                className="hc-chat-modal__input"
                placeholder="Type your message…"
                aria-label="Chat message"
                id="hc-chat-input"
                autoFocus
              />
              <button
                className="hc-chat-modal__send"
                type="button"
                aria-label="Send message"
                id="hc-chat-send"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default HelpCenter;
