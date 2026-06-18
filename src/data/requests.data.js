//  Mock data for Active Requests — blood requests list, filter tabs, and

import {
  faCircleCheck,
  faCircleXmark,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

export const requests = [
  {
    id: 'req-1',
    blood: 'O+',
    hospital: 'City General Hospital',
    patient: 'Sarah Jenkins',
    neededBy: 'Oct 24, 2024',
    units: 2,
    status: 'Pending',
  },
  {
    id: 'req-2',
    blood: 'A-',
    hospital: 'Mercy Medical Center',
    patient: 'Michael Chang',
    neededBy: 'Oct 20, 2024',
    units: 1,
    status: 'Approved',
  },
  {
    id: 'req-3',
    blood: 'AB+',
    hospital: "St. Jude's Children's",
    patient: 'Emily Davis',
    neededBy: 'Oct 15, 2024',
    units: 3,
    status: 'Rejected',
  },
  {
    id: 'req-4',
    blood: 'B+',
    hospital: 'Metro Regional Blood Center',
    patient: 'Liam Torres',
    neededBy: 'Nov 02, 2024',
    units: 2,
    status: 'Pending',
  },
  {
    id: 'req-5',
    blood: 'O-',
    hospital: 'Sunrise Medical Hospital',
    patient: 'Aisha Patel',
    neededBy: 'Oct 30, 2024',
    units: 1,
    status: 'Approved',
  },
];

/** Filter tab labels */
export const filters = ['All', 'Pending', 'Approved', 'Rejected'];

/**
 * Maps request status → display label, icon, BEM modifier, and action button text.
 * Icons imported here to keep the data file self-contained.
 */
export const statusConfig = {
  Pending: {
    label: 'Pending Review',
    icon: faClock,
    modifier: 'pending',
    action: 'View Details',
  },
  Approved: {
    label: 'Approved',
    icon: faCircleCheck,
    modifier: 'approved',
    action: 'Contact Donor',
  },
  Rejected: {
    label: 'Rejected',
    icon: faCircleXmark,
    modifier: 'rejected',
    action: 'View Reason',
  },
};
