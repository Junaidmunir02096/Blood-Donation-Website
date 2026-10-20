/**
 * src/data/profile.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mock data for the My Profile screen — achievement badges and notification
 * preference seeds. Donation history comes from the local data store.
 * Consumed by: MyProfile.jsx
 * Consumed through: src/services/profile.service.js.
 */

import {
  faLeaf,
  faHeart,
  faFire,
  faStar,
  faAward,
  faBell,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';

// ── Achievement Badges ────────────────────────────────────────────────────────
export const achievements = [
  { id: 'ach-1', label: 'Life Saver',    icon: faHeart, earned: true,  desc: '10+ donations'  },
  { id: 'ach-2', label: 'Streak Master', icon: faFire,  earned: true,  desc: '5 consecutive'  },
  { id: 'ach-3', label: 'Gold Donor',    icon: faStar,  earned: true,  desc: 'Top 10% donor'  },
  { id: 'ach-4', label: 'Hero Badge',    icon: faAward, earned: false, desc: '20 donations'   },
];

// ── Notification Preferences ──────────────────────────────────────────────────
export const notifPrefs = [
  { id: 'notif-urgent', label: 'Urgent Blood Requests',  desc: 'Critical alerts near you',         icon: faBell,          default: true  },
  { id: 'notif-appt',   label: 'Appointment Reminders',  desc: '24h before your next donation',    icon: faCalendarCheck, default: true  },
  { id: 'notif-news',   label: 'Community Updates',      desc: 'Blood drive events & news',        icon: faLeaf,          default: false },
];
