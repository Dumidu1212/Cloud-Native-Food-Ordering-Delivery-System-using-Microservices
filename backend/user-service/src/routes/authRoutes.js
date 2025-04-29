import { Router } from "express";
import { registerUser, loginController, meController } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

//register user

router.post("/register", registerUser);

//login user

router.post("/login", loginController);

router.get("/me", verifyToken, meController);

export default router;