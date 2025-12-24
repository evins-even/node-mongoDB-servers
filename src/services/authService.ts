import bcrypt from "bcryptjs";
import { AuthenticateUser, AuthModel } from "../models/Auth";
import generateTokens from "../utils/generateTokens";

type passMes = {
  isPass: boolean
  uuid: string
}

export class AuthService {
  static async authenticateUser(
    email: string,
    password: string
  ): Promise<passMes> {
    // Implement authentication logic here
    const user = await AuthModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPass = await user.comparePasswords(password);
    return {
      isPass: isPass,
      uuid: user.uuid,
    };
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
