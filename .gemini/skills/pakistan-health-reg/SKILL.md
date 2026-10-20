---
name: pakistan-health-reg
description: >
  Data privacy rules, blood compatibility standards, and Pakistan-specific
  healthcare regulatory context for LifeStream. Use this skill when designing
  donor data schemas, medical data handling, blood compatibility logic,
  emergency workflows, or any feature touching patient/donor health information.
---

# Pakistan Health Regulatory & Domain Skill — LifeStream

## When to Activate This Skill

Activate this skill when:
- Designing or modifying **donor or patient data schemas**.
- Implementing **blood compatibility** matching logic.
- Building **eligibility criteria** for donation.
- Handling **contact information** for donors (phone, city, visibility rules).
- Designing the **emergency blood request broadcast** feature.
- Evaluating **data retention, privacy, or legal compliance** requirements.
- Adding **hospital or blood bank onboarding** flows.

---

## 1. Blood Group Compatibility Reference

### Blood Group Constants
```js
// src/constants/blood.js (and server/src/constants/user.js)
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
```

### Compatibility Chart (Donor → Recipient)

| Donor Blood Group | Can Donate Whole Blood To |
| :---: | :--- |
| **O-** | O-, O+, A-, A+, B-, B+, AB-, AB+ (Universal Donor) |
| **O+** | O+, A+, B+, AB+ |
| **A-** | A-, A+, AB-, AB+ |
| **A+** | A+, AB+ |
| **B-** | B-, B+, AB-, AB+ |
| **B+** | B+, AB+ |
| **AB-** | AB-, AB+ |
| **AB+** | AB+ only |

> **Note for AB+ Recipients:** Can receive from any blood group (Universal Recipient).
> **Note for O- Donors:** Can donate to any blood group (Universal Donor).

### Implemented Logic
```js
// src/constants/blood.js
export const isCompatibleDonor = (donorGroup, recipientGroup) => {
  // Check donor's blood against recipient's compatible donor set
  const COMPATIBLE_DONORS = {
    'O-':  ['O-'],
    'O+':  ['O-', 'O+'],
    'A-':  ['O-', 'A-'],
    'A+':  ['O-', 'O+', 'A-', 'A+'],
    'B-':  ['O-', 'B-'],
    'B+':  ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  };
  return COMPATIBLE_DONORS[recipientGroup]?.includes(donorGroup) ?? false;
};
```

---

## 2. Blood Donation Eligibility Rules

When implementing or validating donor eligibility:

| Criterion | Requirement | Notes |
| :--- | :--- | :--- |
| **Age** | 18–65 years | Some centers accept up to 70 with doctor approval |
| **Weight** | Minimum 50 kg | Protects donor from adverse reactions |
| **Donation Interval** | Minimum 3 months between whole blood donations | 56 days (8 weeks) is WHO standard; 3 months is local practice |
| **Plasma Donation Interval** | 2 weeks | Different from whole blood |
| **Platelet Donation Interval** | 48 hours | Very different frequency |
| **Health Status** | No fever, cold, flu, or infections | Must feel well on donation day |
| **HIV/Hepatitis Status** | Screening mandatory at blood bank | Not stored in app — handled by blood bank lab |
| **Medication** | Some medications disqualify temporarily | Blood bank staff assess |
| **Pregnancy / Postpartum** | Disqualified during pregnancy; 6 months after delivery | |
| **Hemoglobin Levels** | Minimum 12.5 g/dL (women), 13.0 g/dL (men) | Tested at blood bank, not in app |

> **Important:** These criteria are for user education only. The LifeStream app does **not** perform medical screening. Actual eligibility is determined by qualified blood bank staff.

### Frontend Eligibility Checklist (EligibilityPage)
The app shows a self-assessment checklist. The three confirmed criteria used in `DonorRegistrationPage`:
1. **Age** — User confirms they are 18–65 years old.
2. **Weight** — User confirms they weigh at least 50 kg.
3. **Health** — User confirms they feel well today.

---

## 3. Donor Data Privacy Rules

### What Data Can Be Stored
```
✅ ALLOWED in database:
  - Full name (for matching and display)
  - Blood group (essential for matching)
  - City (for geographic proximity search)
  - Phone number (hidden from public; shared only on explicit donor consent)
  - Donation dates (for eligibility interval calculation)
  - Donor status: pending / verified / unavailable / suspended
  - canContact flag (donor's consent to be contacted by patients)

❌ NEVER store in database:
  - HIV status, Hepatitis status, or any lab results
  - Patient medical histories or diagnoses
  - Complete home address (city-level is sufficient for matching)
  - National ID (CNIC) number — not needed for blood donation matching
  - Payment card information — use Stripe (PCI compliant)
```

### Phone Number Visibility Rules
```
| Viewer               | Can See Phone Number? | Condition |
|----------------------|----------------------|-----------|
| Donor themselves     | ✅ Yes               | Always |
| Verified recipient   | ✅ Yes               | Only if donor.canContact === true |
| Hospital admin       | ✅ Yes               | For coordination of emergency requests |
| Public / Guest user  | ❌ No                | Phone is always hidden |
| Search results page  | ❌ No                | Show only masked format: "030X-XXXXXXX" |
```

### Data Retention Policy (recommended)
- Donor records: Retained while account is active. Deleted 2 years after account deactivation.
- Blood request records: Retained for 1 year for operational records.
- Session data: 7 days (configurable via `SESSION_TTL_DAYS` environment variable).
- Audit logs: Retained for 3 years for regulatory compliance.

---

## 4. Pakistan Phone Number Validation

```js
// server/src/constants/user.js
export const PAKISTAN_PHONE_REGEX = /^(?:\+92|0)[3][0-9]{9}$|^0[3]\d{2}-\d{7}$/;

// Valid formats:
// 0300-1234567   (local with hyphen)
// 03001234567    (local without hyphen)
// +923001234567  (international format)

// Invalid formats:
// 555-1234       ❌ (US short number)
// 92-300-1234567 ❌ (missing leading +)
```

### Pakistan Cities (for city filtering and validation)
Cities used in the seed data and search filters:
- Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Hyderabad, Sialkot, Gujranwala, Sargodha, Bahawalpur

---

## 5. Emergency Blood Request Workflow

When a hospital submits a critical blood request:

```
1. Hospital Staff creates BloodRequest (urgency: 'Critical', bloodGroup: 'O-', city: 'Lahore')
   ↓
2. System finds all verified donors in Lahore with compatible blood groups (O- donors for O- request)
   ↓
3. Only donors where canContact === true are included in notification list
   ↓
4. Notification dispatched:
   - SMS via Twilio / local gateway (first priority — immediate)
   - WhatsApp Cloud API (if donor has WhatsApp — higher open rate in Pakistan)
   - In-app push notification (if donor uses the app)
   ↓
5. Donors can respond: "I'm Available" or "Not Available Right Now"
   ↓
6. Hospital sees a list of committed donors with contact info
   ↓
7. BloodRequest status updated: Pending → Matched → Fulfilled
```

### Notification Rate Limiting (to avoid donor burnout)
- A single donor should not receive more than **3 emergency broadcasts per week**.
- Donors can set themselves to "Unavailable" which suppresses notifications for a configurable period (e.g., 3 months for recovery after donation).

---

## 6. Regulatory & Legal Context (Pakistan)

### Key Regulations
- **Punjab Blood Transfusion Authority (PBTA):** Regulates blood banks in Punjab. Blood banks must be PBTA-licensed.
- **Safe Blood Transfusion Programme (SBTP):** National initiative for voluntary non-remunerated blood donation.
- **PEMRA / PTA Data Regulations:** Pakistan does not yet have a comprehensive personal data protection law equivalent to GDPR, but the **Personal Data Protection Bill (PDPB)** has been in progress. Design data handling as if GDPR-equivalent rules apply — this future-proofs the platform.

### Recommended Privacy Practices
1. **Explicit consent at registration:** Donors must actively check consent boxes:
   - "I consent to my contact details being shared with verified requesters."
   - "I consent to receive SMS/WhatsApp notifications for urgent blood requests."
2. **Right to erasure:** Provide a "Delete My Account" feature that anonymizes donor records within 30 days.
3. **Data minimization:** Only collect fields that are directly needed for matching.
4. **Access logging:** Log every instance where a donor's phone number is revealed to a hospital or requester.

---

## 7. Blood Component Types

```js
// Blood components that can be requested:
export const BLOOD_COMPONENTS = [
  'Whole Blood',     // Most common — used in most emergencies
  'Platelets',       // Cancer patients, chemotherapy
  'Plasma',          // Burn victims, clotting disorders
  'Red Blood Cells', // Anaemia, surgery
  'Cryoprecipitate', // Haemophilia, specific clotting factor deficiency
];
```

---

## 8. Urgency Levels for Blood Requests

```js
export const URGENCY_LEVELS = {
  Critical: {
    label: 'Critical',
    description: 'Required within 2-4 hours. Patient life at immediate risk.',
    color: '#e74c3c',  // Red
    notificationPriority: 'immediate',
  },
  Urgent: {
    label: 'Urgent',
    description: 'Required within 24 hours.',
    color: '#f39c12',  // Orange
    notificationPriority: 'within_1_hour',
  },
  Routine: {
    label: 'Routine',
    description: 'Scheduled procedure. Required within 3-7 days.',
    color: '#27ae60',  // Green
    notificationPriority: 'daily_digest',
  },
};
```

---

## 9. Hospital & Blood Bank Verification Checklist

Before activating a hospital Organization account:

- [ ] Hospital license number verified against PBTA/NHRC records (manual process for MVP).
- [ ] Hospital admin's identity confirmed (NIC / hospital staff ID).
- [ ] Hospital physical address confirmed in Pakistan.
- [ ] Terms of Service accepted by hospital admin user.
- [ ] Organization status set to `active` by platform admin.

For MVP: This can be a manual verification step done by the LifeStream admin team via the admin panel. Automated verification can be added post-launch.

---

## 10. Sensitive Data — AI Agent Rules

> ⚠️ When working on this codebase, the AI agent **must never**:
> - Print or display the contents of `.env` files.
> - Log, return, or suggest code that exposes `passwordHash` in API responses.
> - Suggest storing HIV status, hepatitis results, or other medical lab data in the database.
> - Recommend collecting CNIC numbers or biometric data.
> - Generate code that removes the `canContact` consent check before broadcasting donor phone numbers.
