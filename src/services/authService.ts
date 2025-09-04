import bcrypt from "bcryptjs";
import { AuthenticateUser, AuthModel } from "../models/Auth";

export class AuthService {
  static async authenticateUser(
    email: string,
    password: string
  ): Promise<boolean> {
    // Implement authentication logic here
    const user = await AuthModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPass = await user.comparePasswords(password);
    if (!isPass) {
      throw new Error("Invalid password");
    }
    return true;
  }
  static async registerUser(userMes: {
    userName: string;
    email: string;
    password: string;
  }): Promise<AuthenticateUser> {
    try {
      // Implement registration logic here
      const hashPassWord = await bcrypt.hash(userMes.password, 10);
      const user = new AuthModel({ ...userMes, passwordHash: hashPassWord });
      console.log(user);
      return await user.save();
    } catch (error: any) {
      throw new Error(`注册失败: ${error.message}`);
    }
  }
}
