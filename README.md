<p align="center">
  <img src="./docs/assets/readme/hero-cover.png" alt="VibeCoding 创业社交平台 — 学习 · 展示 · 工具 · 匹配" width="100%" />
</p>

<h1 align="center">VibeCoding 创业社交平台</h1>

<p align="center">
  <strong>学习 · 展示 · 工具 · 匹配</strong> — 面向 Vibe Coding 与独立开发者的创业社交 Web 应用<br/>
  品牌站 · 产品 App · REST API · PostgreSQL，单仓一体化部署
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14.2-black?logo=next.js" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma" alt="Prisma" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" /></a>
  <a href="./messages/"><img src="https://img.shields.io/badge/i18n-1286_keys-6366F1" alt="i18n" /></a>
  <a href="https://next-intl-docs.vercel.app/"><img src="https://img.shields.io/badge/App_Router-14-000000" alt="App Router" /></a>
</p>

<p align="center">
  <sub>
    <strong>37</strong> 页面 · <strong>31</strong> API 路由 · <strong>1286</strong> i18n 键 · App / Web 双模式 · 中英双语
  </sub>
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> ·
  <a href="#产品演示">产品演示</a> ·
  <a href="#界面一览">界面一览</a> ·
  <a href="#完整路由">完整路由</a> ·
  <a href="#api-概览">API 概览</a> ·
  <a href="#部署指南">部署</a>
</p>

---

## 目录

- [产品演示](#产品演示)
- [品牌站亮点](#品牌站亮点)
- [界面一览](#界面一览)
- [核心能力](#核心能力)
- [产品路径](#产品路径)
- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [系统架构](#系统架构)
- [完整路由](#完整路由)
- [API 概览](#api-概览)
- [快速开始](#快速开始)
- [演示账号](#演示账号)
- [更新截图](#更新截图)
- [环境变量](#环境变量)
- [常用命令](#常用命令)
- [目录结构](#目录结构)
- [国际化（i18n）](#国际化i18n)
- [部署指南](#部署指南)
- [开发规范](#开发规范)
- [常见问题](#常见问题)

---

## 产品演示

<p align="center">
  <img src="./docs/assets/readme/demo-locale-switch.gif" alt="中英双语切换" width="32%" />
  <img src="./docs/assets/readme/demo-command-palette.gif" alt="命令面板 Ctrl+K" width="32%" />
  <img src="./docs/assets/readme/demo-match-flow.gif" alt="智能伙伴匹配" width="32%" />
</p>
<p align="center"><sub>中英切换 · 命令面板 ⌘K / Ctrl+K · 画像匹配与雷达评分</sub></p>

<p align="center">
  <img src="./docs/assets/readme/demo-feed-scroll.gif" alt="发现流浏览" width="66%" />
</p>
<p align="center"><sub>发现流 — 瀑布卡片、话题标签与收藏互动</sub></p>

---

## 品牌站亮点

营销落地页（`/`）与 App 共用同一套 Prisma 数据后端，对外展示产品愿景与五大子系统。

<table align="center">
  <tr>
    <td align="center" width="50%">
      <img src="./docs/assets/readme/marketing-match-radar.png" alt="匹配雷达预览" width="100%" /><br/>
      <sub><strong>七维匹配雷达</strong> · 角色 / 技能 / 方向互补可视化</sub>
    </td>
    <td align="center" width="50%">
      <img src="./docs/assets/readme/marketing-pulse.png" alt="Pulse 数据墙" width="100%" /><br/>
      <sub><strong>Pulse 仪表盘</strong> · 匹配率 / 留存 / 评分 / GMV 实时叙事</sub>
    </td>
  </tr>
</table>

---

## 界面一览

### 核心 Tab

<table align="center">
  <tr>
    <td align="center" width="33%">
      <a href="#发现与内容"><img src="./docs/assets/readme/app-home-feed.png" alt="发现首页" width="100%" /></a><br/>
      <sub><strong>/home</strong> 发现 · 灵感流与今日推荐</sub>
    </td>
    <td align="center" width="33%">
      <a href="#匹配与社交"><img src="./docs/assets/readme/app-match-results.png" alt="智能匹配" width="100%" /></a><br/>
      <sub><strong>/match</strong> 匹配 · 七维雷达与候选评分</sub>
    </td>
    <td align="center" width="33%">
      <a href="#工具与模型"><img src="./docs/assets/readme/app-tools-market.png" alt="工具商城" width="100%" /></a><br/>
      <sub><strong>/tools</strong> 工具 · 榜单与市场</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <img src="./docs/assets/readme/app-workspace.png" alt="工作台" width="100%" /><br/>
      <sub><strong>/workspace</strong> 工作台 · 快照与快捷入口</sub>
    </td>
    <td align="center" width="33%">
      <img src="./docs/assets/readme/app-models-rank.png" alt="大模型排行" width="100%" /><br/>
      <sub><strong>/models</strong> 模型 · 社区共建排行</sub>
    </td>
    <td align="center" width="33%">
      <img src="./docs/assets/readme/marketing-bento.png" alt="品牌 Bento" width="100%" /><br/>
      <sub><strong>品牌 Bento</strong> · 五大子系统矩阵</sub>
    </td>
  </tr>
</table>

### 扩展场景

<table align="center">
  <tr>
    <td align="center" width="33%">
      <img src="./docs/assets/readme/app-messages.png" alt="消息中心" width="100%" /><br/>
      <sub><strong>/messages</strong> 私信与会话</sub>
    </td>
    <td align="center" width="33%">
      <img src="./docs/assets/readme/app-learn.png" alt="学习路线" width="100%" /><br/>
      <sub><strong>/learn</strong> 分步学习路径</sub>
    </td>
    <td align="center" width="33%">
      <img src="./docs/assets/readme/app-publish.png" alt="发布笔记" width="100%" /><br/>
      <sub><strong>/publish</strong> 多类型内容发布</sub>
    </td>
  </tr>
</table>

---

## 核心能力

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="./docs/assets/readme/app-match-results.png" alt="匹配能力" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h3>匹配与社交</h3>
      <ul>
        <li>基于画像的智能伙伴匹配（技能、方向、角色偏好）</li>
        <li>「今日一人」每日高匹配推荐</li>
        <li>七维雷达评分与匹配理由可视化</li>
        <li>私信会话、关注关系与用户主页</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="./docs/assets/readme/app-tools-market.png" alt="工具生态" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h3>工具与模型</h3>
      <ul>
        <li>AI 工具商城浏览、详情与社区评价</li>
        <li>大模型目录、Weekly Champion 排行</li>
        <li>模板市场、心愿单与演示订单</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="./docs/assets/readme/marketing-pulse.png" alt="数据叙事" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h3>品牌叙事 · 数据可视化</h3>
      <ul>
        <li>Pulse 柱状 / 折线 / 环形 KPI 组合仪表盘</li>
        <li>匹配雷达海报化展示，适合对外传播</li>
        <li>Bento 非对称功能矩阵，一屏读懂产品边界</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="./docs/assets/readme/demo-locale-switch.gif" alt="国际化" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h3>全球化 · 中英双语</h3>
      <ul>
        <li><strong>1286</strong> 对齐翻译键，全站 UI 双语</li>
        <li>中文 <code>/home</code> · 英文 <code>/en/home</code></li>
        <li>Cookie + 中间件持久化，跨页切换不丢失</li>
        <li><code>npm run check:i18n</code> 防硬编码回归</li>
      </ul>
    </td>
  </tr>
</table>

---

## 产品路径

```mermaid
flowchart LR
  Landing["品牌站 /"] --> Welcome["/welcome 注册登录"]
  Welcome --> Mode["/welcome/mode 选 App/Web"]
  Mode --> Home["/home 发现流"]
  Home --> Match["/match 伙伴匹配"]
  Home --> Publish["/publish 发布内容"]
  Home --> Tools["/tools 工具市场"]
  Match --> Messages["/messages 私信"]
  Home --> Learn["/learn 学习路径"]
  Tools --> Models["/models 模型排行"]
  Home --> Workspace["/workspace 工作台"]
```

**体验模式：** App 手机壳 + 底部 Tab · Web 三栏桌面 + 右栏热榜（`sessionStorage: vbc_view_mode`）

---

## 项目简介

**VibeCoding 创业社交平台**（`code_demo_web`）是一个面向创业者、独立开发者与 Vibe Coding 爱好者的全栈 Web 应用。它将以下能力整合在同一套代码库中：

| 模块 | 说明 |
|------|------|
| **营销品牌站** | 落地页、Bento、匹配雷达、Pulse 动态等对外展示 |
| **产品 App** | 发现流、匹配、消息、发布、工作台等核心交互 |
| **REST API** | 帖子、用户、匹配、会话、工具/模型评价等后端接口 |
| **数据层** | PostgreSQL + Prisma ORM，支持迁移与种子数据 |

### 发现与内容

- 首页灵感流、话题标签、收藏与互动（点赞 / 评论 / 分享）
- 帖子详情、项目展示、创作者中心
- 全局搜索与命令面板（`⌘K` / `Ctrl+K`）

### 匹配与社交

- 基于画像的智能伙伴匹配（技能、方向、角色偏好）
- 「今日一人」每日高匹配推荐
- 私信会话、关注关系、用户主页

### 工具与模型

- AI 工具商城浏览、详情与社区评价
- 大模型目录、评分与讨论
- 模板市场、心愿单与演示订单

### 学习与成长

- 分步学习路径（含 GitHub 集成引导）
- 成就系统与个人资料完善
- 协作项目空间

### 账户与安全

- 邮箱注册 / 登录、邮箱验证、密码重置（Resend）
- 会话 Cookie 鉴权、访客模式（可配置关闭）
- 演示账号与种子数据（开发 / Demo 环境）

---

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | [Next.js 14](https://nextjs.org/)（App Router） |
| 语言 | TypeScript |
| UI | React 18、Tailwind CSS、Framer Motion、Lucide Icons |
| 国际化 | [next-intl](https://next-intl-docs.vercel.app/) |
| 数据库 | PostgreSQL |
| ORM | Prisma 5 |
| 认证 | 自研 Session Cookie + bcrypt 密码哈希 |
| 邮件 | Resend（可选，用于验证与重置密码） |
| 运行时 | Node.js ≥ 20 |

---

## 系统架构

```mermaid
flowchart TB
  subgraph Client["浏览器"]
    MKT["营销站 /"]
    APP["App Shell /home …"]
    SW["LocaleSwitcher zh ↔ en"]
  end

  subgraph Next["Next.js 14"]
    MW["middleware.ts<br/>i18n + 鉴权"]
    PAGES["app/[locale]/…<br/>页面 & 布局"]
    API["app/api/…<br/>Route Handlers"]
  end

  subgraph Data["数据层"]
    PRISMA["Prisma Client"]
    PG[("PostgreSQL")]
  end

  Client --> MW
  MW --> PAGES
  MW --> API
  PAGES --> API
  API --> PRISMA
  PRISMA --> PG
```

**路由分组概览：**

| 路由组 | 路径示例 | 用途 |
|--------|----------|------|
| `(marketing)` | `/`、`/login` | 对外品牌与入口 |
| `(shell)/welcome` | `/welcome/login` | 注册、登录、访客 onboarding |
| `(shell)/(tabs)` | `/home`、`/match`、`/tools` | 登录后主应用 |
| `app/api` | `/api/posts`、`/api/match` | 后端 REST 接口 |

---

## 完整路由

| 路径 | 说明 |
|------|------|
| `/` | 营销品牌落地页 |
| `/login` | 品牌站登录入口 |
| `/welcome` | 欢迎 / Onboarding 流程 |
| `/welcome/login` · `/register` · `/guest` | 登录 / 注册 / 访客 |
| `/welcome/mode` | App / Web 模式选择 |
| `/home` | 发现首页 · 灵感流 |
| `/match` | 智能伙伴匹配 |
| `/messages` | 私信会话 |
| `/publish` | 发布笔记 / 项目 / 招募 |
| `/search` | 全局搜索 |
| `/tools` · `/tools/[id]` | 工具商城与详情 |
| `/models` · `/models/[id]` | 大模型目录与详情 |
| `/workspace` | 工作台 Dashboard |
| `/learn` · `/learn/step/[step]` | 学习路径 |
| `/me` · `/settings` · `/settings/profile` | 个人中心与设置 |
| `/user/[id]` · `/post/[id]` · `/project/[id]` | 用户 / 帖子 / 项目详情 |
| `/collab/[projectId]` | 协作项目空间 |
| `/creator` · `/templates` · `/orders` | 创作者 / 模板 / 订单 |
| `/en/*` | 英文 UI（同上路径加 `/en` 前缀） |

---

## API 概览

| 分组 | 端点 | 说明 |
|------|------|------|
| **健康** | `GET /api/health` | 部署探活 |
| **认证** | `POST /api/auth/login` · `register` · `logout` · `guest` | 登录注册与会话 |
| | `POST /api/auth/forgot-password` · `reset-password` · `verify-email` | 邮箱验证与重置 |
| **用户** | `GET/PATCH /api/me` · `GET /api/users/[id]` · `PATCH /api/profile` | 当前用户与资料 |
| **内容** | `GET/POST /api/posts` · `GET/PATCH/DELETE /api/posts/[id]` | 帖子 CRUD |
| | `POST /api/posts/[id]/react` · `GET/POST .../comments` | 互动与评论 |
| **社交** | `POST /api/follow` · `GET /api/feed/following` | 关注与关注流 |
| **匹配** | `GET/POST /api/match` | 画像保存与匹配计算 |
| **消息** | `GET/POST /api/conversations` · `.../messages` · `.../read` | 会话与已读 |
| **工具/模型** | `GET /api/models` · `POST .../reviews` · `tools/[id]/reviews` | 目录与评价 |
| **其他** | `GET /api/home/rail` · `learn/progress` · `wishlist` · `orders` · `templates` | 首页推荐 / 学习 / 心愿单 |
| **运维** | `POST /api/seed` | 演示种子（需 `DEMO_SEED_SECRET`） |

---

## 快速开始

### 前置要求

- **Node.js** ≥ 20
- **PostgreSQL** 数据库（推荐 [Neon](https://neon.tech/) 或本地 Docker）
- **npm**（随 Node 安装）

### 1. 克隆与安装

```bash
cd code_demo_web
npm install
```

> `postinstall` 会自动执行 `prisma generate`。

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，至少填入数据库连接：

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

### 3. 初始化数据库

```bash
npx prisma migrate deploy
npm run db:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

| 入口 | 地址 |
|------|------|
| 品牌落地页 | http://localhost:3000 |
| 应用首页（中文） | http://localhost:3000/home |
| 应用首页（英文） | http://localhost:3000/en/home |
| 健康检查 | http://localhost:3000/api/health |

### 5. 生产构建（本地验证）

```bash
npm run build
npm start
```

---

## 演示账号

执行 `npm run db:seed` 后会写入演示数据，包括：

| 项目 | 值 |
|------|-----|
| 演示用户 ID | `user_demo_vibe` |
| 种子匹配用户 | `founder_01` … `founder_24`（共 24 位） |
| 演示登录 | 需 `ENABLE_DEMO_LOGIN=true`，API：`POST /api/auth/login` body `{ "userId": "user_demo_vibe", "demoMode": true, "password": "demo" }` |

本地开发也可直接注册新账号，或通过 `/welcome/register` 完成 onboarding。

---

## 更新截图

README 视觉资源由 Playwright **自动生成并提交进仓库**，push 到 GitHub 后相对路径即可渲染。

```bash
npm run docs:assets:install   # 可选：安装 Playwright Chromium（或自动用本机 Chrome）
npm run docs:assets           # 生成全部 PNG + GIF
npm run docs:assets -- --only=png      # 仅静帧
npm run docs:assets -- --only=gif      # 仅动图
npm run docs:assets -- --only=marketing # 仅品牌站区块
```

**输出目录：** [`docs/assets/readme/`](./docs/assets/readme/)（含 [`manifest.json`](./docs/assets/readme/manifest.json) 体积清单）

| 类型 | 数量 | 说明 |
|------|:----:|------|
| PNG 静帧 | 13 | Hero、Bento、雷达、Pulse、7 个 App 页 |
| GIF 动图 | 4 | 语言切换、命令面板、匹配、发现流 |
| 优化策略 | — | PNG palette 压缩 · GIF 420px 宽 · 超 1.5MB 自动降帧 |

---

## 环境变量

完整说明见 [`.env.example`](./.env.example)。常用变量如下：

| 变量 | 必填 | 说明 |
|------|:----:|------|
| `DATABASE_URL` | ✅ | PostgreSQL 连接串（Prisma 主连接） |
| `DIRECT_URL` | 推荐 | 直连 URL；未设时构建脚本会回退为 `DATABASE_URL` |
| `SESSION_SECRET` | 可选 | ≥32 位随机串；未设时启动脚本自动生成 |
| `NEXT_PUBLIC_SITE_URL` | 可选 | 站点 canonical URL；Vercel 可自动推断 |
| `RESEND_API_KEY` | 可选 | 邮件服务 API Key |
| `EMAIL_FROM` | 可选 | 发件人地址 |
| `APP_URL` | 可选 | 应用绝对 URL，用于邮件链接 |
| `ENABLE_DEMO_LOGIN` | 可选 | 演示快速登录（生产建议 `false`） |
| `ENABLE_GUEST` | 可选 | 访客模式 |
| `DEMO_SEED_SECRET` | 可选 | 保护 `/api/seed` |

> ⚠️ 切勿将 `.env.local` 提交到 Git。

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run check:i18n` | 扫描 UI 硬编码中文 |
| `npm run docs:assets` | 重新生成 README 截图与 GIF |
| `npm run db:seed` | 写入演示种子数据 |
| `npm run auth:smoke` | 认证流程冒烟测试 |
| `npm run smoke:pages` | 受保护页面可达性测试 |

---

## 目录结构

```
code_demo_web/
├── app/[locale]/           # 国际化页面（marketing + shell）
├── app/api/                # 31 个 REST Route Handlers
├── components/             # UI 组件（Feed、Match、WebHero…）
├── docs/assets/readme/     # README 截图 / GIF / manifest.json
├── i18n/                   # next-intl 配置
├── lib/                    # 业务逻辑、鉴权、匹配算法
├── messages/               # zh.json / en.json（1286 键）
├── prisma/                 # schema + migrations + seed
├── scripts/
│   └── capture-readme-assets.mjs
└── middleware.ts           # i18n + 会话鉴权
```

---

## 国际化（i18n）

- [`messages/zh.json`](./messages/zh.json) — 简体中文（默认）
- [`messages/en.json`](./messages/en.json) — English

| 语言 | 示例路径 |
|------|----------|
| 中文 | `/home`、`/match` |
| 英文 | `/en/home`、`/en/match` |

```bash
npm run check:i18n   # 提交前必跑
```

---

## 部署指南

### Vercel

1. Root Directory → `code_demo_web`（若仓库即本目录则留空）
2. 配置 `DATABASE_URL` + `DIRECT_URL`（Neon）
3. Build：`npm run build`

### Render

[`render.yaml`](./render.yaml)：`npm run build` → `node scripts/render-start.cjs` → `/api/health`

### 检查清单

- [ ] `DATABASE_URL` 可达 · migrate 成功 · health 200
- [ ] 生产关闭 `ENABLE_DEMO_LOGIN` / `ENABLE_GUEST`（按需）
- [ ] 配置 `RESEND_API_KEY` 启用邮箱验证（可选）

---

## 开发规范

```bash
npm run lint && npm run check:i18n && npx tsc --noEmit
```

- UI 文案走 `messages/*.json`，禁止硬编码中文
- 路由跳转用 [`i18n/navigation.ts`](./i18n/navigation.ts) 的 `Link` / `useRouter`
- 数据库变更：`prisma migrate dev` → 提交 `prisma/migrations/`

---

## 常见问题

<details>
<summary><strong>README 图片 push 后不显示？</strong></summary>

确认 `docs/assets/readme/` 已 **git add 并 commit**。GitHub 仅渲染仓库内相对路径 `./docs/assets/readme/xxx.png`。

</details>

<details>
<summary><strong>如何重新生成更清晰的截图？</strong></summary>

确保本地已 seed（`npm run db:seed`），运行 `npm run docs:assets`。脚本使用 1440×900 @2x 视口，输出 1280 宽 PNG 与 420 宽 GIF。

</details>

<details>
<summary><strong>切换英文后刷新又变回中文？</strong></summary>

语言偏好依赖 Cookie `NEXT_LOCALE` 与 `/en` 前缀；直接访问无前缀中文 URL 会显示中文，属预期行为。

</details>

<details>
<summary><strong>构建时 Prisma migrate 超时？</strong></summary>

Neon 连接池并发导致，稍后重试或用 `DIRECT_URL` 直连执行 `npx prisma migrate deploy`。

</details>

---

## 相关链接

| 资源 | 路径 |
|------|------|
| 环境变量模板 | [`.env.example`](./.env.example) |
| 数据模型 | [`prisma/schema.prisma`](./prisma/schema.prisma) |
| 截图清单 | [`docs/assets/readme/manifest.json`](./docs/assets/readme/manifest.json) |
| 截图脚本 | [`scripts/capture-readme-assets.mjs`](./scripts/capture-readme-assets.mjs) |
| Render 部署 | [`render.yaml`](./render.yaml) |

---

<p align="center">
  <sub>Built with ❤️ for the Vibe Coding community</sub>
</p>
