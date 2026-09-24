# NoteFolio System Architecture

## 1. Executive Summary
**NoteFolio** is a full-stack digital marketplace designed for students and educators to browse, purchase, read, annotate, and manage academic handwritten and digital notes. The platform is architected for dual-deployment flexibility: as a full-stack monolithic Node.js/Express service on **Render**, or as a decoupled static frontend with serverless functions on **Netlify**, backed by **MongoDB Atlas** and **Cloudinary**.

---

## 2. High-Level Architecture Diagram

```mermaid
graph TD
    Client[Frontend Client: HTML5 / CSS3 / Vanilla JS]
    
    subgraph Deployment Targets
        Render[Render Full-Stack Web Service<br/>Node.js + Express + Static Server]
        Netlify[Netlify CDN + Netlify Functions<br/>Serverless Express Adapter]
    end
    
    subgraph Backend Layer
        ExpressApp[Express.js App: server/app.js]
        AuthRouter[/api/auth]
        NoteRouter[/api/notes]
        OrderRouter[/api/orders]
        PaymentRouter[/api/payments]
        AdminRouter[/api/admin]
    end
    
    subgraph Data & Cloud Services
        MongoAtlas[(MongoDB Atlas Database)]
        Cloudinary[Cloudinary Media CDN]
        GoogleOAuth[Google OAuth 2.0 API]
        Razorpay[Razorpay Payment Gateway]
    end

    Client -->|HTTP/HTTPS| Render
    Client -->|Static Assets + API Redirects| Netlify
    
    Render --> ExpressApp
    Netlify --> ExpressApp
    
    ExpressApp --> AuthRouter
    ExpressApp --> NoteRouter
    ExpressApp --> OrderRouter
    ExpressApp --> PaymentRouter
    ExpressApp --> AdminRouter
    
    AuthRouter --> MongoAtlas
    AuthRouter --> GoogleOAuth
    NoteRouter --> MongoAtlas
    NoteRouter --> Cloudinary
    OrderRouter --> MongoAtlas
    PaymentRouter --> Razorpay
    AdminRouter --> MongoAtlas
```

---

## 3. Technology Stack

### Frontend Layer
- **Language & Runtime:** HTML5, CSS3, Modern ES6+ Vanilla JavaScript.
- **Iconography & Fonts:** FontAwesome 6, Google Fonts (*Playfair Display*, *Source Sans Pro*).
- **PDF Rendering & Protection:** PDF.js, Canvas Rendering, DOM anti-copy & anti-screenshot protections.
- **Client-Side State:** `localStorage` synchronization for cart, downloads, bookmarks, highlights, and token caching.

### Backend API Layer
- **Runtime:** Node.js (v18+) with Express.js.
- **Serverless Integration:** `serverless-http` for Netlify Lambda execution.
- **Authentication:** JWT (JSON Web Tokens), `bcryptjs`, Google OAuth 2.0 redirect flow.
- **File Uploads:** `multer` with memory storage and Cloudinary stream piping.
- **CORS & Security:** `cors` middleware, payload limits (50MB) for base64/PDF streaming.

### Database & Storage Layer
- **Primary Database:** MongoDB Atlas via `mongoose` ODM with connection state caching for serverless environments.
- **Cloud Media Storage:** Cloudinary (PDF previews, cover images, handwritten notes).
- **Local Fallback:** In-memory fallback and base64 support for offline development.

---

## 4. Dual Deployment Architecture

### 4.1 Render Deployment (Full-Stack Mode)
- **Entry Point:** `server/index.js`
- **Execution:** Node.js long-running HTTP server listening on `process.env.PORT`.
- **Static Asset Delivery:** Express `express.static` serves root HTML, CSS, JavaScript, and images directly.
- **URL Handling:** Clean URL middleware automatically resolves routes like `/cart`, `/my-notes`, and `/admin-panel` to corresponding `.html` files.

### 4.2 Netlify Deployment (Serverless Mode)
- **Static Hosting:** Netlify CDN serves root HTML/CSS/JS directly (`publish = "."`).
- **Serverless API:** `netlify/functions/api.js` wraps `server/app.js` using `serverless-http`.
- **Routing & Redirects:** `netlify.toml` routes all `/api/*` requests directly to `/.netlify/functions/api/:splat`.
- **Database Connection Handling:** Mongoose connection is awaited in an Express request middleware to prevent serverless cold-start race conditions.

---

## 5. Security & Protection Architecture
1. **Content Protection:** Note viewer disables context menus, print commands (`@media print { visibility: hidden }`), screenshot key combinations, and multi-finger touch capture.
2. **Access Control:** Role-based authentication (Admin vs. Standard User).
3. **6-Month Subscription Validity:** Purchased notes carry a timestamped purchase record; access is strictly revoked after 6 months from purchase date unless renewed.
4. **Library Management:** Users can remove purchased/expired notes from their library via `DELETE /api/auth/purchased/:noteId`.
