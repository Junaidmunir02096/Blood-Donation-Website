/**
 * src/data/donors.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mock data for the Search Blood page — list of available donors.
 * Consumed by: SearchBloodPage.jsx (via donors.service.js)
 */

export const donorsData = [
  { id: 1,  name: 'Marcus Chen',      bloodGroup: 'O+',  city: 'Seattle, WA',     miles: 2.4,  lastDonated: '4 months ago',  status: 'verified', avatar: 'MC', phone: '+1 (206) 555-0101', canContact: true  },
  { id: 2,  name: 'Sarah Jenkins',    bloodGroup: 'O+',  city: 'Bellevue, WA',    miles: 5.1,  lastDonated: '8 months ago',  status: 'verified', avatar: 'SJ', phone: '+1 (425) 555-0182', canContact: true  },
  { id: 3,  name: 'David Rodriguez',  bloodGroup: 'O+',  city: 'Tacoma, WA',      miles: 12.0, lastDonated: '1 year ago',    status: 'pending',  avatar: 'DR', phone: null,               canContact: false },
  { id: 4,  name: 'Amina Hassan',     bloodGroup: 'A+',  city: 'Renton, WA',      miles: 7.3,  lastDonated: '2 months ago',  status: 'verified', avatar: 'AH', phone: '+1 (425) 555-0211', canContact: true  },
  { id: 5,  name: 'Liu Wei',          bloodGroup: 'B+',  city: 'Kirkland, WA',    miles: 9.8,  lastDonated: '6 months ago',  status: 'verified', avatar: 'LW', phone: '+1 (425) 555-0177', canContact: true  },
  { id: 6,  name: 'Emma Thompson',    bloodGroup: 'AB+', city: 'Redmond, WA',     miles: 11.2, lastDonated: '3 months ago',  status: 'verified', avatar: 'ET', phone: '+1 (425) 555-0134', canContact: true  },
  { id: 7,  name: 'James Okafor',     bloodGroup: 'O-',  city: 'Everett, WA',     miles: 18.6, lastDonated: '5 months ago',  status: 'verified', avatar: 'JO', phone: '+1 (425) 555-0198', canContact: true  },
  { id: 8,  name: 'Priya Sharma',     bloodGroup: 'A-',  city: 'Lynnwood, WA',    miles: 14.4, lastDonated: '10 months ago', status: 'pending',  avatar: 'PS', phone: null,               canContact: false },
  { id: 9,  name: 'Carlos Mendez',    bloodGroup: 'B-',  city: 'Auburn, WA',      miles: 22.1, lastDonated: '7 months ago',  status: 'verified', avatar: 'CM', phone: '+1 (253) 555-0163', canContact: true  },
  { id: 10, name: 'Fatima Al-Rashid', bloodGroup: 'AB-', city: 'Kent, WA',        miles: 16.5, lastDonated: '9 months ago',  status: 'verified', avatar: 'FA', phone: '+1 (253) 555-0145', canContact: true  },
  { id: 11, name: 'Tyler Brooks',     bloodGroup: 'O+',  city: 'Federal Way, WA', miles: 19.3, lastDonated: '2 years ago',   status: 'pending',  avatar: 'TB', phone: null,               canContact: false },
  { id: 12, name: 'Mei-Ling Zhou',    bloodGroup: 'A+',  city: 'Bothell, WA',     miles: 13.7, lastDonated: '1 month ago',   status: 'verified', avatar: 'MZ', phone: '+1 (425) 555-0122', canContact: true  },
];
