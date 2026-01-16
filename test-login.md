# 登录功能测试指南

## 📋 前置条件

1. **启动 MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # 或者直接运行 mongod
   mongod
   ```

2. **启动服务器**
   ```bash
   npm run dev
   ```

3. **确保 .env 文件配置正确**
   ```env
   # MongoDB 连接
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   
   # JWT 密钥
   JWT_SECRET=your-jwt-secret-key-here
   REFRESH_TOKEN_SECRET=your-refresh-token-secret-key-here
   ```

---

## 🧪 测试步骤

### 第一步：注册一个测试账号

**接口：** `POST http://localhost:3000/api/backend/auth/register`

**请求体：**
```json
{
  "userName": "testuser",
  "email": "test@example.com",
  "password": "123456"
}
```

**使用 curl 测试：**
```bash
curl -X POST http://localhost:3000/api/backend/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"userName\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"123456\"}"
```

**预期响应（成功）：**
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "userName": "testuser",
    "email": "test@example.com",
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "profile": {
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "nickname": "testuser"
    }
  }
}
```

---

### 第二步：登录测试

**接口：** `POST http://localhost:3000/api/backend/auth/login`

**请求体：**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

**使用 curl 测试：**
```bash
curl -X POST http://localhost:3000/api/backend/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"123456\"}"
```

**预期响应（成功）：**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "userName": "testuser",
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "email": "test@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 第三步：测试错误场景

#### 场景 1：密码错误
```bash
curl -X POST http://localhost:3000/api/backend/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"wrongpassword\"}"
```

**预期响应：**
```json
{
  "success": false,
  "error": "邮箱或密码错误"
}
```

#### 场景 2：邮箱不存在
```bash
curl -X POST http://localhost:3000/api/backend/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"notexist@example.com\",\"password\":\"123456\"}"
```

**预期响应：**
```json
{
  "success": false,
  "error": "邮箱或密码错误"
}
```

#### 场景 3：参数缺失
```bash
curl -X POST http://localhost:3000/api/backend/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\"}"
```

**预期响应：**
```json
{
  "success": false,
  "error": "邮箱和密码为必填项"
}
```

#### 场景 4：连续错误 5 次（账户锁定）
```bash
# 连续执行 5 次错误密码的请求
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/backend/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test@example.com\",\"password\":\"wrong\"}"
  echo ""
done
```

**第 5 次预期响应：**
```json
{
  "success": false,
  "error": "登录失败次数过多，账户已被锁定 30 分钟"
}
```

---

## 🌐 使用 Swagger UI 测试（推荐）

1. 打开浏览器访问：`http://localhost:3000/api-docs`

2. 找到 **Authentication** 分组

3. 测试注册接口：
   - 点击 `POST /api/backend/auth/register` 展开
   - 点击 "Try it out"
   - 填写参数
   - 点击 "Execute"

4. 测试登录接口：
   - 点击 `POST /api/backend/auth/login` 展开
   - 点击 "Try it out"
   - 填写邮箱和密码
   - 点击 "Execute"
   - 复制返回的 token

---

## 🔍 验证数据库

### 使用 MongoDB Shell 查看数据

```bash
# 连接到 MongoDB
mongosh

# 切换到你的数据库
use your-database-name

# 查看认证表（密码已加密）
db.authenticateusers.find().pretty()

# 查看用户资料表
db.users.find().pretty()
```

**认证表数据示例：**
```javascript
{
  _id: ObjectId("..."),
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  userName: "testuser",
  email: "test@example.com",
  passwordHash: "$2a$10$...", // 加密后的密码
  role: "user",
  loginAttempts: 0,
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## 📊 功能清单

### ✅ 已实现的功能

- [x] 用户注册（创建 Auth 和 User）
- [x] 用户登录（邮箱密码验证）
- [x] 密码加密（bcrypt）
- [x] JWT Token 生成（访问令牌 + 刷新令牌）
- [x] 登录失败次数限制
- [x] 账户自动锁定（5 次失败后锁定 30 分钟）
- [x] 统一的错误处理
- [x] Swagger API 文档

### 📌 待实现的功能

- [ ] 刷新 Token 功能
- [ ] 修改密码功能
- [ ] JWT 认证中间件
- [ ] 用户资料更新
- [ ] 邮箱验证
- [ ] 忘记密码/重置密码

---

## 🐛 常见问题

### 问题 1：MongoDB 连接失败
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**解决方法：**
1. 检查 MongoDB 是否启动
2. 检查 .env 中的 MONGODB_URI 配置

### 问题 2：JWT_SECRET 未定义
```
Error: JWT_SECRET is not defined
```

**解决方法：**
在 .env 文件中添加：
```env
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret-key
```

### 问题 3：bcrypt 安装失败
```
Error: Cannot find module 'bcryptjs'
```

**解决方法：**
```bash
npm install bcryptjs
npm install @types/bcryptjs --save-dev
```

---

## 🎉 测试成功的标志

如果看到以下情况，说明登录功能已经正常工作：

1. ✅ 注册接口返回 201 状态码和用户信息
2. ✅ 登录接口返回 200 状态码和 token
3. ✅ 密码错误时返回 401 错误
4. ✅ 5 次失败后账户被锁定
5. ✅ 数据库中能查到加密的密码
6. ✅ Token 是合法的 JWT 格式

---

## 📚 下一步学习

1. 实现 JWT 认证中间件
2. 保护需要登录的接口
3. 实现刷新 Token 功能
4. 添加参数验证中间件（Joi）
5. 实现文章 CRUD 功能

加油！🚀

