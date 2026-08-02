# cohort-9-mern-16508-muhammad
Cohort 9 — MERN (NodeJS+ReactJS) assignment for Muhammad Saad Bin Khalid

## Completed Basic Setup 
- Frontend: 
	- Initialized ReactJS app using Vite and cleaned up the default files.
	- Created a landing page to display the basic information of the application with Sign In and Sign Up buttons.
	- Created a Background Layout component to display the background of the application.
	- Created Sign In and Sign Up pages with validation using React Hook Form and Zod.

- Backend:
	- Initialized Express server (`app.ts`) with CORS, TypeScript strict type checking, and TSDoc documentation.
	- Implemented standardized API response utilities and centralized error-handling middleware for 404 & application errors.
	- Developed request validation middleware powered by Zod schemas.
	- Created authentication models, services, controllers, and routes for sign-in and sign-up endpoints.
	- Added JWT-based auth with rotating refresh tokens, httpOnly cookies, logout, and account deletion support.
	- Integrated Drizzle ORM with Neon PostgreSQL for user and refresh-token persistence, plus DB scripts and studio setup.
	- Added backend integration tests and API request samples for the auth flow.

## Getting Started

### Prerequisites
- **[Node.js](https://nodejs.org/)** 
- **`npm`**

### 1. Running the Backend
Navigate to the `backend` directory, install dependencies, set up the env file, and start the development server:
```bash
cd backend
npm install
npm run db:migrate
npm run dev
```

Create a local `.env` (for ./backend) from `backend/.env.example` before running the app. The backend reads the following values:

```env
DATABASE_URL=
BACKEND_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
JWT_ACCESS_TOKEN_SECRET=
JWT_REFRESH_TOKEN_SECRET=
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d
JWT_REFRESH_TOKEN_MAX_AGE_MS=604800000
```

Drizzle ORM uses `DATABASE_URL` (PostgreSQL) for schema generation and migrations.

Useful backend DB commands:
```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

Run `db:generate` after schema changes, then `db:migrate` to apply the generated migration.

### 2. Running the Frontend
In a new terminal window, navigate to the `frontend` directory, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
Open the browser at `http://localhost:5173` (or the printed URL in your terminal).t `http://localhost:5173` (or the printed URL in your terminal).