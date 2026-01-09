import { Router } from "express";
import { authController } from "../../controllers/backend/authController";
const auth = Router();
// 登录 - POST /api/backend/auth/Login
auth.post("/login", authController.login);

export default auth;