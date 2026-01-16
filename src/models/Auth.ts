import mongoose, { Document, Schema } from "mongoose";

/**
 * 认证用户接口
 */
export interface IAuth extends Document {
  uuid: string;              // 唯一标识（用于关联 User 表）
  userName: string;          // 用户名
  email: string;             // 邮箱
  passwordHash: string;      // 加密后的密码
  role: "user" | "admin";    // 角色
  loginAttempts: number;     // 登录失败次数
  lockUntil?: Date;          // 锁定到期时间
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 认证用户 Schema
 */
const AuthSchema = new Schema<IAuth>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
  }
);

// 创建索引以提高查询性能
AuthSchema.index({ email: 1 });
AuthSchema.index({ userName: 1 });
AuthSchema.index({ uuid: 1 });

/**
 * 导出模型
 */
export const AuthModel = mongoose.model<IAuth>("AuthenticateUser", AuthSchema);

