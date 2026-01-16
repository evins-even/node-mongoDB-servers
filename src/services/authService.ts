import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { AuthModel } from "../models/Auth";
import { UserModel } from "../models/User";
import generateTokens from "../utils/generateTokens";

/**
 * 认证服务
 * 职责：处理所有认证相关的业务逻辑
 */
class AuthService {
  /**
   * 用户登录
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @returns 返回用户信息和 Token
   */
  async login(email: string, password: string) {
    // 1. 查找用户
    const auth = await AuthModel.findOne({ email });
    
    if (!auth) {
      throw new Error("邮箱或密码错误");
    }

    // 2. 检查账户是否被锁定
    if (auth.lockUntil && auth.lockUntil > new Date()) {
      const remainingTime = Math.ceil(
        (auth.lockUntil.getTime() - Date.now()) / 1000 / 60
      );
      throw new Error(`账户已被锁定，请在 ${remainingTime} 分钟后重试`);
    }

    // 3. 验证密码
    const isPasswordValid = await bcrypt.compare(password, auth.passwordHash);

    if (!isPasswordValid) {
      // 密码错误，增加失败次数
      auth.loginAttempts += 1;

      // 如果失败次数达到 5 次，锁定账户 30 分钟
      if (auth.loginAttempts >= 5) {
        auth.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        await auth.save();
        throw new Error("登录失败次数过多，账户已被锁定 30 分钟");
      }

      await auth.save();
      throw new Error("邮箱或密码错误");
    }

    // 4. 密码正确，重置登录失败次数
    auth.loginAttempts = 0;
    auth.lockUntil = undefined;
    await auth.save();

    // 5. 生成 Token
    const { accessToken, refreshToken } = generateTokens({
      uuid: auth.uuid,
      userName: auth.userName,
    });

    // 6. 返回用户信息和 Token
    return {
      userName: auth.userName,
      uuid: auth.uuid,
      email: auth.email,
      role: auth.role,
      token: accessToken,
      refreshToken: refreshToken,
    };
  }

  /**
   * 用户注册
   * @param userName - 用户名
   * @param email - 邮箱
   * @param password - 密码
   */
  async register(userName: string, email: string, password: string) {
    // 1. 检查用户名是否已存在
    const existingUserByName = await AuthModel.findOne({ userName });
    if (existingUserByName) {
      throw new Error("用户名已被注册");
    }

    // 2. 检查邮箱是否已存在
    const existingUserByEmail = await AuthModel.findOne({ email });
    if (existingUserByEmail) {
      throw new Error("邮箱已被注册");
    }

    // 3. 生成唯一 UUID
    const uuid = uuidv4();

    // 4. 加密密码
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. 创建认证记录
    const auth = new AuthModel({
      uuid,
      userName,
      email,
      passwordHash,
      role: "user",
      loginAttempts: 0,
    });

    try {
      await auth.save();
    } catch (error) {
      throw new Error("创建认证记录失败");
    }

    // 6. 创建用户资料
    try {
      const user = new UserModel({
        uuid,
        nickname: userName, // 初始昵称设为用户名
        bio: "",
        social: {
          github: "",
          twitter: "",
          website: "",
        },
      });

      await user.save();

      // 7. 返回结果（不包含密码）
      return {
        userName: auth.userName,
        email: auth.email,
        uuid: auth.uuid,
        profile: {
          uuid: user.uuid,
          nickname: user.nickname,
        },
      };
    } catch (error) {
      // 如果创建用户资料失败，回滚删除认证记录
      await AuthModel.findOneAndDelete({ uuid });
      throw new Error("创建用户资料失败");
    }
  }

  /**
   * 获取用户信息
   * @param uuid - 用户 UUID
   */
  async getUserInfo(uuid: string) {
    const auth = await AuthModel.findOne({ uuid }).select("-passwordHash");
    const user = await UserModel.findOne({ uuid });

    if (!auth) {
      throw new Error("用户不存在");
    }

    return {
      auth: {
        uuid: auth.uuid,
        userName: auth.userName,
        email: auth.email,
        role: auth.role,
      },
      profile: user || null,
    };
  }
}

export default AuthService;
