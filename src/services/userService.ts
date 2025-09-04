import { User, IUser } from "../models/user";

export class UserService {
  // 创建用户
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData);
      console.log("userss",userData)
      return await user.save();
    } catch (error: any) {
      throw new Error(`创建用户失败: ${error.message}`);
    }
  }

  // 获取所有用户
  static async getUsers(): Promise<IUser[]> {
    return await User.find().sort({ createdAt: -1 });
  }

  // 根据ID获取用户
  static async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  // 更新用户
  static async updateUser(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // 删除用户
  static async deleteUser(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }

  // 获取成年用户
  static async getAdultUsers(): Promise<IUser[]> {
    return await User.find({ age: { $gte: 18 } });
  }
}
