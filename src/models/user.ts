import mongoose, { Document, Schema, Model } from 'mongoose';

// 1. 定义文档接口
export interface IUser extends Document {
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
  isAdult: boolean; // 虚拟属性
  
  // 实例方法
  getUserInfo(): UserInfo;
}

// 2. 实例方法返回类型
export interface UserInfo {
  name: string;
  email: string;
  isAdult: boolean;
}

// 3. 静态方法接口
export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findAdults(): Promise<IUser[]>;
}

// 4. 创建 Schema
const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  age: {
    type: Number,
    min: 18,
    max: 120
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 5. 虚拟属性
userSchema.virtual('isAdult').get(function(this: IUser) {
  return this.age ? this.age >= 18 : false;
});

// 6. 实例方法
userSchema.methods.getUserInfo = function(): UserInfo {
  return {
    name: this.name,
    email: this.email,
    isAdult: this.isAdult
  };
};

// 7. 静态方法
userSchema.statics.findByEmail = function(email: string): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findAdults = function(): Promise<IUser[]> {
  return this.find({ age: { $gte: 18 } });
};

// 8. 创建模型
export const User = mongoose.model<IUser, IUserModel>('User', userSchema);