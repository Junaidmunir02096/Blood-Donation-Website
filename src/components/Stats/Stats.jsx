import React from 'react';
import './Stats.scss';

const statsData = [
  {
    id: 'stat-donors',
    number: '24,500+',
    label: 'Donors Registered',
    featured: false,
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M13 10.5s-1 .5-2 .5-2-.5-2-.5" strokeLinecap="round" />
        <path d="M12 14v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'stat-lives',
    number: '73,412',
    label: 'Lives Saved',
    featured: true,
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'stat-requests',
    number: '142',
    label: 'Active Requests',
    featured: false,
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" />
      </svg>
    ),
  },
];

const Stats = () => {
  return (
    <section className="stats" id="stats" aria-label="Statistics">
      <div className="container">
        <div className="stats__grid" role="list">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              id={stat.id}
              className={`stats__card${stat.featured ? ' stats__card--featured' : ''}`}
              role="listitem"
              aria-label={`${stat.number} ${stat.label}`}
            >
              <div className="stats__icon">{stat.icon}</div>
              <div className="stats__number">{stat.number}</div>
              <div className="stats__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
