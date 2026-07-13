# 💰 FinTech: Responsive Personal Finance Tracker

FinTech is a premium, client-side personal finance tracker built using **React, TypeScript, and Ionic**. The application features an off-white Canvas design system inspired by **Apple Wallet** and **Stripe**, offering custom layouts tailored for both desktop and mobile screens.

---

## 📱 Live Demo & Responsiveness

FinTech implements a **Dual Responsive Viewport** model:
*   **Mobile Viewport (< 992px)**: Renders a tabbed interface with a custom floating capsule navigation bar.
*   **Desktop Viewport (≥ 992px)**: Renders a 3-column financial dashboard containing charts, data grids, and forms on a single pane.

---

## ✨ Key Features

*   **Custom Floating Capsule Tab Bar**: A pill-shaped floating navigation bar that overrides standard rectangular tab bars with animated highlights.
*   **Interactive Ledger & Balance Sheets**: Real-time transaction manager with category filters and instant calculations.
*   **SVG Concentric Envelopes Gauge**: A custom circular progress speedometer built using inline SVG mathematical curves. Adjusting limits via range sliders recalculates paths on-the-fly without page updates.
*   **Interactive Quick Transfer**: Click on any contact badge (Priya, Rohan, etc.) to open a popup sheet displaying their UPI ID and Phone Number. Sending money automatically deducts the balance and logs the transfer in the ledger.
*   **Preferences & Settings Toggles**: A realistic settings manager complete with active toggle pills for daily notification alerts and biometric authentication locks.
*   **Input Validation Guardrails**: Restricts inputs to positive-only values (`amount > 0`) to prevent logic balance bypass exploits.

---

## 🛠️ Tech Stack

*   **Framework Core**: React (v18) + TypeScript
*   **UI Architecture**: `@ionic/react` (v8) + Ionicons
*   **Build Utility**: Vite + Rollup
*   **Styling System**: Vanilla CSS Variables

---

## 🚀 Local Development Setup

To run this project locally on your machine, follow these steps:

### 1. Installation
Clone the repository, navigate into the directory, and install the dependencies:
```bash
npm install
```

### 2. Run the Development Server
Launch the local watcher server:
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

To access the server on your mobile phone over Wi-Fi, run the host-exposed server:
```bash
npm run dev -- --host
```
*Vite will print the local network IP (e.g., `http://192.168.1.5:5173/`) to enter on your phone's browser.*

### 3. Build for Production
To bundle the files into single-page static assets (saved in the `dist/` directory):
```bash
npm run build
```
To preview the compiled build locally:
```bash
npm run preview
```

---

## 🔒 Security Audit Specifications

A security evaluation has been performed on the core client-side modules:
*   **Strict Bound Checks**: Enforced in both desktop and mobile handlers to block negative expense entries.
*   **XSS Mitigation**: Standard JSX binding renders string inputs strictly as text nodes, neutralizing HTML script injections.
*   **Data Integrity**: Data is persistent across browser sessions using `localStorage` caching. In a production environment, this should be migrated to server-side APIs or native encrypted vaults (Capacitor Secure Storage / Keychain).
