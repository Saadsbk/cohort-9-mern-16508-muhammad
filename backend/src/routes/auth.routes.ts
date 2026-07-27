import { Router } from "express";
import { signInController, signUpController } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import { signInSchema, signUpSchema } from "../models/auth.model.js";

const router = Router();

router.post("/sign-in", validateBody(signInSchema), signInController);
router.post("/sign-up", validateBody(signUpSchema), signUpController);

export default router;