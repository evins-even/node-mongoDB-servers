
import { Request, Response } from "express";
import { UserService } from "../../services/userService";

export const userController = {
  // 创建用户
  createUser: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('req.body:', req.body);
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // 获取所有用户
  getUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await UserService.getUsers();
      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "获取用户列表失败",
      });
    }
  },

  // 根据ID获取用户
  getUserById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "缺少用户ID",
        });
        return;
      }
      const user = await UserService.getUserById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "用户不存在",
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "获取用户失败",
      });
    }
  },

  // 更新用户
  updateUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "缺少用户ID",
        });
        return;
      }
      const user = await UserService.updateUser(id, req.body);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "用户不存在",
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // 删除用户
  deleteUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "缺少用户ID",
        });
        return;
      }
      await UserService.deleteUser(id);
      res.status(200).json({
        success: true,
        message: "用户删除成功",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "删除用户失败",
      });
    }
  },
};
