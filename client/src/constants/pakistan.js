export const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Multan',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
];

export const PK_PHONE_REGEX = /^(\+92|0)?3\d{2}[-\s]?\d{7}$/;

export const isValidPakistanPhone = (value) => PK_PHONE_REGEX.test((value || '').trim());

export const formatKm = (km) => {
  if (km == null || Number.isNaN(Number(km))) return 'Nearby';
  const n = Number(km);
  return `${n.toFixed(1)} km away`;
};

export const SUPPORT_PHONE = '+92 42 111 000 111';
export const SUPPORT_EMAIL = 'support@lifestream.pk';
export const LEGAL_ADDRESS = 'LifeStream (FYP Demo), Gulberg III, Lahore, Pakistan';
export const SUPPORT_HOURS = 'Monday–Saturday, 9:00 AM–6:00 PM PKT';
