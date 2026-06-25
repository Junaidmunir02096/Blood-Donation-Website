import { useEffect, useRef, useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import './Stats.scss';

/* ── Animated counter hook ─────────────────────────────────── */
const useCountUp = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const startVal = 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + eased * (target - startVal)));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, start]);

  return count;
};

/* ── Individual stat card ──────────────────────────────────── */
const StatCard = ({ stat, inView }) => {
  const count = useCountUp(stat.rawNumber, 1800, inView);

  const displayValue = () => {
    if (stat.isDecimal) {
      return (count / 10).toFixed(1) + stat.suffix;
    }
    return count.toLocaleString() + stat.suffix;
  };

  return (
    <div
      id={stat.id}
      className={`stats__card${stat.featured ? ' stats__card--featured' : ''}`}
      role="listitem"
      aria-label={`${displayValue()} ${stat.label}`}
    >
      <div className="stats__icon">{stat.icon}</div>
      <div className="stats__number">{displayValue()}</div>
      <div className="stats__label">{stat.label}</div>
    </div>
  );
};

/* ── Main Stats section ────────────────────────────────────── */
const Stats = () => {
  const { getStats } = useAppData();
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  const stats = getStats();

  /* Trigger animation when section scrolls into view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const statsData = [
    {
      id: 'stat-donors',
      rawNumber: stats.totalDonors,
      suffix: '+',
      label: 'Donors Registered',
      featured: false,
      isDecimal: false,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 'stat-lives',
      rawNumber: stats.totalDonations,
      suffix: '+',
      label: 'Lives Saved',
      featured: true,
      isDecimal: false,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      id: 'stat-requests',
      rawNumber: stats.activeRequests,
      suffix: '',
      label: 'Active Requests',
      featured: false,
      isDecimal: false,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'stat-litres',
      // Multiply by 10 so useCountUp can count to an integer, then divide back
      rawNumber: Math.round(stats.totalLitres * 10),
      suffix: ' L',
      label: 'Blood Donated',
      featured: false,
      isDecimal: true,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="stats" id="stats" aria-label="Statistics" ref={sectionRef}>
      <div className="container">
        <div className="stats__grid" role="list">
          {statsData.map((stat) => (
            <StatCard key={stat.id} stat={stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
