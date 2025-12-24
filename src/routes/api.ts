import { Router } from "express";
import userRoutes from "./backend/users";
import backend from "./backend/backend";

const router = Router();

// 前台路由 (Frontend routes)
router.use("/frontend", userRoutes);

// 后台路由 (Backend routes) 
router.use("/backend", backend);

// API 信息
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

export default router;