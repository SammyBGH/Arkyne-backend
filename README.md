# Arkyne Backend

Simple Node + Express + MongoDB API for the Arkyne website. It powers:

- `POST /api/contact` – contact form submissions
- `POST /api/newsletter` – newsletter sign-ups

No secrets are stored in this repo. Configure everything via environment variables.

---

## Quick start

- Install
  ```bash
  npm install
  ```
- Run (dev)
  ```bash
  npm run dev
  ```
- Run (prod)
## Environment

Create `backend/.env`
```
PORT
MONGO_URI
# Brevo (Sendinblue) HTTP API for transactional emails
BREVO_API_KEY=YOUR_BREVO_API_KEY
FROM_EMAIL=Arkyne <no-reply@yourdomain.com>
```
---

## Scripts
- `npm start` – node server

---

## Project structure
```
backend/
  server.js
  routes/newsletter.js
  routes/contact.js
  models/Subscriber.js
  package.json
  .env
```
---


## Deploy notes

- Set `MONGO_URI` in your hosting provider secrets.
- If the backend is hosted separately, set `VITE_BACKEND_URL` in the frontend so it can reach `/api/*`.

---

## Local dev with frontend

- Frontend dev server proxies `/api` to `http://localhost:5001`.
- Start both:
  - `cd backend && npm run dev`
  - `cd frontend && npm run dev`

---

MIT © Arkyne
