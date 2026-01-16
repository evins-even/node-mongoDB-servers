import { Request, Response, NextFunction } from "express";
import AuthService from "../../services/authService";

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
        res.status(400).json({
          success: false,
          error: "邮箱和密码为必填项",
        });
        return;
      }

      // 3. 调用 Service 层处理登录逻辑
      const result = await this.authService.login(email, password);

      // 4. 返回成功响应
      res.status(200).json({
        success: true,
        message: "登录成功",
        data: {
          userName: result.userName,
          uuid: result.uuid,
          email: result.email,
          role: result.role,
        },
        token: result.token,
        refreshToken: result.refreshToken,
      });
    } catch (error: any) {
      // 5. 错误处理
      if (error.message.includes("邮箱或密码错误")) {
        res.status(401).json({
          success: false,
          error: error.message,
        });
        return;
      }

      if (error.message.includes("锁定")) {
        res.status(423).json({
          success: false,
          error: error.message,
        });
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
        res.status(400).json({
          success: false,
          error: "用户名、邮箱和密码为必填项",
        });
        return;
      }

      // 密码长度验证
      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: "密码长度至少为 6 位",
        });
        return;
      }

      // 调用 Service 层处理业务逻辑
      const result = await this.authService.register(userName, email, password);

      // 返回成功响应
      res.status(201).json({
        success: true,
        message: "注册成功",
        data: result,
      });
    } catch (error: any) {
      // 处理特定错误
      if (error.message.includes("已存在") || error.message.includes("已被注册")) {
        res.status(409).json({
          success: false,
          error: error.message,
        });
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
      res.status(200).json({
        success: true,
        message: "登出成功",
      });
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
        res.status(401).json({
          success: false,
          error: "未登录",
        });
        return;
      }

      const user = await this.authService.getUserInfo(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
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
        res.status(400).json({
          success: false,
          error: "refreshToken 为必填项",
        });
        return;
      }

      // TODO: 实现 refreshToken 逻辑
      res.status(200).json({
        success: true,
        message: "Token 刷新成功",
      });
    } catch (error: any) {
      next(error);
    }
  };
}

// 导出实例，供路由使用
export const authController = new AuthController();
