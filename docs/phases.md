# NoteFolio Project Phases & Roadmap

```mermaid
gantt
    title NoteFolio Engineering Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Core Foundation
    HTML/CSS/JS Architecture          :done, p1, 2026-04-20, 2d
    Catalog & Semester Filtering     :done, p2, after p1, 2d
    section Phase 2: Auth & Payments
    Local & Google OAuth 2.0         :done, p3, after p2, 2d
    Flipkart-Style Cart & Checkout   :done, p4, after p3, 2d
    section Phase 3: Admin & Content
    Admin Panel & Note CRUD          :done, p5, after p4, 2d
    PDF Upload & Cloud Storage       :done, p6, after p5, 2d
    section Phase 4: Reader & Expiry
    Anti-Screenshot Note Viewer      :done, p7, after p6, 2d
    6-Month Subscription Validity    :done, p8, after p7, 2d
    section Phase 5: Multi-Host Deployment
    Netlify Serverless Optimization  :done, p9, after p8, 2d
    Render Full-Stack Deployment     :active, p10, after p9, 2d
```

---

## Phase Breakdown

### Phase 1: Core Foundation & Marketplace Layout
- Pure HTML5/CSS3 frontend architecture with responsive modern cards.
- Semester-wise navigation and branch/subject search filtering.
- Client-side mock data structure with chapter breakdown.

### Phase 2: User Authentication & Checkout Engine
- Dual authentication system: Local JWT auth + Google OAuth 2.0 redirect flow.
- Two-column Flipkart-style shopping cart with coupon engine (`NEW10`, `STUDENT20`, `BUNDLE15`).
- Order generation and payment gateway mock/Razorpay integration.

### Phase 3: Admin Dashboard & Cloud Asset Management
- Dedicated admin portal (`/admin-panel.html` & `/login.html`).
- Administrative note CRUD: upload new PDFs, assign price/semester, delete notes.
- Administrative user management: list active users, manage roles, and delete accounts.

### Phase 4: Protected PDF Reader & Expiry Engine
- Custom canvas-based PDF reader with table of contents, zooming, and text search.
- Anti-screenshot protection shield and `@media print` blockers.
- 6-Month note expiration calculation and self-service note removal from library.

### Phase 5: Multi-Platform Cloud Deployment
- **Netlify:** Decoupled serverless functions with automatic pretty-URL handling.
- **Render:** Unified Express service serving static assets and dynamic APIs under one domain.
- **Documentation & GitHub Readiness:** Full documentation suite and git-ready codebase.
