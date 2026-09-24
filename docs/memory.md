# NoteFolio Context Memory & State Bank

## 1. Domain Entities & State Models

### 1.1 User Model (`User`)
- `name`: Full display name.
- `email`: Unique email identifier.
- `password`: Hashed using `bcryptjs` (salt rounds = 10) for local accounts; optional for Google OAuth accounts.
- `role`: `"user"` or `"admin"`.
- `googleId`: OAuth identifier for single sign-on.
- `avatar`: Cloudinary or Google profile picture URL.
- `purchasedNotes`: Array of objects:
  - `note`: `ObjectId` referencing `Note`.
  - `purchaseDate`: ISO 8601 timestamp.
  - `expiryDate`: ISO 8601 timestamp (automatically initialized to `purchaseDate + 6 months`).
- `orderHistory`: Array of `ObjectId` references to `Order`.

### 1.2 Note Model (`Note`)
- `title`: Subject title.
- `subject`: Department / branch code (e.g. `CS`, `ME`, `EE`, `MATH`).
- `semester`: Academic term (`"1"` through `"8"`).
- `price`: Cost in INR (₹).
- `pages`: Total page count.
- `description`: Overview and summary.
- `image`: Cover preview URL.
- `pdfUrl`: Cloudinary or Supabase PDF asset URL (or base64 storage).
- `isHandwritten`: Boolean flag indicating handwritten or typed notes.
- `chapters`: Array of `{ title, pages }`.

---

## 2. Business Rules & Logic Workflows

### 2.1 6-Month Expiration Policy
1. When a note is purchased, `purchaseDate` is recorded as `new Date().toISOString()`.
2. Expiry is computed as `purchaseDate + 180 days` (6 months).
3. In `renderMyNotes()`, cards compute remaining validity:
   - If `daysToExpiry <= 0`: Card marked "Expired", viewer access locked.
   - If `0 < daysToExpiry <= 30`: Amber warning badge `"Expires in X days"`.
   - If `daysToExpiry > 30`: Green badge `"Valid until: DD/MM/YYYY"`.
4. In `renderNoteViewer()`, expired notes block rendering and prompt renewal.

### 2.2 Note Library Removal (`DELETE /api/auth/purchased/:noteId`)
- Users can remove any note from their library via the red trash/close button.
- Frontend dispatches `DELETE` request with JWT header; backend pulls the note reference from `user.purchasedNotes` and returns the updated library.

### 2.3 Client-Side State Synchronization
- `cart`: Stored in `localStorage.getItem("cart")`. Syncs with header cart count badge.
- `currentUser`: Stored in `localStorage.getItem("currentUser")` with `authToken`.
- `appliedDiscount`: Persisted coupon state (`NEW10`, `STUDENT20`, `BUNDLE15`).
- `userNotes`: Local storage cache for instant offline note browsing.
- `downloads`: Local offline PDF references.

---

## 3. Known Pitfalls & Solutions
- **Netlify Pretty URLs:** Netlify strips `.html` from endpoints (e.g. `/cart.html` becomes `/cart`). The frontend normalizes URL detection via `window.location.pathname.split("/").filter(Boolean).pop().replace(".html", "")`.
- **Browser Caching:** HTML files import scripts with version query parameters (`script.js?v=4`).
- **Serverless DB Connection:** Netlify functions reuse Mongoose connections through an Express async middleware (`app.use(async (req, res, next) => { await connectDB(); next(); })`).
