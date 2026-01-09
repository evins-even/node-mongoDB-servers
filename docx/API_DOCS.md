# API 文档说明

## 📚 如何查看 API 文档

### 方法一：Swagger UI（推荐）

启动服务器后，在浏览器中访问：

```
http://localhost:3000/api-docs
```

你会看到一个**可交互的 API 文档界面**，可以：

- ✅ 查看所有 API 接口
- ✅ 查看每个接口的详细说明
- ✅ 查看请求参数和响应示例
- ✅ **直接在浏览器中测试 API**（点击 "Try it out"）
- ✅ 按标签分类浏览（Authentication、Users、Health）

### 方法二：导出 JSON 格式

访问以下地址获取 OpenAPI 3.0 格式的文档：

```
http://localhost:3000/api-docs.json
```

可以导入到 Postman、Insomnia 等工具中。

---

## 🔑 如何使用 JWT 认证

某些接口需要登录后才能访问（标有 🔒 锁图标）。

### 步骤：

1. **先调用登录接口**：`POST /api/backend/auth/LoginAuther`
   
   请求体：
   ```json
   {
     "userName": "john",
     "email": "john@example.com",
     "password": "123456"
   }
   ```

2. **复制返回的 token**：
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIs..."
   }
   ```

3. **在 Swagger UI 中设置 Token**：
   - 点击页面右上角的 🔓 **Authorize** 按钮
   - 在弹出框中输入：`Bearer <你的token>`
   - 点击 **Authorize**
   - 现在你可以访问需要认证的接口了

4. **在代码中使用**：
   ```javascript
   fetch('http://localhost:3000/api/backend/user/', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   ```

---

## 📋 API 接口列表

### 🔐 认证接口 (Authentication)

| 方法 | 路径 | 说明 | 需要认证 |
|------|------|------|---------|
| POST | `/api/backend/auth/Register` | 用户注册 | ❌ |
| POST | `/api/backend/auth/LoginAuther` | 用户登录 | ❌ |

### 👥 用户接口 (Users)

| 方法 | 路径 | 说明 | 需要认证 |
|------|------|------|---------|
| GET | `/api/backend/user/` | 获取所有用户 | 🔒 |
| GET | `/api/backend/user/getUserId` | 根据ID获取用户 | 🔒 |
| POST | `/api/backend/user/CreateUser` | 创建用户 | 🔒 |
| PUT | `/api/backend/user/updataUser` | 更新用户 | 🔒 |
| DELETE | `/api/backend/user/deleteUser` | 删除用户 | 🔒 |

### 💚 健康检查 (Health)

| 方法 | 路径 | 说明 | 需要认证 |
|------|------|------|---------|
| GET | `/api/` | API 基本信息 | ❌ |
| GET | `/health` | 服务器健康状态 | ❌ |

---

## 🎯 快速测试示例

### 1. 注册新用户

```bash
curl -X POST http://localhost:3000/api/backend/auth/Register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 2. 登录获取 Token

```bash
curl -X POST http://localhost:3000/api/backend/auth/LoginAuther \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 3. 使用 Token 获取用户列表

```bash
curl -X GET http://localhost:3000/api/backend/user/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🛠️ 其他 API 文档工具

### 导入到 Postman

1. 打开 Postman
2. 点击 **Import**
3. 选择 **Link**
4. 输入：`http://localhost:3000/api-docs.json`
5. 点击 **Continue** → **Import**

### 导入到 Insomnia

1. 打开 Insomnia
2. 点击 **Create** → **Import From** → **URL**
3. 输入：`http://localhost:3000/api-docs.json`
4. 点击 **Fetch and Import**

### 使用 Apifox

1. 打开 Apifox
2. 新建项目 → **导入数据**
3. 选择 **URL导入**
4. 输入：`http://localhost:3000/api-docs.json`

---

## 📖 响应状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证（需要登录） |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 💡 提示

- 所有日期时间都使用 ISO 8601 格式：`2024-01-07T12:00:00.000Z`
- 所有请求和响应都使用 JSON 格式
- JWT Token 有效期为 **15分钟**
- Refresh Token 有效期为 **7天**
- 生产环境记得修改 `swagger.ts` 中的服务器地址

---

## 🔗 相关链接

- Swagger UI: http://localhost:3000/api-docs
- OpenAPI JSON: http://localhost:3000/api-docs.json
- 健康检查: http://localhost:3000/health

