export interface IUser extends Document {
    uuid: string;              // 关联到 Auth
    nickname: string;          // 博主昵称/笔名
    avatar?: string;           // 头像
    bio?: string;              // 个人简介
    social: {
        github?: string;
        twitter?: string;
        website?: string;
    };
    // 删除 age, location 等不需要的字段
}