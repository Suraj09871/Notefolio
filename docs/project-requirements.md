# NoteFolio Project Requirements Document (PRD)

## 1. Project Goal
Develop a high-performance, responsive, secure web platform for undergraduate students to browse, buy, view, and organize digital and handwritten study materials, accessible across desktop and mobile devices.

---

## 2. Functional Requirements

### 2.1 User Management
- **Registration / Login:** Support both email/password registration with validation and One-Click Google OAuth 2.0.
- **Session Handling:** JWT tokens persisted in localStorage and sent via `Authorization: Bearer <token>` headers.
- **User Profile:** Manage user details, view order history, view active purchases, and handle logout.

### 2.2 Marketplace & Discovery
- **Catalog Browsing:** Browse notes by semester (1 to 8), department (CS, ME, EE, MATH, etc.), price, and keyword.
- **Preview & Details:** View note metadata (title, subject, author, page count, chapter breakdown, price, preview image).
- **Wishlist & Bookmarks:** Save items for future purchase or bookmark notes for quick access.

### 2.3 Cart, Coupons & Payments
- **Shopping Cart:** Add/remove items, adjust quantities, view subtotal, tax (18% GST), and total payable amount.
- **Coupons:** Apply discount codes (`NEW10`, `STUDENT20`, `BUNDLE15`) with dynamic total recalculation.
- **Payment Processing:** Integrated modal supporting UPI, Card, NetBanking, and Razorpay.

### 2.4 "My Notes" Library & Expiry Policy
- **Purchased Library:** Instant visibility of acquired notes upon successful checkout.
- **6-Month Access Lifecycle:** Notes remain readable for exactly 6 calendar months from purchase date.
- **Self-Service Library Cleanup:** Users can delete notes from their library via a red 'X' button (`DELETE /api/auth/purchased/:noteId`).

### 2.5 Secure Note Reader
- **PDF Viewing:** High-fidelity canvas/PDF.js rendering with pagination, zoom controls, and chapter navigation.
- **Copy Protection:** Block right-click context menu, browser printing, and screenshot key shortcuts.

### 2.6 Admin Portal
- **Admin Access:** Secured route with admin credentials (`admin` / `admin123`).
- **Note CRUD:** Upload PDF documents (with automatic page counts and Cloudinary storage), edit note details, and delete notes.
- **User Control:** Inspect registered accounts, view purchase history, and delete users.

---

## 3. Non-Functional Requirements

### 3.1 Performance & Scalability
- Serverless cold-start under 1.5 seconds.
- Responsive layout adapting smoothly from 320px mobile to 4K desktop screens.
- Caching headers and cache-busting query strings for instant frontend updates.

### 3.2 Security & Compliance
- Passwords hashed using bcrypt.
- JWT signed with HMAC-SHA256 and expiration.
- CORS restricted to allowed HTTP methods and headers.
- MongoDB connection string and API keys secured in environment variables.

### 3.3 Multi-Platform Hosting Compatibility
- **Render:** Monolithic Node.js Express service serving API and frontend static files.
- **Netlify:** Decoupled static CDN + Serverless Functions via `netlify.toml`.
- **GitHub:** Clean repository containing no build artifacts or sensitive credentials.
