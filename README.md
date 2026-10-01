# 📱 EduTrack Pro — Field Operations & School Visit Management System

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Mobile%20PWA%20%2F%20Web-blue)](https://github.com/hishamsha/edutrack-app)

**EduTrack Pro** is a modern, mobile-first operations and attendance management application tailored for educational representatives, field trainers, and school coordinators. It completely replaces tedious Google Forms, WhatsApp bill submissions, and manual spreadsheets with a single, real-time operating dashboard.

---

## 🌟 Key Features

### 1. 📍 Smart GPS Attendance & Geofenced Check-In
- **Live Geofencing**: Detects device coordinates via `navigator.geolocation` with precision status.
- **Auto Duration Clock**: Tracks time on school campus from check-in to check-out.
- **Check-Out Summary**: Stakeholders met count, achievements summary, and 1–5 star school satisfaction rating.

### 2. 📸 Live GPS Map Camera with Hidden Override Mode
- **Live Viewfinder**: Device camera stream with target crosshairs and real-time HUD (ticking seconds clock, coordinates, altitude, compass, school name, and address).
- **Canvas Geo-Stamping**: Automatically bakes an authentic GPS Map Camera watermark onto photos with green **`✓ GPS MAP CAMERA • VERIFIED`** badge.
- **🕵️ Discreet Override Mode (`⚙️ GPS Mode`)**:
  - For areas with weak GPS (basements/remote labs) or testing.
  - **Quick Lock to School**: Instantly locks into any registered school's exact latitude, longitude, and campus address.
  - **Custom Timestamp Picker**: Custom stamped date and time (e.g., set exact morning arrival time).
  - **Custom Gate / Street Address**: Set specific gate descriptions.

### 3. 💸 Field Expense Manager
- **Distance Mileage Calculator**: Enter kilometers travelled to automatically calculate conveyance (`KM × ₹/km` for bike/car).
- **Multi-Category Claims**: Fuel conveyance, public transport/cab, daily food allowance (DA), printing/stationery, and hotel lodging.
- **Bill Receipt Uploads**: Attach photos of bills or fuel slips directly to claims.
- **Approval Workflow**: Integrated approval/rejection queue for management with comments.

### 4. 🏫 Schools CRM Directory (with Full Edit Suite)
- **One-Touch Field Actions**:
  - 📞 **Call Principal** directly (`tel:`)
  - 💬 **WhatsApp Coordinator** with pre-filled message (`wa.me`)
  - 🗺️ **Google Maps Navigation** (`maps.google.com`)
- **✏️ Edit School Data**: Update school name, affiliation board (CBSE, ICSE, State), category, address, contacts, and GPS coordinates on the fly.

### 5. 👥 Trainer & Colleague Profiles (with Edit Suite)
- **Multi-User Role Management**: Isolated logins for each colleague (*Arun Sharma - North Zone*, *Priya Patel - South Zone*, *Rahul Verma - West Zone*, *Hisham - Admin Director*).
- **✏️ Edit Trainer Data**: Update designation, assigned territory/zone, contact phone number, email, and avatar.
- **Self-Profile Editing**: Quickly edit profile from the top-right navbar menu.

### 6. 🛡️ Executive Admin Cockpit & 1-Click Exports
- **Live Team Field Tracker**: Real-time status cards showing which colleague is currently at which school.
- **📥 Export Visits CSV**: Formatted for instant import into Microsoft Excel & Google Sheets.
- **📥 Export Expenses CSV**: Full expense audit ledger.
- **🖨️ Formatted Printable Audit Report**: Ready for weekly management reviews.

### 7. 📶 100% Offline Resilience (LocalStorage Engine)
- Saves all visits, activities, photos, and expense claims locally.
- Works reliably even with poor 4G connectivity inside school labs.

---

## 👥 Colleague Accounts (Pre-configured for Testing)

| Avatar | Name | Role | Territory / Zone | Phone |
| :---: | :--- | :--- | :--- | :--- |
| 👨‍💼 | **Hisham (Director)** | Operations Admin | Headquarters / All Zones | +91 98765 43210 |
| 🚗 | **Arun Sharma** | Senior Field Coordinator | North Zone (Delhi NCR) | +91 98111 22334 |
| 👩‍🏫 | **Priya Patel** | STEM Education Lead | South Zone (Bengaluru) | +91 98222 33445 |
| 🎒 | **Rahul Verma** | Field Outreach Executive | West Zone (Mumbai) | +91 98333 44556 |

> **Quick Switch**: Tap the user pill in the top navigation bar to switch between field staff and admin views in 1 click.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Setup Instructions

```bash
# 1. Clone this repository
git clone https://github.com/hishamsha/edutrack-app.git

# 2. Navigate into the project folder
cd edutrack-app

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

### Accessing the App
- **Local Desktop**: Open [http://localhost:5173/](http://localhost:5173/)
- **Mobile Device (Same Wi-Fi)**: Open `http://<your-computer-ip>:5173/` on your phone browser.
- **Install as Mobile App**: In your mobile browser (Chrome/Safari), tap **"Add to Home Screen"**.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, JavaScript (ESNext)
- **Build Tool**: Vite 8
- **Styling**: Vanilla CSS Design System (Custom properties, dark mode, glassmorphism)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Geotagging & Canvas Stamping**: HTML5 Canvas 2D Engine

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
