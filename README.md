# PlaceFlow — Centralized Placement Management & Eligibility Platform

A MERN stack (MongoDB, Express, React, Node.js) implementation of a centralized
placement management platform with an automated eligibility engine, built around
the problem statement: replacing scattered WhatsApp placement announcements with
a role-based, policy-aware system.

## What's inside

```
placement-platform/
├── backend/          Express + MongoDB API (JWT auth, eligibility engine)
└── frontend/          React (Vite) app with Student / TNP Cell / Admin dashboards
```

### Core features
- **Role-based accounts**: Student, TNP Cell, Admin — each with its own dashboard.
- **Eligibility Engine** (`backend/utils/eligibilityEngine.js`): automatically
  evaluates a student's category (CAT1/CAT2/CAT3), existing accepted offers,
  AEDP lockout, and drive deadlines before allowing them to open the official
  Google Form.
- **Students never apply inside PlaceFlow** — the app only verifies eligibility
  and redirects to the TNP Cell's real Google Form, exactly as in your spec.
- **TNP Cell**: create/publish drives (band auto-derived from CTC), track who
  checked eligibility, record real outcomes (Selected/Rejected/etc.), see
  analytics.
- **Admin**: configure CTC band thresholds and category→band eligibility rules
  live (no code changes needed), manage TNP/Admin staff accounts.

---

## 1. Prerequisites

Install these on your system first:

- **Node.js** v18 or newer — https://nodejs.org (includes npm)
- **MongoDB** — either:
  - Install locally: https://www.mongodb.com/docs/manual/installation/, or
  - Use a free cloud database at https://www.mongodb.com/cloud/atlas (easiest —
    no local install, just copy a connection string)

Check you have Node and npm:
```bash
node -v
npm -v
```

---

## 2. Get the code onto your system

1. Download the zip Claude gave you and extract it anywhere, e.g. `~/placement-platform`.
2. Open a terminal and `cd` into that folder.

(If you'd rather use git: `git init`, commit this folder, and push it to your
own GitHub repo — totally optional, just for backup/version control.)

---

## 3. Set up the backend

```bash
cd placement-platform/backend
npm install
cp .env.example .env
```

Now open `.env` in any text editor and fill in:

- `MONGO_URI` — either `mongodb://127.0.0.1:27017/placeflow` (local MongoDB)
  or your Atlas connection string (looks like
  `mongodb+srv://user:pass@cluster.mongodb.net/placeflow`)
- `JWT_SECRET` — replace with any long random string (you can generate one with
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

If you're using local MongoDB, make sure it's running:
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows: MongoDB usually runs as a service automatically after install,
# or run "mongod" from the install directory
```

Seed the database with demo accounts and sample drives:
```bash
npm run seed
```

This creates:
| Role    | Email                | Password    |
|---------|-----------------------|-------------|
| Admin   | admin@placeflow.edu   | Admin@123   |
| TNP     | tnp@placeflow.edu     | Tnp@1234    |
| Student | aditi@student.edu     | Student@123 (CAT1) |
| Student | rohan@student.edu     | Student@123 (CAT2) |
| Student | priya@student.edu     | Student@123 (CAT3) |

Start the backend:
```bash
npm run dev
```
You should see `[server] PlaceFlow backend running on port 5000`.
Leave this terminal window running.

---

## 4. Set up the frontend

Open a **second terminal window** (keep the backend running in the first):

```bash
cd placement-platform/frontend
npm install
npm run dev
```

This starts the React app at **http://localhost:5173**. The Vite dev server is
already configured to proxy `/api` requests to your backend on port 5000, so
no extra config is needed.

---

## 5. Try it out

1. Open http://localhost:5173 in your browser.
2. Log in as a student (e.g. `rohan@student.edu` / `Student@123` — CAT2) and
   browse drives — you'll see live eligibility results, including the "already
   have a Dream offer" and "CAT2 can't apply to Super Dream" scenarios from
   your original spec.
3. Log in as TNP (`tnp@placeflow.edu` / `Tnp@1234`) to create new drives, publish
   them, and mark outcomes.
4. Log in as Admin (`admin@placeflow.edu` / `Admin@123`) to tweak the CTC
   band thresholds or which categories can apply to which bands — changes
   apply instantly, platform-wide.

---

## 6. Common issues

- **"Failed to load drives" / network errors** — make sure the backend
  terminal is still running and didn't crash (check for MongoDB connection
  errors in that terminal).
- **MongoDB connection refused** — MongoDB isn't running, or your `MONGO_URI`
  is wrong. If using Atlas, make sure you added your current IP to Atlas's
  Network Access allowlist.
- **Port already in use** — change `PORT` in `backend/.env`, and update the
  proxy target in `frontend/vite.config.js` to match.
- **CORS errors in the browser console** — check `CLIENT_ORIGIN` in
  `backend/.env` matches the URL you're opening the frontend at
  (default `http://localhost:5173`).

---

## 7. Where to look if you want to extend it

- Eligibility rules: `backend/utils/eligibilityEngine.js` + `backend/models/Policy.js`
- Add a new field to student profiles: `backend/models/User.js`
- Add a new API route: create a controller in `backend/controllers/`, wire it
  up in `backend/routes/`, and register it in `backend/server.js`
- New frontend page: add a `.jsx` file under `frontend/src/pages/<role>/` and
  register the route in `frontend/src/App.jsx`

---

## 8. Deploying (optional, once it works locally)

- **Backend**: any Node host (Render, Railway, Fly.io, a VPS) — set the same
  environment variables as your `.env`.
- **Frontend**: `npm run build` produces a static `dist/` folder you can host
  on Vercel, Netlify, or any static host. Point its API calls at your deployed
  backend URL instead of the local proxy (update `baseURL` in
  `frontend/src/api/axios.js`).
- **Database**: MongoDB Atlas free tier works fine for a college project.
