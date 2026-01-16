import mongoose, { Document, Schema } from "mongoose";

/**
 * 用户资料接口
 */
export interface IUser extends Document {
  uuid: string;              // 关联到 Auth 的 uuid
  nickname: string;          // 博主昵称/笔名
  avatar?: string;           // 头像
  bio?: string;              // 个人简介
  social: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户资料 Schema
 */
const UserSchema = new Schema<IUser>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    social: {
      github: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

// 创建索引
UserSchema.index({ uuid: 1 });

/**
 * 导出模型
 */
export const UserModel = mongoose.model<IUser>("User", UserSchema);
