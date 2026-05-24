import { useState, useMemo } from 'react';
import './SearchBloodPage.scss';

// ─── Mock Donor Data (replace with API calls later) ──────────────────────────
const ALL_DONORS = [
  { id: 1,  name: 'Marcus Chen',      bloodGroup: 'O+',  city: 'Seattle, WA',    miles: 2.4,  lastDonated: '4 months ago',  status: 'verified',  avatar: 'MC' },
  { id: 2,  name: 'Sarah Jenkins',    bloodGroup: 'O+',  city: 'Bellevue, WA',   miles: 5.1,  lastDonated: '8 months ago',  status: 'verified',  avatar: 'SJ' },
  { id: 3,  name: 'David Rodriguez',  bloodGroup: 'O+',  city: 'Tacoma, WA',     miles: 12.0, lastDonated: '1 year ago',    status: 'pending',   avatar: 'DR' },
  { id: 4,  name: 'Amina Hassan',     bloodGroup: 'A+',  city: 'Renton, WA',     miles: 7.3,  lastDonated: '2 months ago',  status: 'verified',  avatar: 'AH' },
  { id: 5,  name: 'Liu Wei',          bloodGroup: 'B+',  city: 'Kirkland, WA',   miles: 9.8,  lastDonated: '6 months ago',  status: 'verified',  avatar: 'LW' },
  { id: 6,  name: 'Emma Thompson',    bloodGroup: 'AB+', city: 'Redmond, WA',    miles: 11.2, lastDonated: '3 months ago',  status: 'verified',  avatar: 'ET' },
  { id: 7,  name: 'James Okafor',     bloodGroup: 'O-',  city: 'Everett, WA',    miles: 18.6, lastDonated: '5 months ago',  status: 'verified',  avatar: 'JO' },
  { id: 8,  name: 'Priya Sharma',     bloodGroup: 'A-',  city: 'Lynnwood, WA',   miles: 14.4, lastDonated: '10 months ago', status: 'pending',   avatar: 'PS' },
  { id: 9,  name: 'Carlos Mendez',    bloodGroup: 'B-',  city: 'Auburn, WA',     miles: 22.1, lastDonated: '7 months ago',  status: 'verified',  avatar: 'CM' },
  { id: 10, name: 'Fatima Al-Rashid', bloodGroup: 'AB-', city: 'Kent, WA',       miles: 16.5, lastDonated: '9 months ago',  status: 'verified',  avatar: 'FA' },
  { id: 11, name: 'Tyler Brooks',     bloodGroup: 'O+',  city: 'Federal Way, WA',miles: 19.3, lastDonated: '2 years ago',   status: 'pending',   avatar: 'TB' },
  { id: 12, name: 'Mei-Ling Zhou',    bloodGroup: 'A+',  city: 'Bothell, WA',    miles: 13.7, lastDonated: '1 month ago',   status: 'verified',  avatar: 'MZ' },
];

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const PAGE_SIZE = 6;

// Avatar color palette based on initials
const AVATAR_COLORS = [
  '#c0392b', '#2980b9', '#27ae60', '#8e44ad',
  '#e67e22', '#16a085', '#d35400', '#2c3e50',
];
const getAvatarColor = (id) => AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];

// ─── Donor Card ───────────────────────────────────────────────────────────────
const DonorCard = ({ donor }) => {
  const isVerified = donor.status === 'verified';

  return (
    <article className="donor-card" id={`donor-card-${donor.id}`} aria-label={`Donor: ${donor.name}`}>
      <div className="donor-card__header">
        {/* Avatar */}
        <div
          className="donor-card__avatar"
          style={{ background: getAvatarColor(donor.id) }}
          aria-hidden="true"
        >
          {donor.avatar}
        </div>

        {/* Info */}
        <div className="donor-card__info">
          <h3 className="donor-card__name">{donor.name}</h3>
          <div className={`donor-card__status ${isVerified ? 'donor-card__status--verified' : 'donor-card__status--pending'}`}>
            <svg viewBox="0 0 24 24" className="donor-card__status-icon" aria-hidden="true">
              {isVerified
                ? <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/>
                : <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              }
            </svg>
            {isVerified ? 'Verified Donor' : 'Pending Verification'}
          </div>
        </div>

        {/* Blood Group Badge */}
        <div className={`donor-card__badge ${isVerified ? 'donor-card__badge--verified' : 'donor-card__badge--pending'}`}>
          {isVerified && (
            <svg viewBox="0 0 24 24" className="donor-card__badge-drop" aria-hidden="true">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          )}
          {donor.bloodGroup}
        </div>
      </div>

      <div className="donor-card__meta">
        {/* Location */}
        <div className="donor-card__meta-row">
          <svg viewBox="0 0 24 24" className="donor-card__meta-icon" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>{donor.city} &bull; <strong>{donor.miles} miles away</strong></span>
        </div>

        {/* Last donated */}
        <div className="donor-card__meta-row">
          <svg viewBox="0 0 24 24" className="donor-card__meta-icon" aria-hidden="true">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L11 14V7h1.5v6.25l4.5 2.67-1.77 1.08z"/>
          </svg>
          <span>Last donated: <strong>{donor.lastDonated}</strong></span>
        </div>
      </div>

      {/* CTA */}
      <button
        className="donor-card__call-btn"
        id={`call-donor-${donor.id}`}
        aria-label={`Call ${donor.name}`}
      >
        <svg viewBox="0 0 24 24" className="donor-card__call-icon" aria-hidden="true">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
        Call Donor
      </button>
    </article>
  );
};

// ─── Main Search Blood Page ───────────────────────────────────────────────────
const SearchBloodPage = () => {
  const [location, setLocation] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'recent'
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filter & sort donors
  const filteredDonors = useMemo(() => {
    let list = ALL_DONORS;

    // Filter by blood group
    if (selectedGroup) {
      list = list.filter((d) => d.bloodGroup === selectedGroup);
    }

    // Filter by location text (case-insensitive city match)
    if (location.trim()) {
      const q = location.toLowerCase();
      list = list.filter((d) => d.city.toLowerCase().includes(q));
    }

    // Sort
    if (sortBy === 'distance') {
      list = [...list].sort((a, b) => a.miles - b.miles);
    } else {
      // sort by most recently donated (simple string heuristic based on order)
      list = [...list].sort((a, b) => a.id - b.id);
    }

    return list;
  }, [location, selectedGroup, sortBy]);

  const visibleDonors = filteredDonors.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDonors.length;

  const handleSortSelect = (value) => {
    setSortBy(value);
    setShowSortMenu(false);
    setVisibleCount(PAGE_SIZE);
  };

  const handleGroupToggle = (group) => {
    setSelectedGroup((prev) => (prev === group ? '' : group));
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="search-page" id="search-blood-page">
      {/* ── Page Hero ─────────────────────────────── */}
      <section className="search-page__hero" aria-labelledby="search-heading">
        <div className="container">
          <h1 className="search-page__title" id="search-heading">
            Find a <span>Donor</span>
          </h1>
          <p className="search-page__subtitle">
            Locate available blood donors in your area instantly. Every drop counts.
          </p>
        </div>
      </section>

      {/* ── Filter Bar ────────────────────────────── */}
      <section className="search-page__filters" aria-label="Filter donors">
        <div className="container">
          <div className="filter-bar">
            {/* Location */}
            <div className="filter-bar__location">
              <label className="filter-bar__label" htmlFor="location-input">Location</label>
              <div className="filter-bar__input-wrap">
                <svg viewBox="0 0 24 24" className="filter-bar__input-icon" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <input
                  id="location-input"
                  type="text"
                  className="filter-bar__input"
                  placeholder="Enter city or zip code"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setVisibleCount(PAGE_SIZE); }}
                  autoComplete="off"
                />
                {location && (
                  <button
                    className="filter-bar__clear"
                    id="clear-location-btn"
                    onClick={() => setLocation('')}
                    aria-label="Clear location"
                  >×</button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="filter-bar__divider" aria-hidden="true" />

            {/* Blood Group */}
            <div className="filter-bar__groups">
              <label className="filter-bar__label">Blood Group</label>
              <div className="filter-bar__group-btns" role="group" aria-label="Select blood group">
                {BLOOD_GROUPS.map((group) => (
                  <button
                    key={group}
                    id={`filter-group-${group.replace('+', 'pos').replace('-', 'neg')}`}
                    className={`filter-bar__group-btn ${selectedGroup === group ? 'filter-bar__group-btn--active' : ''}`}
                    onClick={() => handleGroupToggle(group)}
                    aria-pressed={selectedGroup === group}
                  >
                    {selectedGroup === group && (
                      <svg viewBox="0 0 24 24" className="filter-bar__drop" aria-hidden="true">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                      </svg>
                    )}
                    {group}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results ───────────────────────────────── */}
      <section className="search-page__results" aria-label="Donor results">
        <div className="container">
          {/* Results header */}
          <div className="results-header">
            <h2 className="results-header__count" id="results-count">
              Available Donors
              <span className="results-header__badge">{filteredDonors.length}</span>
            </h2>

            {/* Sort dropdown */}
            <div className="results-header__sort" id="sort-dropdown">
              <button
                className="results-header__sort-btn"
                id="sort-toggle-btn"
                onClick={() => setShowSortMenu((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={showSortMenu}
              >
                <svg viewBox="0 0 24 24" className="results-header__sort-icon" aria-hidden="true">
                  <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
                </svg>
                Sort by {sortBy === 'distance' ? 'Distance' : 'Most Recent'}
                <svg viewBox="0 0 24 24" className={`results-header__chevron ${showSortMenu ? 'results-header__chevron--up' : ''}`} aria-hidden="true">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {showSortMenu && (
                <ul className="results-header__sort-menu" role="listbox" aria-label="Sort options">
                  <li
                    role="option"
                    aria-selected={sortBy === 'distance'}
                    className={`results-header__sort-option ${sortBy === 'distance' ? 'results-header__sort-option--active' : ''}`}
                    onClick={() => handleSortSelect('distance')}
                    id="sort-by-distance"
                  >
                    {sortBy === 'distance' && '✓ '}Sort by Distance
                  </li>
                  <li
                    role="option"
                    aria-selected={sortBy === 'recent'}
                    className={`results-header__sort-option ${sortBy === 'recent' ? 'results-header__sort-option--active' : ''}`}
                    onClick={() => handleSortSelect('recent')}
                    id="sort-by-recent"
                  >
                    {sortBy === 'recent' && '✓ '}Most Recent
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Cards grid */}
          {visibleDonors.length > 0 ? (
            <>
              <div className="donors-grid" id="donors-grid">
                {visibleDonors.map((donor) => (
                  <DonorCard key={donor.id} donor={donor} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="search-page__load-more">
                  <button
                    className="load-more-btn"
                    id="load-more-btn"
                    onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  >
                    Load More Donors
                    <svg viewBox="0 0 24 24" className="load-more-btn__icon" aria-hidden="true">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                </div>
              )}

              {!hasMore && filteredDonors.length > PAGE_SIZE && (
                <p className="search-page__end-msg">You've seen all {filteredDonors.length} donors.</p>
              )}
            </>
          ) : (
            /* Empty state */
            <div className="search-page__empty" id="empty-state">
              <div className="search-page__empty-icon" aria-hidden="true">🩸</div>
              <h3>No donors found</h3>
              <p>Try adjusting your location or blood group filter.</p>
              <button
                className="search-page__reset-btn"
                id="reset-filters-btn"
                onClick={() => { setLocation(''); setSelectedGroup(''); setVisibleCount(PAGE_SIZE); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchBloodPage;
