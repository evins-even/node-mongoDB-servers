import mongoose, { Document, Schema, Model } from "mongoose";

// 1. 定义文档接口
export interface IUser extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
  isAdult: boolean; // 虚拟属性
  avatarUrl: string;
  bio: string;
  location: string;
  preferences: {
    theme: string;
    language: string;
  };
}

// 3. 静态方法接口
export interface IUserModel extends Model<IUser> {
  findAdults(): Promise<IUser[]>;
  findByUserId(userId: string): Promise<IUser | null>;
}

// 4. 创建 Schema
const userSchema = new Schema<IUser, IUserModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthenticateUser", // 这建立了“引用”，用于 populate() 方法
      required: true,
      unique: true, // 确保一个认证账户只有一个资料
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 50,
    },
    age: {
      type: Number,
      min: 18,
      max: 120,
    },
    avatarUrl: {
      type: String,
    },
    bio: String,
    location: String,
    preferences: {
      theme: { type: String, default: "light" },
      language: { type: String, default: "zh-CN" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 5. 虚拟属性
userSchema.virtual("isAdult").get(function (this: IUser) {
  return this.age ? this.age >= 18 : false;
});

// 7. 静态方法

userSchema.statics.findAdults = function (): Promise<IUser[]> {
  return this.find({ age: { $gte: 18 } });
};

userSchema.statics.findByUserId = function (
  userId: string
): Promise<IUser | null> {
  return this.findOne({ userId });
};

// 8. 创建模型
export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
