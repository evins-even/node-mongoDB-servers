import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Node Server API',
      version: '1.0.0',
      description: '基于 Express + TypeScript + MongoDB 的后端 API 文档',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '开发环境',
      },
      {
        url: 'https://api.production.com',
        description: '生产环境',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '在请求头中添加 Authorization: Bearer {token}',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: '用户唯一标识',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              description: '用户姓名',
              example: '张三',
            },
            age: {
              type: 'number',
              description: '用户年龄',
              example: 25,
            },
            avatarUrl: {
              type: 'string',
              description: '头像URL',
              example: 'https://example.com/avatar.jpg',
            },
            bio: {
              type: 'string',
              description: '个人简介',
              example: '热爱编程的开发者',
            },
            location: {
              type: 'string',
              description: '所在地',
              example: '北京',
            },
            preferences: {
              type: 'object',
              properties: {
                theme: {
                  type: 'string',
                  example: 'light',
                },
                language: {
                  type: 'string',
                  example: 'zh-CN',
                },
              },
            },
          },
        },
        Auth: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: '用户唯一标识',
            },
            userName: {
              type: 'string',
              description: '用户名',
            },
            email: {
              type: 'string',
              description: '邮箱',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: '角色',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: '错误信息',
            },
            message: {
              type: 'string',
              description: '详细描述',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: '用户认证相关接口',
      },
      {
        name: 'Users',
        description: '用户管理相关接口',
      },
      {
        name: 'Health',
        description: '健康检查',
      },
    ],
  },
  // 指定哪些文件包含 API 注释
  apis: [
    './src/routes/**/*.ts',
    './src/controllers/**/*.ts',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI 路由
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'My Node Server API Docs',
  }));

  // JSON 格式的文档
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger docs available at http://localhost:3000/api-docs');
};

export default swaggerSpec;

