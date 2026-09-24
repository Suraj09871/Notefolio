# NoteFolio Engineering Rules & Standards

## 1. Codebase Architecture Rules
1. **Frontend Purity:** All frontend code must use **pure HTML5, CSS3, and modern Vanilla ES6+ JavaScript**. Do not introduce heavy frontend frameworks (React, Next.js, Angular, Vue) into the client directory.
2. **Backend Modularity:** The backend is organized into standard Express MVC:
   - `server/app.js`: Application definition and middleware stack (reusable for both server and serverless functions).
   - `server/index.js`: Server runner for local development and Render.
   - `server/routes/`: Route declarations.
   - `server/controllers/`: Business logic and database interactions.
   - `server/models/`: Mongoose schemas.
   - `server/middleware/`: Auth verification, error handling, upload parsing.
3. **Serverless Compatibility:** Any new middleware or database logic must remain non-blocking and account for Lambda/Netlify Function stateless execution.

---

## 2. Security & Secrets Management Rules
1. **No Secrets in Version Control:** Never commit `.env` files or API secrets into GitHub. Always supply `.env.example` as a reference.
2. **Graceful Fallbacks:** For development and demo purposes, non-sensitive fallback defaults must allow the application to boot without crashing if specific third-party credentials are temporarily unset.
3. **Role Enforcement:** All admin routes (`/api/admin/*`, `/api/notes` POST/DELETE, `/api/users/*`) must validate JWT tokens and user roles before executing operations.
4. **Content DRM:** PDF assets must be served with appropriate CORS headers and protected against unauthorized direct hotlinking or automated scraping.

---

## 3. Git & Deployment Standards
1. **Clean Repository:** Ensure `.gitignore` explicitly excludes `node_modules/`, `.env*`, `.DS_Store`, and temporary build outputs.
2. **Render Configuration:** `render.yaml` must specify `buildCommand: npm install` and `startCommand: npm start`.
3. **Netlify Configuration:** `netlify.toml` must define `publish = "."`, `functions = "netlify/functions"`, and the `/api/*` redirect rule.
4. **Cache Invalidation:** Any updates to `script.js` or `styles.css` should increment the version query parameter (e.g. `script.js?v=4`) across all HTML files.
