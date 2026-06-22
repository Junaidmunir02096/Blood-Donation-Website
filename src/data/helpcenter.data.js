/**
 * src/data/helpcenter.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Static content for the Help Center dashboard section.
 * Moved out of HelpCenter.jsx to keep component files logic-only.
 *
 * Icon references use FontAwesome icon name strings to keep data files
 * free of library imports. The component resolves them to FA icon objects.
 */

// ── Help Category Cards ───────────────────────────────────────────────────────
export const HELP_CATEGORIES = [
  {
    id: 'post-donation',
    iconKey: 'heartPulse',
    title: 'Post-Donation Care',
    desc: 'How to stay hydrated and energized after your heroics.',
    color: 'red',
  },
  {
    id: 'account-privacy',
    iconKey: 'userShield',
    title: 'Account & Privacy',
    desc: 'Managing your data and clinical records securely.',
    color: 'blue',
  },
  {
    id: 'blood-requests',
    iconKey: 'droplet',
    title: 'Blood Requests',
    desc: 'How to initiate and manage urgent blood requests.',
    color: 'rose',
  },
  {
    id: 'eligibility',
    iconKey: 'circleCheck',
    title: 'Eligibility & Screening',
    desc: 'Who can donate and what the screening process involves.',
    color: 'green',
  },
  {
    id: 'donation-process',
    iconKey: 'bookOpen',
    title: 'Donation Process',
    desc: 'Step-by-step guide through your entire donation journey.',
    color: 'amber',
  },
  {
    id: 'emergency',
    iconKey: 'bolt',
    title: 'Emergency Protocols',
    desc: 'Critical support for urgent and life-threatening situations.',
    color: 'purple',
  },
];

// ── FAQ Items ─────────────────────────────────────────────────────────────────
export const FAQS = [
  {
    id: 'faq-1',
    question: 'How often can I donate whole blood?',
    answer:
      'You can donate whole blood every 56 days (8 weeks). This waiting period allows your body to fully replenish red blood cells. Platelet donations can be made more frequently — up to 24 times per year.',
  },
  {
    id: 'faq-2',
    question: 'What should I eat before my appointment?',
    answer:
      'Eat a healthy, iron-rich meal at least 3 hours before donating. Avoid fatty foods. Good choices include lean meats, leafy greens, beans, and whole grains. Stay well-hydrated by drinking at least 16 oz of water beforehand.',
  },
  {
    id: 'faq-3',
    question: 'Can I donate if I have a recent tattoo?',
    answer:
      'It depends on your location and tattoo studio. In many regions, you must wait 3–12 months after getting a tattoo. If the tattoo was done at a state-regulated facility with sterile needles, the wait period may be shorter or waived.',
  },
  {
    id: 'faq-4',
    question: 'How long does the donation appointment take?',
    answer:
      'A typical whole blood donation takes about 8–10 minutes. Including registration, health screening, and the post-donation rest period, plan for about 45–60 minutes total for your first visit.',
  },
  {
    id: 'faq-5',
    question: 'What happens to my blood after donation?',
    answer:
      'Your blood is tested, processed, and separated into components (red cells, plasma, platelets). Each component is distributed to hospitals and patients in need. Your donation can potentially save up to 3 lives.',
  },
];
