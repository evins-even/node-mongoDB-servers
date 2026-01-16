import { Router } from "express";
import { authController } from "../../controllers/backend/authController";

const authRoutes = Router();

/**
 * @swagger
 * /api/backend/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: 用户登录
 *     description: 使用邮箱和密码登录，返回 JWT Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 注册时使用的邮箱
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 登录密码
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 登录成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     userName:
 *                       type: string
 *                       example: john
 *                     uuid:
 *                       type: string
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                 token:
 *                   type: string
 *                   description: JWT 访问令牌
 *                 refreshToken:
 *                   type: string
 *                   description: JWT 刷新令牌
 *       401:
 *         description: 邮箱或密码错误
 *       423:
 *         description: 账户已锁定
 */
authRoutes.post("/login", authController.login);

/**
 * @swagger
 * /api/backend/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: 用户注册
 *     description: 创建新用户账号
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 description: 用户名（3-20个字符）
 *                 example: john
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 密码（至少6位）
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: 注册成功
 *       409:
 *         description: 用户名或邮箱已存在
 */
authRoutes.post("/register", authController.register);

/**
 * @swagger
 * /api/backend/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: 用户登出
 *     responses:
 *       200:
 *         description: 登出成功
 */
authRoutes.post("/logout", authController.logout);

export default authRoutes;