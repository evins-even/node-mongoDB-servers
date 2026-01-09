import { Request, Response, NextFunction } from "express"

// 思考：一个认证 Controller 应该有哪些方法？
class AuthController {
    // 1. 登录 - 对应 POST /api/backend/auth/login
    login = async (req: Request, res: Response, next: NextFunction) => {
        // TODO: 你来实现
        // 提示：
        // - 从 req.body 获取 email 和 password
        const { email, password } = req.body;
        // - 调用 authService.login()
        // - 返回 token
    }

    // 2. 登出 - 对应 POST /api/backend/auth/logout
    logout = async (req: Request, res: Response, next: NextFunction) => {
        // TODO: 你来实现
    }

    // 3. 刷新 Token - 对应 POST /api/backend/auth/refresh
    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        // TODO: 你来实现
    }

    // 4. 获取当前用户信息 - 对应 GET /api/backend/auth/profile
    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        // TODO: 你来实现
    }

    // 5. 更新个人资料 - 对应 PUT /api/backend/auth/profile
    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        // TODO: 你来实现
    }
}
// 导出实例，供路由使用
export const authController = new AuthController();
