# Shared Reminder PWA

> **A cross-platform (Web, iOS, Android) shared reminder & list application**
> Built with **Angular**, **PWA**, and **Firebase**.

This project is a Progressive Web App (PWA) that allows two or more users to collaborate in a **shared workspace**, creating **lists and reminders** with **real-time synchronization** and **offline-first** support.

---

## ✨ Features

* 📱 **Progressive Web App (PWA)**

  * Installable on iOS and Android home screens
  * Offline-first architecture
  * Native-like mobile experience

* 👥 **Shared Workspace (Invite by Code)**

  * Auto-generated 6-digit workspace code
  * Join a workspace using a codes
  * Real-time shared data between users

* 🔄 **Real-time Synchronization**

  * Instant updates across all connected devices
  * No manual refresh required

* 🔔 **Reminders & Notifications**

  * Date & time based reminders
  * Push notification support (PWA)

* 📋 **Multiple Lists**

  * Create and manage multiple lists (e.g. Shopping, Important Notes)
  * Simple and clean list-based UI

* 📴 **Offline Support**

  * Create and edit items while offline
  * Automatic sync when connection is restored

---

## 🧱 Tech Stack

* **Frontend:** Angular
* **PWA:** Angular Service Worker
* **Backend / Realtime DB:** Firebase Firestore
* **Authentication:** Firebase Auth (Anonymous / Code-based workspace access)
* **Notifications:** Firebase Cloud Messaging (FCM)
* **Styling:** Tailwind CSS (utility-first, mobile-first, Apple-inspired UI)

---

## 🧠 Architecture Overview

* **App Shell Layout**

  * Fixed top navigation bar (workspace name + share button)
  * Hamburger menu with list navigation
  * Main content rendered via Angular Router

* **Data Model (Simplified)**

  ```
  workspaces
    └── {workspaceId}
        ├── name
        ├── code
        ├── lists
        │   └── {listId}
        │       └── items
        └── members
  ```

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run the app locally

```bash
ng serve
```

### 3️⃣ Build PWA

```bash
ng build --configuration production
```

---

## 📦 Deployment

* Can be deployed as a **standalone PWA** (Firebase Hosting, Netlify, etc.)
* Can be published to:

  * **Google Play Store** (via Trusted Web Activity)
  * **Apple App Store** (via Capacitor wrapper)

---

## 🎯 Project Goals

* Demonstrate a **real-world PWA architecture**
* Showcase **real-time collaboration** features
* Provide a strong **portfolio project** for mobile-first web development
* Avoid native mobile development while still delivering native-like UX

---

## 📌 Notes

* This project intentionally avoids SSR (Server-Side Rendering) due to its authenticated, offline-first nature.
* UI/UX is designed to follow mobile and Apple Human Interface Guidelines.

---

## 👩‍💻 Author

**Damla**
FullStack Developer

---

## 📄 License

This project is for educational and portfolio purposes.
