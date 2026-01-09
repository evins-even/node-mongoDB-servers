# 创建博客后端脚手架 - 学习指南

## 🎯 项目目标

创建一个简单的 CLI 工具，用于快速初始化博客后端项目的基础结构。

---

## 📚 第一步：创建 CLI 项目

### 1. 创建项目文件夹

```bash
mkdir create-blog-backend
cd create-blog-backend
npm init -y
```

### 2. 安装依赖

```bash
# CLI 运行时依赖
npm install inquirer@8.2.5 chalk@4.1.2 ora@5.4.1 fs-extra@11.1.1

# 开发依赖
npm install -D typescript @types/node @types/inquirer @types/fs-extra ts-node
```

**为什么用这些包？**
- `inquirer` - 命令行交互（问用户问题）
- `chalk` - 彩色输出
- `ora` - 加载动画
- `fs-extra` - 文件操作（比原生 fs 更强大）

### 3. 配置 TypeScript

创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### 4. 修改 `package.json`

```json
{
  "name": "create-blog-backend",
  "version": "1.0.0",
  "bin": {
    "create-blog-backend": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "ts-node src/index.ts",
    "test": "node dist/index.js"
  }
}
```

---

## 📝 第二步：编写 CLI 代码

### 创建 `src/index.ts`

这是 CLI 的主文件，我会给你一个简化版本，你可以在这个基础上扩展：

```typescript
#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

// 主函数
async function main() {
  console.log(chalk.cyan('\\n🚀 欢迎使用博客后端脚手架！\\n'));

  // 1. 询问用户配置
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '项目名称:',
      default: 'my-blog-backend',
    },
    {
      type: 'input',
      name: 'port',
      message: '服务器端口:',
      default: '3000',
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: '是否自动安装依赖?',
      default: true,
    },
  ]);

  const projectPath = path.join(process.cwd(), answers.projectName);

  // 2. 检查目录是否存在
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red('\\n❌ 目录已存在！'));
    process.exit(1);
  }

  // 3. 创建项目
  const spinner = ora('创建项目...').start();

  try {
    // 创建目录结构
    await createDirectories(projectPath);
    
    // 生成配置文件
    await generateFiles(projectPath, answers);
    
    spinner.succeed(chalk.green('项目创建成功！'));

    // 4. 安装依赖
    if (answers.installDeps) {
      const installSpinner = ora('安装依赖...').start();
      try {
        execSync('npm install', {
          cwd: projectPath,
          stdio: 'inherit',
        });
        installSpinner.succeed(chalk.green('依赖安装成功！'));
      } catch (error) {
        installSpinner.fail(chalk.red('依赖安装失败'));
      }
    }

    // 5. 显示完成信息
    console.log(chalk.cyan('\\n✨ 完成！\\n'));
    console.log(chalk.white('下一步:\\n'));
    console.log(chalk.gray(\`  cd \${answers.projectName}\`));
    if (!answers.installDeps) {
      console.log(chalk.gray(\`  npm install\`));
    }
    console.log(chalk.gray(\`  npm run dev\\n\`));

  } catch (error) {
    spinner.fail(chalk.red('创建失败'));
    console.error(error);
    process.exit(1);
  }
}

// 创建目录结构
async function createDirectories(projectPath: string) {
  const dirs = [
    'src',
    'src/config',
    'src/models',
    'src/services',
    'src/controllers/backend',
    'src/controllers/frontend',
    'src/middleware',
    'src/routes/backend',
    'src/routes/frontend',
    'src/utils',
    'tests',
  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
}

// 生成配置文件
async function generateFiles(projectPath: string, answers: any) {
  // 生成 package.json
  await generatePackageJson(projectPath, answers);
  
  // 生成 .env
  await generateEnv(projectPath, answers);
  
  // 生成 .gitignore
  await generateGitignore(projectPath);
  
  // 生成 tsconfig.json
  await generateTsConfig(projectPath);
  
  // 生成 nodemon.json
  await generateNodemon(projectPath);
  
  // 生成入口文件
  await generateEntryFiles(projectPath);
  
  // 生成 README
  await generateReadme(projectPath, answers);
}

// 生成 package.json
async function generatePackageJson(projectPath: string, answers: any) {
  const packageJson = {
    name: answers.projectName,
    version: '1.0.0',
    description: 'A blog backend built with Express + TypeScript + MongoDB',
    scripts: {
      dev: 'nodemon src/server.ts',
      build: 'tsc',
      start: 'node dist/server.js',
    },
    dependencies: {
      express: '^4.18.2',
      mongoose: '^8.0.3',
      bcryptjs: '^2.4.3',
      jsonwebtoken: '^9.0.2',
      dotenv: '^16.3.1',
      cors: '^2.8.5',
      helmet: '^7.1.0',
      morgan: '^1.10.0',
      'swagger-jsdoc': '^6.2.8',
      'swagger-ui-express': '^5.0.0',
    },
    devDependencies: {
      '@types/express': '^4.17.21',
      '@types/node': '^20.10.0',
      '@types/bcryptjs': '^2.4.6',
      '@types/jsonwebtoken': '^9.0.5',
      '@types/cors': '^2.8.17',
      '@types/morgan': '^1.9.9',
      '@types/swagger-jsdoc': '^6.0.4',
      '@types/swagger-ui-express': '^4.1.6',
      typescript: '^5.3.3',
      'ts-node': '^10.9.1',
      nodemon: '^3.0.2',
    },
  };

  await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
}

// 生成 .env
async function generateEnv(projectPath: string, answers: any) {
  const envContent = \`NODE_ENV=development
PORT=\${answers.port}
MONGODB_URI=mongodb://localhost:27017/\${answers.projectName}
JWT_SECRET=your-secret-key-change-in-production
REFRESH_TOKEN_SECRET=your-refresh-secret-change-in-production
\`;
  await fs.writeFile(path.join(projectPath, '.env'), envContent);
}

// 生成 .gitignore
async function generateGitignore(projectPath: string) {
  const content = \`node_modules/
dist/
.env
*.log
.DS_Store
\`;
  await fs.writeFile(path.join(projectPath, '.gitignore'), content);
}

// 生成 tsconfig.json
async function generateTsConfig(projectPath: string) {
  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };
  await fs.writeJson(path.join(projectPath, 'tsconfig.json'), tsconfig, { spaces: 2 });
}

// 生成 nodemon.json
async function generateNodemon(projectPath: string) {
  const nodemon = {
    watch: ['src'],
    ext: 'ts,json',
    exec: 'ts-node src/server.ts',
  };
  await fs.writeJson(path.join(projectPath, 'nodemon.json'), nodemon, { spaces: 2 });
}

// 生成入口文件（空骨架）
async function generateEntryFiles(projectPath: string) {
  // app.ts - 只是一个空的 Express 应用
  const appContent = \`import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// TODO: 添加中间件
app.use(express.json());

// TODO: 添加路由

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;
\`;
  await fs.writeFile(path.join(projectPath, 'src/app.ts'), appContent);

  // server.ts - 启动服务器
  const serverContent = \`import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\\\`🚀 Server running on http://localhost:\\\${PORT}\\\`);
});
\`;
  await fs.writeFile(path.join(projectPath, 'src/server.ts'), serverContent);
}

// 生成 README
async function generateReadme(projectPath: string, answers: any) {
  const readme = \`# \${answers.projectName}

博客后端项目

## 快速开始

\\\`\\\`\\\`bash
npm install
npm run dev
\\\`\\\`\\\`

## 项目结构

\\\`\\\`\\\`
src/
├── config/          # 配置文件
├── models/          # 数据模型
├── services/        # 业务逻辑
├── controllers/     # 控制器
├── routes/          # 路由
├── middleware/      # 中间件
├── utils/           # 工具函数
├── app.ts           # Express 应用
└── server.ts        # 服务器入口
\\\`\\\`\\\`

## 技术栈

- Express
- TypeScript
- MongoDB
- JWT
\`;
  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

// 运行
main().catch(console.error);
```

---

## 🧪 第三步：测试 CLI

### 1. 开发模式测试

```bash
npm run dev
```

这会运行 `ts-node src/index.ts`，让你测试 CLI。

### 2. 构建和测试

```bash
npm run build
npm run test
```

### 3. 本地安装测试

```bash
npm link
```

现在你可以在任何地方运行：

```bash
create-blog-backend
```

---

## 📖 第四步：使用 CLI 创建项目

```bash
cd ~/Desktop
create-blog-backend
```

按照提示输入项目信息，CLI 会自动创建项目。

---

## 🎯 第五步：开始实现功能（这是你的任务！）

CLI 创建的项目只是一个骨架，现在你需要自己实现功能。

### **实现顺序建议：**

#### 1️⃣ **数据库连接** (最先做)
```
创建 src/config/database.ts
连接 MongoDB
测试连接是否成功
```

#### 2️⃣ **认证系统**
```
创建 src/models/Auth.ts
创建 src/services/authService.ts
创建 src/controllers/backend/authController.ts
创建 src/routes/backend/auth.ts
实现登录/注册接口
```

#### 3️⃣ **JWT 中间件**
```
创建 src/utils/generateTokens.ts
创建 src/middleware/auth.ts
保护需要认证的路由
```

#### 4️⃣ **文章管理（核心功能）**
```
创建 src/models/Post.ts
创建 src/services/postService.ts
创建 src/controllers/backend/postController.ts
创建 src/routes/backend/posts.ts
实现 CRUD 接口
```

#### 5️⃣ **前台展示**
```
创建 src/controllers/frontend/postController.ts
创建 src/routes/frontend/posts.ts
实现文章列表、详情接口
```

#### 6️⃣ **分类和标签**
```
创建 Category 和 Tag 模型
实现 CRUD 接口
关联到文章
```

#### 7️⃣ **Swagger 文档**
```
创建 src/config/swagger.ts
为每个路由添加文档注释
```

---

## 💡 关键知识点

### 1. **目录结构的意义**

```
src/
├── config/          配置文件（数据库、Swagger等）
├── models/          Mongoose 模型（定义数据结构）
├── services/        业务逻辑（操作数据库）
├── controllers/     控制器（处理请求/响应）
├── routes/          路由（定义 API 端点）
├── middleware/      中间件（认证、错误处理等）
└── utils/           工具函数（JWT、slugify等）
```

### 2. **分层架构**

```
Request → Router → Controller → Service → Model → Database
                       ↓
                   Response
```

### 3. **开发流程**

```
1. 定义数据模型（Model）
2. 实现业务逻辑（Service）
3. 创建控制器（Controller）
4. 定义路由（Route）
5. 测试接口
6. 添加文档
```

---

## 🔧 常用命令

```bash
# 开发模式（自动重启）
npm run dev

# 构建（编译 TypeScript）
npm run build

# 生产模式
npm start

# 测试数据库连接
npm run test:db

# 生成模型
npm run generate:model

# 查看项目结构
tree src/
```

---

## 📚 学习资源

1. **Express 官方文档**: https://expressjs.com/
2. **Mongoose 文档**: https://mongoosejs.com/
3. **TypeScript 手册**: https://www.typescriptlang.org/docs/
4. **JWT 介绍**: https://jwt.io/
5. **Swagger 文档**: https://swagger.io/docs/

---

## 🎓 练习任务

完成 CLI 后，按顺序完成这些任务：

- [ ] 创建数据库连接
- [ ] 实现用户注册接口
- [ ] 实现用户登录接口
- [ ] 实现 JWT 认证中间件
- [ ] 创建文章模型
- [ ] 实现创建文章接口
- [ ] 实现获取文章列表接口
- [ ] 实现文章详情接口
- [ ] 添加 Swagger 文档
- [ ] 实现分类功能
- [ ] 实现标签功能

---

## 💪 完成后你会学到：

1. ✅ 如何创建 CLI 工具
2. ✅ Node.js 项目架构设计
3. ✅ Express + TypeScript 开发
4. ✅ MongoDB 数据库操作
5. ✅ JWT 认证实现
6. ✅ RESTful API 设计
7. ✅ 分层架构思想

---

加油！有任何问题随时问我 😊

