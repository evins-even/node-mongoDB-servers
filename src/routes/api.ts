import { Router } from "express";
import userRoutes from "./users";
import authRoutes from "./auth";

const router = Router();

// 挂载子路由
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

// API 信息
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

export default router;
