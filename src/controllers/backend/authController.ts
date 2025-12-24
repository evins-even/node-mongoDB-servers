import { Request, Response } from "express";
import { AuthService } from "../../services/authService";
import generateTokens from "../../utils/generateTokens";
export const authController = {
  // 注册新用户
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userName, email, password } = req.body;
      const userData = { userName, email, password };
      const user = await AuthService.registerUser(userData);
      if (!user) {
        res.status(400).json({ error: "Failed to create user" });
        return;
      }
      res.status(201).json({ message: "User created successfully", userName });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  // 用户登录
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userName, email, password } = req.body;
      // 验证登录 
      const LoginMessage = await AuthService.authenticateUser(email, password);
      if (!LoginMessage.isPass) {
        res.status(401).json({ error: "邮箱或密码错误" });
        return;
      }
      // 生成JWT 
      const token = generateTokens({ userName, uuid: LoginMessage.uuid })
      res.status(200).json({
        message: "Login successful",
        userName: userName,
        success: true,
        token: token.accessToken,
        refreshToken: token.refreshToken,
      });
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  },
};
