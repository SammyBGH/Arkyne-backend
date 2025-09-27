# Arkyn Backend (Node + Express + MongoDB)

This backend provides simple endpoints for the Arkyn website:

- `POST /api/contact` – logs contact form submissions
- `POST /api/newsletter` – saves newsletter subscriptions

It uses Express, Mongoose, and `.env` configuration.

## Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)

## Setup
```bash
npm install
cp .env.example .env   # if provided; otherwise create .env using the template below
npm run dev            # start with nodemon (development)
# or
npm start              # start with node (production)
```

## Environment Variables
Create `backend/.env`:
```
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
```

## Scripts
- `npm run dev` – start server with nodemon
- `npm start` – start server with node

## Project Structure
```
backend/
  server.js              # Express app, mounts routes
  routes/newsletter.js   # Newsletter POST endpoint
  models/Subscriber.js   # Mongoose model for newsletter subscribers
  routes/contact.js      # Contact POST endpoint (if separated)
  package.json
  .env
```

## API

### POST /api/newsletter
Request body:
```json
{ "email": "user@example.com", "source": "footer-newsletter" }
```
Response:
```json
{ "ok": true }
```

### POST /api/contact
Request body:
```json
{ "name": "John", "email": "john@example.com", "message": "Hi!", "source": "contact-form" }
```
Response:
```json
{ "ok": true }
```

## Deployment Notes
- Set `MONGO_URI` in your hosting provider secrets.
- If deploying separately from the frontend, set `VITE_BACKEND_URL` on the frontend to your backend URL so the site can call `/api/*` in production.

## Local Development with Frontend
- Frontend dev server proxies `/api` to `http://localhost:5001` (configured in `frontend/vite.config.js`).
- Start both servers:
  - `cd backend && npm run dev`
  - `cd frontend && npm run dev`

## License
MIT © Arkyn
