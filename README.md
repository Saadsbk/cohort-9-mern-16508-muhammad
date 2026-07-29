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

## Getting Started

### Prerequisites
- **[Node.js](https://nodejs.org/)** 
- **`npm`**

### 1. Running the Backend
Navigate to the `backend` directory, install dependencies, and start the development server:
```bash
cd backend
npm install
npm run dev
```

### 2. Running the Frontend
In a new terminal window, navigate to the `frontend` directory, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
Open the browser at `http://localhost:5173` (or the printed URL in your terminal).