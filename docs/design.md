# NoteFolio UI/UX Design System

## 1. Design Philosophy
NoteFolio blends academic clarity with modern eCommerce ergonomics. The interface is optimized for focused reading, swift note discovery, instant semester filtering, and frictionless checkout across desktop and mobile devices.

---

## 2. Color Palette & Theming

```css
:root {
  /* Brand Core */
  --primary-green: #2e7d32;
  --primary-dark: #1b5e20;
  --accent-gold: #ffc107;
  --charcoal: #212121;
  --soft-gray: #757575;
  --light-bg: #f8f9fa;
  --white: #ffffff;
  
  /* Status Colors */
  --success: #28a745;
  --warning: #fbbf24;
  --danger: #ef4444;
  --info: #17a2b8;
  
  /* UI Accents */
  --border-color: #e0e0e0;
  --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --card-hover-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
```

---

## 3. Typography
- **Headings:** `'Playfair Display', serif` — gives an academic, authoritative feel.
- **Body & Controls:** `'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif` — optimized for high legibility, reading endurance, and crisp rendering on high-DPI screens.

---

## 4. Key Page Layouts

### 4.1 Marketplace & Browse (`index.html`)
- **Header:** Sticky modern navbar with logo, search bar, active navigation links, dynamic cart badge, and auth buttons.
- **Semester Tabs:** Quick-filter pills for Semesters 1 through 8.
- **Subject & Search Filters:** Real-time dropdown and search input filtering.
- **Note Grid:** Responsive CSS Grid (`repeat(auto-fill, minmax(300px, 1fr))`) displaying cover images, subject tags, descriptions, price, page counts, and quick-add actions.

### 4.2 "My Notes" Library (`my-notes.html`)
- **Sub-navigation:** Tabs for *All Notes*, *Recent*, *Downloaded*, *Bookmarked*, and *Expiring Soon*.
- **Note Card Meta:** 
  - `Purchased on: DD/MM/YYYY`
  - `Valid until: DD/MM/YYYY` (or `Expires in X days` / `Expired on: DD/MM/YYYY`)
- **Action Buttons:**
  - **Read:** Direct link to interactive PDF viewer.
  - **Download / Delete Download:** Local storage download manager.
  - **Bookmark:** Toggle favorite state.
  - **Remove from Library (Red 'X'):** Allows self-service removal of purchased notes.

### 4.3 FlipKart-Style Cart & Checkout (`cart.html`)
- **Two-Column Layout:** 
  - *Left:* Item list with note thumbnails, delivery estimates, "Save for later", and "Remove".
  - *Right:* Sticky "Order Summary" breakdown (Subtotal, 18% GST, Promotional Discounts, Total Savings).
- **Payment Modal:** Tabbed selector supporting UPI apps (GPay, PhonePe, Paytm), Debit/Credit Cards, NetBanking, and Razorpay.

### 4.4 Note Viewer & Digital Reader (`note-viewer.html`)
- **Reader Controls:** Table of Contents sidebar, zoom in/out, page jump, highlighter tool, and dark mode toggle.
- **Anti-Screenshot Shield:** 
  - Dynamic overlay when screen capture gestures/keys (`PrintScreen`, `Ctrl+P`, `Meta+Shift+3/4`) are triggered.
  - `@media print { body * { visibility: hidden; } }` rules preventing unauthorized hardcopy duplication.

### 4.5 Admin Control Panel (`admin-panel.html`)
- **Dashboard Stats:** Total users, total active notes, revenue counters, and upload metrics.
- **Note Management (CRUD):** PDF upload modal with automatic page extraction, price setting, semester assignment, and Cloudinary upload.
- **User Management:** View all registered accounts, user roles, Google IDs, and account deletion controls.
