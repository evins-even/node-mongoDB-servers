import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { randomUUID } from 'crypto';
// 1. 定义文档接口
export interface AuthenticateUser extends Document {
  uuid: string;
  userName: string;
  email: string;
  passwordHash: string;
  role: string;
  loginAttempts: number;
  lockUntil: Date;
  comparePasswords: (password: string) => Promise<boolean>;
}

const AuthSchema = new Schema<AuthenticateUser>(
  {
    uuid: {
      type: String,
      default: () => randomUUID(),
      unique: true,
      index: true
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
  }
);
AuthSchema.index({ email: 1 }, { unique: true });
AuthSchema.index({ userName: 1 }, { unique: true });

// 2. 添加自定义方法
// 比较密码
AuthSchema.methods.comparePasswords = async function (
  password: string
): Promise<boolean> {
  try {
    // 确保有密码哈希
    if (!this.passwordHash) {
      return false;
    }
    // 使用 bcrypt 比较密码
    return await bcrypt.compare(password, this.passwordHash);
  } catch (error) {
    // 处理比较过程中的错误
    throw new Error("Password comparison failed");
  }
};

export const AuthModel = mongoose.model<AuthenticateUser>(
  "AuthenticateUser",
  AuthSchema
);
