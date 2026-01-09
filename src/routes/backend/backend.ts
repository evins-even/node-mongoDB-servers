import { Router } from "express";
import auth from "./auth";

const backend = Router();
// 认证相关路由
backend.use("/auth", auth);

export default backend;