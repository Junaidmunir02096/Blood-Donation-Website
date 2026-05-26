/**
 * src/data/donors.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mock data for the Search Blood page — list of available donors.
 * Consumed by: SearchBloodPage.jsx (via donors.service.js)
 */

export const donorsData = [
  { id: 1,  name: 'Marcus Chen',      bloodGroup: 'O+',  city: 'Seattle, WA',     miles: 2.4,  lastDonated: '4 months ago',  status: 'verified', avatar: 'MC' },
  { id: 2,  name: 'Sarah Jenkins',    bloodGroup: 'O+',  city: 'Bellevue, WA',    miles: 5.1,  lastDonated: '8 months ago',  status: 'verified', avatar: 'SJ' },
  { id: 3,  name: 'David Rodriguez',  bloodGroup: 'O+',  city: 'Tacoma, WA',      miles: 12.0, lastDonated: '1 year ago',    status: 'pending',  avatar: 'DR' },
  { id: 4,  name: 'Amina Hassan',     bloodGroup: 'A+',  city: 'Renton, WA',      miles: 7.3,  lastDonated: '2 months ago',  status: 'verified', avatar: 'AH' },
  { id: 5,  name: 'Liu Wei',          bloodGroup: 'B+',  city: 'Kirkland, WA',    miles: 9.8,  lastDonated: '6 months ago',  status: 'verified', avatar: 'LW' },
  { id: 6,  name: 'Emma Thompson',    bloodGroup: 'AB+', city: 'Redmond, WA',     miles: 11.2, lastDonated: '3 months ago',  status: 'verified', avatar: 'ET' },
  { id: 7,  name: 'James Okafor',     bloodGroup: 'O-',  city: 'Everett, WA',     miles: 18.6, lastDonated: '5 months ago',  status: 'verified', avatar: 'JO' },
  { id: 8,  name: 'Priya Sharma',     bloodGroup: 'A-',  city: 'Lynnwood, WA',    miles: 14.4, lastDonated: '10 months ago', status: 'pending',  avatar: 'PS' },
  { id: 9,  name: 'Carlos Mendez',    bloodGroup: 'B-',  city: 'Auburn, WA',      miles: 22.1, lastDonated: '7 months ago',  status: 'verified', avatar: 'CM' },
  { id: 10, name: 'Fatima Al-Rashid', bloodGroup: 'AB-', city: 'Kent, WA',        miles: 16.5, lastDonated: '9 months ago',  status: 'verified', avatar: 'FA' },
  { id: 11, name: 'Tyler Brooks',     bloodGroup: 'O+',  city: 'Federal Way, WA', miles: 19.3, lastDonated: '2 years ago',   status: 'pending',  avatar: 'TB' },
  { id: 12, name: 'Mei-Ling Zhou',    bloodGroup: 'A+',  city: 'Bothell, WA',     miles: 13.7, lastDonated: '1 month ago',   status: 'verified', avatar: 'MZ' },
];
