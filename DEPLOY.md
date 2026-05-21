# 🚀 部署指南

最简单的方式是使用 **Vercel**，可以一键部署！

## 方式一：Vercel 部署（推荐）

### 1. 准备代码仓库

首先把你的代码推送到 GitHub / GitLab / Bitbucket。

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <你的仓库地址>
git push -u origin main
```

### 2. 导入 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 注册/登录账号
3. 点击 "Add New..." → "Project"
4. 选择你的代码仓库
5. 点击 "Import"

### 3. 配置项目

在项目设置页面：

- **Project Name**: `ai-news-timeline`（或其他你喜欢的名字）
- **Framework Preset**: Vite（应该会自动识别）
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. 部署

点击 "Deploy"，等待 1-2 分钟，部署完成！

🎉 你会获得一个类似 `ai-news-timeline.vercel.app` 的公网地址！

## 方式二：其他平台

### Docker 部署

创建一个 `Dockerfile`：

```dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "dev:api"]
```

然后构建运行：

```bash
docker build -t ai-news .
docker run -p 3001:3001 ai-news
```

### 传统服务器部署

1. 安装 Node.js 20+
2. 克隆代码
3. `npm install`
4. `npm run build`
5. `npm run dev:api`（生产环境建议用 pm2）

## Vercel Cron Jobs 配置

Vercel 自动提供定时任务，每小时刷新新闻！

- 在 `vercel.json` 中已配置
- 每小时的整点自动调用 `/api/news/sync`
- 自动刷新 RSS 源内容

## 环境变量（可选）

如果需要配置环境变量：

在 Vercel 项目 → Settings → Environment Variables：

- （暂不需要，当前版本直接用模拟数据 + RSS）

## 更新代码

推送代码到 GitHub 后，Vercel 自动重新部署：

```bash
git add .
git commit -m "更新内容"
git push
```

等待几十秒，新内容自动上线！

## 自定义域名

1. 在 Vercel 项目 → Settings → Domains
2. 添加你的域名，如 `ai.news.example.com`
3. 按照提示配置 DNS
4. 启用 HTTPS（Vercel 自动提供）

## 成本

Vercel Hobby 版本：
- ✅ 完全免费
- ✅ 无限次数部署
- ✅ 100GB 带宽/月
- ✅ Cron Jobs 支持
- ✅ 足够个人使用

## 故障排除

### RSS 源无法访问

某些 RSS 源可能有访问限制，代码已内置 fallback 到模拟数据。

### 部署失败

1. 检查 Node.js 版本（需要 18+）
2. 清除 `node_modules` 重新 `npm install`
3. 查看 Vercel 部署日志

### 定时任务不工作

确认 `vercel.json` 中的 cron 配置正确。

---

## 一键部署（备选）

如果上面太麻烦，你也可以使用其他平台：

- **Railway**: railway.app
- **Netlify**: netlify.com
- **Render**: render.com
- **Fly.io**: fly.io

都有类似的 Git 集成自动部署功能！

---

🎊 部署成功后，把链接分享给你的朋友吧！
