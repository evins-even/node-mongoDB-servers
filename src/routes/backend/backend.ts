import { Router } from "express";
import authRoutes from "./auth";

const backend = Router();

// 认证相关路由
backend.use("/auth", authRoutes);

export default backend;