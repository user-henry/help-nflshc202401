# help-nflshc202401

NFLSHC 202401 社区项目 **帮助站**（NFLSHC Chat 官方文档与教程站点）。

🌐 在线访问：`https://help.nflshcchat.cc.cd`（或对应 Pages / Worker 域名）

---

## 📖 站点简介

本仓库是 [nflshcchat](https://github.com/user-henry/nflshcchat) 项目的配套帮助文档站，面向南京外国语学校淮安分校（NFLSHC）202401 班级社区用户，提供：

- 平台使用教程（注册登录、聊天、好友、角色、AI 助手等）
- 功能介绍与常见问题（FAQ）
- HZYAI 智能助手的角色（RAG）知识库与使用方法
- 本地部署 / 自建说明

站点本身为**纯静态前端**，由 Cloudflare Pages / Cloudflare Workers 托管，数据持久化由主站后端的 **Cloudflare D1** 完成，帮助站不存储业务数据。

---

## 📁 目录结构

```
help-nflshc202401/
├── index.html         # 帮助站首页（文档导航 / 教程入口）
├── rag.html           # HZYAI 角色（RAG）知识库与使用说明
├── ai-chat.html       # HZYAI 智能对话演示页
├── build.html         # 本地构建 / 部署指引
├── 404.html           # 自定义未找到页面
├── sitemap.xml        # 站点地图
├── wrangler.toml      # Cloudflare Workers / Pages 配置
├── _worker.js         # Worker 入口：将 /api/ai/* 代理到 ai.nflshcchat.cc.cd
└── .assetsignore      # 静态资产忽略规则
```

---

## 🛠️ 技术架构

```
┌─────────────────────────────────────────────┐
│              浏览器（纯静态前端）              │
│   HTML / CSS / JavaScript（零框架）           │
└───────────────────┬─────────────────────────┘
                    │  HTTPS
                    ▼
┌─────────────────────────────────────────────┐
│        Cloudflare Pages / Workers 托管        │
│  _worker.js 拦截 /api/ai/* 请求              │
│         ↓ 反向代理                           │
│  ai.nflshcchat.cc.cd（HZYAI 智能网关）        │
└─────────────────────────────────────────────┘
```

- **托管**：Cloudflare Pages（或 Workers Assets），免费、全球 CDN 加速。
- **AI 代理**：`_worker.js` 将站内 `/api/ai/*` 请求转发至 `ai.nflshcchat.cc.cd`，解决跨域并隐藏真实网关地址。
- **数据存储**：业务数据（对话、角色、任务等）由主站 Cloudflare D1 统一管理，帮助站仅作展示与引导。

---

## 🚀 本地预览 / 部署

### 本地预览

```bash
# 进入仓库
cd help-nflshc202401

# 使用任意静态服务器（需能加载 _worker.js 以测试 /api/ai 代理）
npx wrangler pages dev .
# 或
npx serve .
```

### 部署到 Cloudflare

1. 安装并登录 `wrangler`：`npx wrangler login`
2. 修改 `wrangler.toml` 中的 `name` / 账号绑定（如需自定义域名）
3. 部署：
   ```bash
   npx wrangler pages deploy .
   # 或作为 Worker 部署（使用 _worker.js 入口）
   npx wrangler deploy
   ```
4. 在 Cloudflare 控制台绑定自定义域名（如 `help.nflshcchat.cc.cd`），并将 `ai.nflshcchat.cc.cd` 配置为可访问的 AI 网关。

---

## 📄 开源协议

MIT License — 仅供学习与教育用途。
