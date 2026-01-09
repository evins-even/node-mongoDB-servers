import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/database";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import apiRoutes from "./routes/api";
import dotenv from "dotenv";
dotenv.config();

// 连接数据库
connectDB();
const app = express();

// 中间件
app.use(helmet()); // 安全头部
app.use(cors()); // 跨域支持 允许所有来源

// 启用 CORS - 允许前端端口 3000 访问
/* app.use(cors({
  origin: 'http://localhost:3001', // 前端地址
  credentials: true // 如果需要发送 cookies
})); */
app.use(morgan("combined")); // 请求日志
app.use(express.json({ limit: "10mb" })); // JSON 解析
app.use(express.urlencoded({ extended: true })); // URL 编码解析

// Swagger 文档
setupSwagger(app);

// 路由
app.use("/api", apiRoutes);

// 健康检查端点
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 处理
app.use(notFound);

// 错误处理
app.use(errorHandler);

export default app;
