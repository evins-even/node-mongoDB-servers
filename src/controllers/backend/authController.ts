import { Request, Response, NextFunction } from "express";
import AuthService from "../../services/authService";
import { successResponse, errorResponse } from "../../utils/apiResponse";

/**
 * 认证控制器
 * 职责：处理 HTTP 请求和响应，调用 Service 层处理业务逻辑
 */
class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * 用户登录
   * POST /api/backend/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. 获取参数
      const { email, password } = req.body;

      // 2. 参数验证
      if (!email || !password) {
        errorResponse(res, "邮箱和密码为必填项", 400);
        return;
      }

      // 3. 调用 Service 层处理登录逻辑
      const result = await this.authService.login(email, password);

      // 4. 返回成功响应
      successResponse(
        res,
        {
          userName: result.userName,
          uuid: result.uuid,
          email: result.email,
          role: result.role,
          token: result.token,
          refreshToken: result.refreshToken,
        },
        "登录成功",
        200
      );
    } catch (error: any) {
      // 5. 错误处理
      if (error.message.includes("邮箱或密码错误")) {
        errorResponse(res, error.message, 401);
        return;
      }

      if (error.message.includes("锁定")) {
        errorResponse(res, error.message, 423);
        return;
      }

      // 其他错误传递给错误处理中间件
      next(error);
    }
  };

  /**
   * 用户注册
   * POST /api/backend/auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userName, email, password } = req.body;

      // 参数验证
      if (!userName || !email || !password) {
        errorResponse(res, "用户名、邮箱和密码为必填项", 400);
        return;
      }

      // 密码长度验证
      if (password.length < 6) {
        errorResponse(res, "密码长度至少为 6 位", 400);
        return;
      }

      // 调用 Service 层处理业务逻辑
      const result = await this.authService.register(userName, email, password);

      // 返回成功响应
      successResponse(res, result, "注册成功", 201);
    } catch (error: any) {
      // 处理特定错误
      if (error.message.includes("已存在") || error.message.includes("已被注册")) {
        errorResponse(res, error.message, 409);
        return;
      }

      // 其他错误传递给错误处理中间件
      next(error);
    }
  };

  /**
   * 登出
   * POST /api/backend/auth/logout
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // JWT 是无状态的，登出只需要前端删除 token
      successResponse(res, null, "登出成功", 200);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取当前用户信息
   * GET /api/backend/auth/profile
   * 需要认证
   */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 从 JWT 中间件获取用户信息（假设中间件已经验证并添加到 req.user）
      const userId = (req as any).user?.uuid;

      if (!userId) {
        errorResponse(res, "未登录", 401);
        return;
      }

      const user = await this.authService.getUserInfo(userId);

      successResponse(res, user, "获取成功", 200);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 刷新 Token
   * POST /api/backend/auth/refresh
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        errorResponse(res, "refreshToken 为必填项", 400);
        return;
      }

      // TODO: 实现 refreshToken 逻辑
      successResponse(res, null, "Token 刷新成功", 200);
    } catch (error: any) {
      next(error);
    }
  };
}

// 导出实例，供路由使用
export const authController = new AuthController();
