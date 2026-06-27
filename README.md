# 🩸 LifeStream — Smart Blood Donation & Request Network

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![SCSS](https://img.shields.io/badge/SCSS-BEM-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)

An **interactive, production-ready React web application** designed to solve the logistical challenges of matching voluntary blood donors with local patients in urgent medical need. 

Built to replace chaotic social media coordination groups with a single, structured search, donation logging, and request management system.

---

## 🔗 Project Links & Sandboxes
* **Live Demo:** `[Insert link to your hosting, e.g. Vercel/Netlify]`
* **GitHub Repository:** `[Insert link to your GitHub repo]`

---

## 🎯 Recruiter Quick Sandbox (Test Credentials)
To explore the dual-role design (Admin vs. Donor/Recipient) without registering, use these pre-loaded sandbox accounts:

| Role | Email | Password | Allowed Actions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@lifestream.com` | `Admin@1234` | Delete users, approve/reject requests, delete donor entries. |
| **Standard User / Donor** | `john@example.com` | `Test@1234` | Create requests, log donations, register as active donor. |

---

## ⚡ Main Core Features

* **🛡️ Role-Based Route Guarding:** Distinct dashboards and operations for standard donors/recipients vs. site administrators.
* **🔍 Dynamic Directory Search:** Live filtering of verified donors by **Blood Group** and **City/Location** with dynamic distance metrics.
* **📋 Urgent Request Portal:** Allows users to submit emergency blood requests specifying hospital, patient name, required units, and urgency levels (`Critical`, `Urgent`, `Routine`).
* **📊 Analytics Dashboard:** 
  * Live animated counter displaying total registered users, active requests, verified donors, and total liters of blood donated.
  * Interactive logs tracking donation details (Whole Blood, Plasma, Platelets) and dates.
* **⚙️ Admin Management System:** Comprehensive administrative control panel to delete users or request entries for data curation and security.

---

## 🛠️ Architecture & Engineering Decisions

### 1. Separation of Concerns (Service Layer & API Readiness)
To prevent components from handling data operations directly, all HTTP communications are encapsulated inside a `/services` layer. 
* The project includes a pre-configured `apiClient.js` complete with automatic JWT token attachment in outbound request headers (`Authorization: Bearer <token>`) and centralized error response interceptors.
* Switching to a database backend requires no component refactoring; only swapping simulated endpoints inside the service files.

### 2. Client-Side State Hydration & Persistence
* Built global state modules using **React Context Providers** (`AuthContext` and `AppDataContext`).
* Persists user sessions and application records dynamically in browser `localStorage`.
* Pre-loads the sandbox on first load with structured, realistic seed records (donors, active requests, and historical logs) so recruiters don't experience an empty application.

### 3. Clean CSS Architecture (SCSS + BEM)
* Structured using modular stylesheets, using the **BEM (Block, Element, Modifier)** methodology to keep style selectors flat, readable, and highly maintainable.
* Uses modern variables for responsive grids and smooth CSS transformations.

---

## 📂 Project Organization

```text
src/
├── api/             # HTTP Client config (Axios base, response interceptors)
├── assets/          # Static logos, icons, and illustration vectors
├── components/      # Reusable visual blocks (Stats, Cards, Modals, Forms)
├── context/         # Central State providers (AuthContext, AppDataContext)
├── data/            # Mock records and initial database seeds
├── hooks/           # Custom utility hooks (Scroll triggers, form control)
├── pages/           # Page containers (Dashboard, Auth, Home, Search, Requests)
├── routes/          # Declarative React Router layout configuration
├── services/        # Business logic & API calls wrapper
└── styles/          # Core variables, media queries, and global stylesheet overrides
```

---

## 🚀 Getting Started (Run Locally)

Follow these steps to run the development build locally:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/your-username/blood-donation-website.git

# Navigate into the project folder
cd blood-donation-website

# Install dependency packages
npm install
```

### 3. Start Development Server
```bash
# Run local Vite server
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
# Generate optimized production build
npm run build
```

---

## 💡 Key Takeaways for Technical Interviewers
* **Clean Code:** Strictly enforces ESLint configurations, zero console leaks in production, and intuitive file structuring.
* **UX Animations:** Smooth UI interaction using scroll-triggered intersection observers and transition indicators.
* **JWT Readiness:** Authenticated routes reject requests if credentials expire, redirecting users to the login screen with a `session=expired` query parameter.

---

## ✉️ Contact & Socials
* **Developer Name:** [Your Name]
* **LinkedIn:** [Your Profile Link](https://linkedin.com/in/your-username)
* **Email:** [Your Email Address]
* **Portfolio:** [Your Website Link](https://your-portfolio.com)

