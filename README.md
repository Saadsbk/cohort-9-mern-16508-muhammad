# cohort-9-mern-16508-muhammad
Cohort 9 — MERN (NodeJS+ReactJS) assignment for Muhammad Saad Bin Khalid

## Completed Basic Setup 
- Frontend: 
	- Initialized ReactJS app using Vite and cleaned up the default boilerplate files.
	- Created a landing page to display basic application information with Sign In and Sign Up navigation buttons.
	- Created a reusable Background Layout component for themed/glassmorphic pages.
	- Created Sign In and Sign Up pages with form validation using React Hook Form and Zod.
	- Customized CSS variables and design tokens using [tweakcn.com](https://tweakcn.com/).
	- Utilized an in-memory Zustand store to hold accessToken and user state securely.
	- Established connection with the backend for silent session restoration and accessToken re-fetching via refresh tokens in httpOnly cookies.
	- Built Home Dashboard with responsive layout, smart user navigation, and theme toggling (Light/Dark mode).
	- Integrated URL query parameter search (`?search=...`) for note title filtering with shareable & persisted URLs.
	- Developed `NotesCard` component and `NotesCardPopover` menu for note renaming and deletion.
	- Implemented instant inline theme initialization script in `index.html` to eliminate theme flicker on page load/refresh.

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
Create a local `.env` (in `./backend`) from `backend/.env.example` first. The backend reads the following values:

```env
DATABASE_URL=
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
JWT_ACCESS_TOKEN_SECRET=
JWT_REFRESH_TOKEN_SECRET=
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d
JWT_REFRESH_TOKEN_MAX_AGE_MS=604800000
```

Then navigate to the `backend` directory, install dependencies, apply migrations, and start the development server:
```bash
cd backend
npm install
npm run db:migrate
npm run dev
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
Open the browser at `http://localhost:5173` (or the printed URL in your terminal).