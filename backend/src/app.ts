import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRouter from "./routes/index.ts";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.ts";
import helmet from "helmet";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const corsOptions = {
	origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
	credentials: true,
};

app.use(helmet())

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/api", apiRouter);


app.use(notFoundHandler);
app.use(errorHandler);


const PORT = process.env.PORT ?? "3000";

if (process.env.NODE_ENV !== "test") {
	app.listen(PORT, () => {
		console.log(`Server running at BACKEND_URL : ${process.env.BACKEND_URL}`);
	});
}

export default app;