# AI 新闻时间轴

一个适配手机端的 AI 行业新闻聚合应用，支持深色模式，每小时自动更新。

## 功能特点

- 📱 手机端优化的用户界面
- 🌓 深色/浅色模式切换
- 📰 RSS 源自动聚合 (OpenAI, Anthropic, Google DeepMind, Stability AI, Meta AI)
- ⏰ 每小时自动更新
- 💾 可选的 Supabase 数据库集成
- 📊 新闻分类和时间轴展示
- 🔄 手动刷新功能
- 📝 文章详情展开/收起

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React (图标)

### 后端
- Express.js
- TypeScript + tsx
- rss-parser (RSS 解析)
- node-cron (定时任务)
- Supabase (可选数据库)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，按需配置：

```env
# API Configuration
PORT=3001

# Supabase Configuration (可选)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. 运行开发服务器

#### 仅运行前端：
```bash
npm run dev
```

#### 仅运行后端 API：
```bash
npm run dev:api
```

#### 同时运行前后端：
```bash
npm run dev:all
```

## Supabase 集成 (可选)

### 1. 创建 Supabase 项目

访问 [supabase.com](https://supabase.com) 创建新项目。

### 2. 运行数据库迁移

在 Supabase Dashboard 的 SQL Editor 中运行 `supabase/migrations/001_create_news_table.sql` 文件中的 SQL。

### 3. 配置环境变量

在 `.env` 文件中添加你的 Supabase URL 和 Service Role Key。

## RSS 源配置

在 `api/services/rssService.ts` 中添加或修改 RSS 源：

```typescript
const RSS_FEEDS = [
  { name: "Your Source", url: "https://example.com/rss.xml", category: "Your Category" },
  // 添加更多...
];
```

## 部署

### Vercel 部署

1. 将代码推送到 GitHub 仓库
2. 使用 Vercel 导入项目
3. 配置环境变量
4. 部署！

Vercel Cron Jobs 会自动处理每小时更新。

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "dev:all"]
```

## 项目结构

```
ai-news-timeline/
├── api/                      # 后端代码
│   ├── index.ts            # Express 入口
│   ├── routes/             # API 路由
│   └── services/           # 业务逻辑
├── src/                     # 前端代码
│   ├── components/         # React 组件
│   ├── data/               # 模拟数据
│   ├── hooks/              # React 钩子
│   ├── lib/                # 工具函数
│   ├── pages/              # 页面组件
│   └── types/              # TypeScript 类型
├── supabase/               # Supabase 迁移文件
├── package.json
└── README.md
```

## API 端点

- `GET /api/health` - 健康检查
- `GET /api/news` - 获取新闻列表
- `GET /api/news/sync` - 触发同步操作

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
