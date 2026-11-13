# Taskbook – To-Do List (Node.js + Express + MongoDB + React)

Full-stack To-Do List app.

- `backend/` – REST API (Node.js, Express.js, MongoDB/Mongoose), organised as routes → controllers → services → model
- `frontend/` – React (Vite) UI using Axios

## Features
Create, list, edit and delete tasks, change status (pending / in-progress / completed), search by title or description, filter by status, priority and due date, loading indicators and friendly error messages.

## API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/tasks?search=&status=&priority=&page=&limit=` | List / search / filter tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update task details |
| PATCH | `/tasks/:id/status` | Update status only (`{ "status": "completed" }`) |
| DELETE | `/tasks/:id` | Delete a task |

Task fields: `title` (required, max 120), `description` (max 500), `status`, `priority` (`low|medium|high`), `dueDate`.

Errors return `{ "success": false, "message": "...", "errors": [...] }` with proper status codes (400 validation, 404 not found, 500 server).

## Run locally

Requirements: Node.js 18+, MongoDB running locally or a MongoDB Atlas URI.

### Backend
```bash
cd backend
npm install
cp .env.example .env     # then edit values
npm run dev              # or npm start
```

`backend/.env`
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/todo_app
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173

`frontend/.env`

VITE_API_URL=http://localhost:5000/api

## Testing with Postman
Import `postman_collection.json`. Create a task first, copy its `_id` into the `taskId` collection variable, then run the other requests.

## Deployment

**Backend on Render**
1. Push this repo to GitHub.
2. New → Web Service → select repo, Root Directory `backend`.
3. Build command `npm install`, start command `npm start`.
4. Environment variables: `MONGO_URI` (MongoDB Atlas connection string), `CLIENT_ORIGIN` (your Netlify URL, e.g. `https://your-app.netlify.app`).
5. In Atlas, allow network access from `0.0.0.0/0` (or Render's IPs).

**Frontend on Netlify**
1. New site from Git → select repo, Base directory `frontend`.
2. Build command `npm run build`, publish directory `dist` (also set in `netlify.toml`).
3. Environment variable: `VITE_API_URL=https://<your-render-service>.onrender.com/api`
4. Deploy. Then update `CLIENT_ORIGIN` on Render with the final Netlify URL.

## Challenges and decisions
- **CORS between two hosts:** the API reads allowed origins from `CLIENT_ORIGIN`, so the same code works locally and in production.
- **Searching on every keystroke:** the search box is debounced (300 ms) to avoid flooding the API.
- **Safe search:** user input is regex-escaped before querying MongoDB.
- **Consistent errors:** one error-handling middleware converts Mongoose validation/cast errors and bad JSON into clean 400 responses; the frontend turns these into readable messages with a Retry option.
- **State:** a custom `useTasks` hook holds tasks, loading, error, search and filter state with `useState`, and updates the list immediately after each successful API call.
- **Render free tier:** the server sleeps when idle, so the first request can take ~30 s; the UI shows a loader meanwhile.
