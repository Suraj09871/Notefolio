# 📚 NoteFolio - Academic Notes Marketplace & Digital Reader

NoteFolio is a full-stack academic study materials platform built for students and educators. It enables users to browse, buy, read, annotate, and manage digital & handwritten notes with built-in DRM protections, Google OAuth 2.0 authentication, dynamic semester filtering, and an interactive admin portal.

---

## 🌟 Key Features

- **🎓 Semester & Subject Explorer:** Instant filtering by Semester (1 to 8) and Engineering/Science subjects (CS, ME, EE, MATH, etc.).
- **📖 Canvas & PDF.js Note Viewer:** High-fidelity document viewing with Table of Contents navigation, zoom, highlighter, and page bookmarks.
- **🛡️ Anti-Screenshot & Copy Protection:** Context menu disabled, `@media print` blocking, and shortcut traps preventing unauthorized content piracy.
- **⏳ 6-Month Subscription Validity:** Notes remain active in the user's library for 6 months from purchase date.
- **🗑️ Self-Service Library Management:** Users can remove purchased/expired notes from their library with one click.
- **🛒 Flipkart-Style Cart & Offers:** Two-column checkout with dynamic coupon discounts (`NEW10`, `STUDENT20`, `BUNDLE15`) and 18% GST calculation.
- **🔐 Dual Authentication:** Local email/password JWT authentication and One-Click Google OAuth 2.0.
- **👑 Full Admin Control Panel:** Manage users, upload PDFs (with automated page count extraction), and perform note CRUD operations.
- **☁️ Multi-Host Cloud Deployment:** Production-ready for both **Render** (Full-Stack Express) and **Netlify** (Static CDN + Serverless Functions).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Modern Vanilla JavaScript (ES6+), FontAwesome 6 |
| **Backend** | Node.js, Express.js |
| **Serverless Adapter** | `serverless-http` (Netlify Functions) |
| **Database** | MongoDB Atlas (via `mongoose`) |
| **Storage CDN** | Cloudinary (Cover previews & PDF assets) |
| **Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Google OAuth 2.0 |
| **Payments** | UPI, Cards, NetBanking, Razorpay |

---

## 📂 Project Structure

```text
notefolio/
├── docs/                      # Comprehensive Architecture & Design Docs
│   ├── architecture.md        # System & Deployment Architecture
│   ├── design.md              # Design System & UI Specifications
│   ├── memory.md              # State Persistence & Business Rules
│   ├── phases.md              # Project Engineering Roadmap
│   ├── project-requirements.md# Detailed PRD & Functional Specs
│   └── rules.md               # Engineering & Security Standards
├── netlify/
│   └── functions/
│       └── api.js             # Netlify Serverless Function Wrapper
├── server/
│   ├── controllers/           # Auth, Notes, Orders, Payments logic
│   ├── middleware/            # JWT Auth, Uploads, Error Handling
│   ├── models/                # Mongoose Schemas (User, Note, Order, Payment)
│   ├── routes/                # Express API Route Declarations
│   ├── app.js                 # Express Application Definition
│   └── index.js               # Node.js Server Runner for Render & Local
├── images/                    # UI Icons & Note Cover Thumbnails
├── index.html                 # Marketplace Homepage & Note Catalog
├── my-notes.html              # User Library (Purchased & Handwritten)
├── note-viewer.html           # Protected Canvas/PDF Document Reader
├── cart.html                  # Shopping Cart & Checkout Interface
├── my-orders.html             # Order History & Receipts
├── downloads.html             # Downloads Manager
├── wishlist.html              # Saved Items Wishlist
├── coupons.html               # Discount Coupons & Promo Codes
├── profile.html               # User Account & Profile Settings
├── admin-panel.html           # Admin Management Portal
├── login.html                 # Login & Registration Portal
├── script.js                  # Frontend Application Logic
├── admin-script.js            # Admin Dashboard Controller
├── styles.css                 # Master Application Stylesheet
├── netlify.toml               # Netlify CDN & Function Routing Config
├── render.yaml                # Render Blueprint Deployment Config
├── package.json               # Pure Node.js / Express Dependencies
├── .env.example               # Environment Variables Template
└── README.md                  # Project Documentation
```

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/notefolio.git
cd notefolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Start the Application
```bash
# Start local server
npm start

# Or with live reloading
npm run dev
```

Visit **`http://localhost:3000`** in your browser!

---

## ☁️ Deployment Instructions

### Option A: Deploy to Render (Full-Stack Mode)
1. Push your repository to GitHub.
2. Log into [Render](https://render.com/) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following build settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. In the **Environment Variables** section, add your keys from `.env.example`.
6. Click **Deploy Web Service**.

### Option B: Deploy to Netlify (Serverless Mode)
1. Push your repository to GitHub.
2. Log into [Netlify](https://app.netlify.com/) and click **Add new site** -> **Import an existing project**.
3. Select your repository.
4. Netlify will automatically detect `netlify.toml` with:
   - **Publish directory:** `.`
   - **Functions directory:** `netlify/functions`
   - **Build command:** `echo 'No build required'`
5. Under **Site configuration** -> **Environment variables**, add your `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`.
6. Click **Deploy site**.

---

## 🔑 Default Security Credentials

- **Admin Login Portal:** `/login.html` (or click "Admin Login" in the footer of any page)
- **Admin Management Dashboard:** `/admin-panel.html`
- **Default Admin Email:** `admin@notefolio.com` (or username `admin`)
- **Default Admin Key / Password:** `admin_key_2026` (or `admin123`)

> 💡 *Note: You can change the admin email and key anytime by setting the `ADMIN_EMAIL` and `ADMIN_KEY` environment variables in your Render/Netlify dashboards or local `.env` file.*

---

## 📄 License
This project is licensed under the ISC License.
