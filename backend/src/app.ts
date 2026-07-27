import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRouter from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

const corsOptions = {
	origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", apiRouter);


app.use(notFoundHandler);
app.use(errorHandler);


const PORT = process.env.PORT ?? "3000";

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});