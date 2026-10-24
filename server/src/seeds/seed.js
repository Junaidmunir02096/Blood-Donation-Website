import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { loadEnvironment } from '../config/environment.js';
import { Donor } from '../models/Donor.js';
import { BloodRequest } from '../models/BloodRequest.js';

const SEED_DONORS = [
  {
    name: 'Ahmed Khan',
    bloodGroup: 'O+',
    city: 'Lahore',
    phone: '0300-1112233',
    canContact: true,
    status: 'verified',
    avatar: 'AK',
    donationsCount: 14,
    livesSavedCount: 42,
    streak: 5,
    km: 2.4,
    lastDonated: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // ~4 months ago
  },
  {
    name: 'Fatima Noor',
    bloodGroup: 'O+',
    city: 'Lahore',
    phone: '0321-4455667',
    canContact: true,
    status: 'verified',
    avatar: 'FN',
    donationsCount: 8,
    livesSavedCount: 24,
    streak: 3,
    km: 5.1,
    lastDonated: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000), // ~8 months ago
  },
  {
    name: 'Hassan Ali',
    bloodGroup: 'A+',
    city: 'Karachi',
    phone: '0333-7788990',
    canContact: true,
    status: 'verified',
    avatar: 'HA',
    donationsCount: 11,
    livesSavedCount: 33,
    streak: 4,
    km: 7.3,
    lastDonated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // ~2 months ago
  },
  {
    name: 'Ayesha Siddiqui',
    bloodGroup: 'B+',
    city: 'Islamabad',
    phone: '0345-1122334',
    canContact: true,
    status: 'verified',
    avatar: 'AS',
    donationsCount: 6,
    livesSavedCount: 18,
    streak: 2,
    km: 9.8,
    lastDonated: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // ~6 months ago
  },
  {
    name: 'Usman Tariq',
    bloodGroup: 'AB+',
    city: 'Rawalpindi',
    phone: '0312-5566778',
    canContact: true,
    status: 'verified',
    avatar: 'UT',
    donationsCount: 17,
    livesSavedCount: 51,
    streak: 6,
    km: 4.2,
    lastDonated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // ~3 months ago
  },
  {
    name: 'Zainab Malik',
    bloodGroup: 'O-',
    city: 'Faisalabad',
    phone: '0308-9988776',
    canContact: true,
    status: 'verified',
    avatar: 'ZM',
    donationsCount: 9,
    livesSavedCount: 27,
    streak: 3,
    km: 12.6,
    lastDonated: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // ~5 months ago
  },
  {
    name: 'Sana Qureshi',
    bloodGroup: 'AB-',
    city: 'Multan',
    phone: '0301-6677889',
    canContact: true,
    status: 'verified',
    avatar: 'SQ',
    donationsCount: 12,
    livesSavedCount: 36,
    streak: 5,
    km: 14.5,
    lastDonated: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000), // ~9 months ago
  },
];

const SEED_REQUESTS = [
  {
    patient: 'Sara Ahmed',
    hospital: 'Mayo Hospital, Lahore',
    bloodGroup: 'O+',
    units: 2,
    component: 'Whole Blood',
    urgency: 'Critical',
    location: 'Lahore',
    contactNumber: '0300-5550101',
    email: 'help@mayo.lahore.pk',
    note: 'Emergency surgery requiring immediate replacement.',
    status: 'Pending',
    neededBy: new Date(Date.now() + 48 * 60 * 60 * 1000),
  },
  {
    patient: 'Imran Sheikh',
    hospital: 'Aga Khan University Hospital, Karachi',
    bloodGroup: 'A-',
    units: 1,
    component: 'Whole Blood',
    urgency: 'Routine',
    location: 'Karachi',
    contactNumber: '0321-5550182',
    email: 'bloodbank@aku.edu',
    note: 'Scheduled elective procedure next week.',
    status: 'Approved',
    neededBy: new Date(Date.now() + 96 * 60 * 60 * 1000),
  },
  {
    patient: 'Hina Raza',
    hospital: 'PIMS, Islamabad',
    bloodGroup: 'AB+',
    units: 3,
    component: 'Platelets',
    urgency: 'Urgent',
    location: 'Islamabad',
    contactNumber: '0333-5550211',
    email: 'emergency@pims.gov.pk',
    note: 'Pediatric oncology case, platelets required.',
    status: 'Pending',
    neededBy: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    patient: 'Ali Hassan',
    hospital: 'Holy Family Hospital, Rawalpindi',
    bloodGroup: 'B+',
    units: 2,
    component: 'Whole Blood',
    urgency: 'Urgent',
    location: 'Rawalpindi',
    contactNumber: '0345-5550177',
    email: 'contact@hfh.edu.pk',
    note: 'Post-op recovery support.',
    status: 'Pending',
    neededBy: new Date(Date.now() + 36 * 60 * 60 * 1000),
  },
];

export const seedDatabase = async () => {
  const config = loadEnvironment(process.env);
  await connectDatabase(config.mongoUri);

  const donorCount = await Donor.countDocuments();
  if (donorCount === 0) {
    await Donor.insertMany(SEED_DONORS);
    console.log(`[Seed] Inserted ${SEED_DONORS.length} donors.`);
  } else {
    console.log(`[Seed] Donors collection already has ${donorCount} documents. Skipping.`);
  }

  const reqCount = await BloodRequest.countDocuments();
  if (reqCount === 0) {
    await BloodRequest.insertMany(SEED_REQUESTS);
    console.log(`[Seed] Inserted ${SEED_REQUESTS.length} blood requests.`);
  } else {
    console.log(`[Seed] BloodRequests collection already has ${reqCount} documents. Skipping.`);
  }

  await disconnectDatabase();
};

if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
