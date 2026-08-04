import { Router } from "express";
import { signInController, signUpController, refreshTokenController, logoutController, deleteUserController } from "../controllers/auth.controller.ts";
import { validateBody } from "../middlewares/validation.middleware.ts";
import { signInSchema, signUpSchema } from "../models/auth.model.ts";

const router = Router();

router.post("/sign-in", validateBody(signInSchema), signInController);
router.post("/sign-up", validateBody(signUpSchema), signUpController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);
router.delete("/delete-user", deleteUserController);

export default router;