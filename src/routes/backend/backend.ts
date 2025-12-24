import { Router } from "express";
import userRoutes from "./users";
import authRoutes from "./auth";
const backend = Router();

// 登录注册
backend.use("/auth", authRoutes);

// 用户信息
backend.use("/user", userRoutes);

export default backend;