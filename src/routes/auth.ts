import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

router.post("/LoginAuther", authController.login);
router.post("/Register", authController.register);
export default router;
