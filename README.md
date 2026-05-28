# 🦷 Dental Art Care

A modern, highly responsive, and premium web application designed for a state-of-the-art dental clinic. The application features stunning visual excellence, sleek glassmorphic UI elements, dynamic canvas particle animations, smooth custom scroll reveals, interactive team member bio cards, and a robust appointment booking system with client-side form validation.

---

## ✨ Features

- **Premium Modern Design**: Vibrant, custom HSL color palette featuring smooth gradients and elegant typography.
- **Dynamic Particles Canvas**: A interactive background particle system on the hero section using HTML5 Canvas.
- **Scroll Animations**: Smooth entrance, parallax, and staggered slide-in transitions built with `IntersectionObserver`.
- **Interactive Team Cards**: Elegant specialists cards featuring a smooth interactive 3D-like flip transition showing bios and social links (accessible via keyboard focus too!).
- **Performance Optimized**: Configured with `will-change` properties for micro-animations, lazy assets, and optimized layouts.
- **Fully Accessible**: Implemented with semantic HTML5 elements, keyboard navigation support, and complete ARIA attributes.
- **Interactive Booking Form**: Real-time validation with inline error messaging and a delightful success verification state.

---

## 🚀 How to Run the Project

We have set up a lightweight local development server using **Vite** so you can run the project with a single command without needing Python.

### 📋 Prerequisites

Ensure you have **Node.js** and **npm** installed on your system. If not, you can download it from [nodejs.org](https://nodejs.org/).

---

### Option 1: Standard NPM Command (Recommended)

1. **Install the dependencies:**
   Make sure you are in the root directory `DentalArtsCare` and run:
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   *This starts the super-fast Vite server. Your terminal will show a link like `http://localhost:5173`. Command click or copy it into your browser to view the site!*

---

### Option 2: Run directly with NPX (No installation required)

If you don't want to run `npm install`, you can launch a temporary local server directly:
```bash
npx serve dentalarts
```
*Open your browser and navigate to the address displayed in your terminal (usually `http://localhost:3000` or `http://localhost:5000`).*

---

### Option 3: Double-Click (Simple Open)

You can also run the app directly without any command-line tools:
1. Navigate to the `dentalarts/` folder in your file explorer (Finder on macOS / File Explorer on Windows).
2. Double-click **`index.html`** to open it directly in your default browser.


---

## 📁 Project Structure

```text
DentalArtsCare/
├── README.md               # Project documentation (this file)
└── dentalarts/             # Main application codebase
    ├── index.html          # Main homepage & booking interface
    ├── styles.css          # Premium vanilla CSS styling stylesheets
    ├── script.js           # Core interactive logic (Canvas, counter, form validation)
    └── BrightSmile_Dental_Clinic.html   # Alternative clinic layout
```

---

## 🛠️ Built With

- **HTML5** & **CSS3** (Custom Properties, Flexbox, Grid, Glassmorphism, animations)
- **Vanilla JavaScript** (ES6+, Intersection Observer API, Canvas API)
- **Google Fonts** (Inter & Playfair Display)
