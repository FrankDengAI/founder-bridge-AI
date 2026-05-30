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
  <a href="./messages/"><img src="https://img.shields.io/badge/i18n-中英双语-6366F1" alt="i18n" /></a>
  <a href="https://next-intl-docs.vercel.app/"><img src="https://img.shields.io/badge/App_Router-14-000000" alt="App Router" /></a>
</p>

---

## 目录

- [产品演示](#产品演示)
- [界面一览](#界面一览)
- [核心能力](#核心能力)
- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [系统架构](#系统架构)
- [快速开始](#快速开始)
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

## 界面一览

<table align="center">
  <tr>
    <td align="center" width="33%">
      <a href="#发现与内容"><img src="./docs/assets/readme/app-home-feed.png" alt="发现首页" width="100%" /></a><br/>
      <sub><strong>发现首页</strong> · 灵感流与今日推荐</sub>
    </td>
    <td align="center" width="33%">
      <a href="#匹配与社交"><img src="./docs/assets/readme/app-match-results.png" alt="智能匹配" width="100%" /></a><br/>
      <sub><strong>智能匹配</strong> · 七维雷达与候选评分</sub>
    </td>
    <td align="center" width="33%">
      <a href="#工具与模型"><img src="./docs/assets/readme/app-tools-market.png" alt="工具商城" width="100%" /></a><br/>
      <sub><strong>工具商城</strong> · 榜单与市场</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <img src="./docs/assets/readme/app-workspace.png" alt="工作台" width="100%" /><br/>
      <sub><strong>工作台</strong> · 数据快照与快捷入口</sub>
    </td>
    <td align="center" width="33%">
      <img src="./docs/assets/readme/app-models-rank.png" alt="大模型排行" width="100%" /><br/>
      <sub><strong>大模型排行</strong> · 社区共建评分</sub>
    </td>
    <td align="center" width="33%">
      <img src="./docs/assets/readme/marketing-bento.png" alt="品牌 Bento" width="100%" /><br/>
      <sub><strong>品牌 Bento</strong> · 五大子系统矩阵</sub>
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
      <img src="./docs/assets/readme/demo-locale-switch.gif" alt="国际化" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h3>全球化 · 中英双语</h3>
      <ul>
        <li><strong>1286+</strong> 对齐翻译键，全站 UI 双语</li>
        <li>中文 <code>/home</code> · 英文 <code>/en/home</code></li>
        <li>Cookie + 中间件持久化，跨页切换不丢失</li>
        <li><code>npm run check:i18n</code> 防硬编码回归</li>
      </ul>
    </td>
  </tr>
</table>

---

## 项目简介

**VibeCoding 创业社交平台**（`code_demo_web`）是一个面向创业者、独立开发者与 Vibe Coding 爱好者的全栈 Web 应用。它将以下能力整合在同一套代码库中：

| 模块 | 说明 |
|------|------|
| **营销品牌站** | 落地页、产品介绍、Pulse 动态等对外展示 |
| **产品 App** | 发现流、匹配、消息、发布、工作台等核心交互 |
| **REST API** | 帖子、用户、匹配、会话、工具/模型评价等后端接口 |
| **数据层** | PostgreSQL + Prisma ORM，支持迁移与种子数据 |

用户可以在平台上**学习 Vibe Coding 路径**、**发布与浏览内容**、**发现 AI 工具与大模型**、**匹配创业伙伴**，并在统一账户体系下完成社交与协作。

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

> Neon 用户：`DATABASE_URL` 使用 **pooler** 连接串，`DIRECT_URL` 使用 **直连** host（不带 pgbouncer）。

### 3. 初始化数据库

```bash
npx prisma migrate deploy
npm run db:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

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

## 更新截图

README 中的界面截图与 GIF 由 Playwright 自动生成，**已提交进仓库**，push 到 GitHub 后会自动显示。

```bash
# 首次使用需安装浏览器（或使用本机 Chrome，脚本会自动检测）
npm run docs:assets:install

# 一键重新生成 docs/assets/readme/ 下全部 PNG + GIF
npm run docs:assets
```

生成后请将 `docs/assets/readme/` 与 `README.md` 一并提交。脚本会：

1. 启动或复用 `localhost:3010` 开发服务器
2. 执行 `db:seed` 并自动注册截图专用账号
3. 截取 7 张界面静帧 + 4 段交互 GIF
4. 输出至 [`docs/assets/readme/`](./docs/assets/readme/)

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
| `EMAIL_FROM` | 可选 | 发件人地址，如 `VibeCoding <noreply@domain.com>` |
| `APP_URL` | 可选 | 应用绝对 URL，用于邮件链接 |
| `ENABLE_DEMO_LOGIN` | 可选 | 是否启用演示登录（生产建议 `false`） |
| `ENABLE_GUEST` | 可选 | 是否允许访客模式 |
| `DEMO_SEED_SECRET` | 可选 | 保护 `/api/seed` 演示种子接口 |
| `FRAME_ANCESTOR_ORIGINS` | 可选 | CSP `frame-ancestors` 额外白名单 |

> ⚠️ 切勿将 `.env.local` 提交到 Git。`.env.example` 仅作模板，不含敏感值。

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热更新） |
| `npm run dev:clean` | 清除 `.next` 缓存后启动 |
| `npm run build` | 生产构建（含条件性 Prisma 迁移） |
| `npm start` | 启动生产服务器 |
| `npm run lint` | ESLint 检查 |
| `npm run check:i18n` | 扫描 UI 硬编码中文（CI 推荐） |
| `npm run docs:assets` | 重新生成 README 截图与 GIF |
| `npm run docs:assets:install` | 安装 Playwright Chromium |
| `npm run db:push` | 将 schema 推送到数据库（开发用） |
| `npm run db:seed` | 写入演示种子数据 |
| `npm run db:seed:reset` | 重置模式种子（`SEED_MODE=reset`） |
| `npm run auth:smoke` | 认证流程冒烟测试 |
| `npm run smoke:pages` | 受保护页面可达性测试 |

---

## 目录结构

```
code_demo_web/
├── app/
│   ├── [locale]/              # 国际化路由根
│   │   ├── (marketing)/       # 品牌落地页
│   │   └── (shell)/           # 应用壳层
│   │       ├── welcome/       # 登录 / 注册 / Onboarding
│   │       └── (tabs)/        # 主 Tab 页面（home、match、tools…）
│   └── api/                   # REST Route Handlers
├── components/                # 可复用 React 组件
├── docs/
│   └── assets/readme/         # README 截图与 GIF（提交进 Git）
├── i18n/                      # next-intl 路由与请求配置
├── lib/                       # 业务逻辑、工具函数、鉴权
├── messages/                  # 翻译文件 zh.json / en.json
├── prisma/
│   ├── schema.prisma          # 数据模型
│   ├── migrations/            # 数据库迁移
│   └── seed.ts                # 种子入口
├── scripts/
│   └── capture-readme-assets.mjs  # README 资源自动生成
├── middleware.ts              # i18n + 会话鉴权中间件
├── .env.example               # 环境变量模板
├── render.yaml                # Render Blueprint
└── package.json
```

---

## 国际化（i18n）

本项目使用 **next-intl** 实现中英双语，UI 文案集中管理于：

- [`messages/zh.json`](./messages/zh.json) — 简体中文（默认）
- [`messages/en.json`](./messages/en.json) — English

### URL 规则

| 语言 | 示例路径 |
|------|----------|
| 中文（默认，无前缀） | `/home`、`/match`、`/tools` |
| 英文 | `/en/home`、`/en/match`、`/en/tools` |

配置见 [`i18n/routing.ts`](./i18n/routing.ts)（`localePrefix: "as-needed"`）。

### 语言切换

- 顶部 **LocaleSwitcher** 切换语言
- Cookie `NEXT_LOCALE` 与 URL 同步，跨页面导航保持语言一致
- 中间件 [`middleware.ts`](./middleware.ts) 负责 Cookie ↔ URL 单向补跳

### 添加 / 修改文案

1. 在 `messages/zh.json` 与 `messages/en.json` 中添加**相同键路径**
2. 组件内使用 `useTranslations("命名空间")` 或 `getTranslations`
3. 提交前运行：

```bash
npm run check:i18n
```

### 仍为中文的内容（预期）

以下数据不受 UI i18n 控制，英文模式下可能仍显示中文：

- 用户生成的帖子、评论、协作任务
- 数据库种子 / Demo 演示数据
- 部分 API 返回的原始错误信息

---

## 部署指南

### Vercel（推荐）

1. 导入 Git 仓库，**Root Directory** 设为 `code_demo_web`（若仓库仅含本目录则留空）
2. 在 Environment Variables 中配置 `DATABASE_URL`（及 Neon 的 `DIRECT_URL`）
3. Build Command：`npm run build`（默认）
4. 首次部署后若迁移失败，参见 [`.env.example`](./.env.example) 中 **P3009** 排查说明

### Render

仓库已包含 [`render.yaml`](./render.yaml) Blueprint：

| 配置项 | 值 |
|--------|-----|
| Build | `npm install && npm run build` |
| Start | `node scripts/render-start.cjs` |
| 健康检查 | `/api/health` |

`render-start.cjs` 启动流程：`migrate deploy` → 空库自动 seed → `next start`。

### 部署检查清单

- [ ] `DATABASE_URL` 已配置且网络可达
- [ ] `npx prisma migrate deploy` 成功
- [ ] `/api/health` 返回 200
- [ ] 生产环境关闭 `ENABLE_DEMO_LOGIN` / `ENABLE_GUEST`（按需）
- [ ] 配置 `RESEND_API_KEY` 以启用邮箱验证（可选）

---

## 开发规范

### 代码风格

- 遵循现有 TypeScript / React 模式，优先扩展已有组件与 `lib/` 工具
- UI 文案**禁止硬编码中文**，统一走 `messages/*.json`
- 路由跳转使用 [`i18n/navigation.ts`](./i18n/navigation.ts) 中的 `Link` / `useRouter`，避免丢失 locale 前缀

### 提交前自检

```bash
npm run lint
npm run check:i18n
npx tsc --noEmit
npm run build   # 需配置 DATABASE_URL
```

### 数据库变更

1. 修改 `prisma/schema.prisma`
2. `npx prisma migrate dev --name describe_change`
3. 更新种子脚本（如需要）
4. 提交 `prisma/migrations/` 目录

---

## 常见问题

<details>
<summary><strong>构建时 Prisma migrate 超时或 advisory lock 失败</strong></summary>

多为 Neon 连接池或并发部署导致，与业务代码无关。可稍后重试，或使用 `DIRECT_URL` 直连执行迁移：

```bash
npx prisma migrate deploy
```

</details>

<details>
<summary><strong>切换英文后刷新又变回中文</strong></summary>

确认 `middleware.ts` 与 `LocaleSwitcher` 未被改动。语言偏好依赖 Cookie `NEXT_LOCALE` 与 `/en` 前缀协同；直接访问无前缀的中文 URL 会显示中文，这是预期行为。

</details>

<details>
<summary><strong>本地没有数据库能否 build？</strong></summary>

可以。未配置 `DATABASE_URL` 时 `npm run build` 会跳过 `migrate deploy`，仅完成 Next.js 静态构建。完整功能需配置 PostgreSQL。

</details>

<details>
<summary><strong>如何重置演示数据？</strong></summary>

```bash
npm run db:seed:reset
```

或在开发环境调用受 `DEMO_SEED_SECRET` 保护的 `POST /api/seed`。

</details>

<details>
<summary><strong>README 图片 push 后不显示？</strong></summary>

确认 `docs/assets/readme/` 目录下的 PNG/GIF **已提交进 Git**（非 `.gitignore`）。README 使用相对路径 `./docs/assets/readme/xxx.png`，GitHub 会从仓库 raw 内容渲染。修改界面后运行 `npm run docs:assets` 重新生成并提交。

</details>

---

## 相关链接

| 资源 | 路径 |
|------|------|
| 环境变量模板 | [`.env.example`](./.env.example) |
| 数据模型 | [`prisma/schema.prisma`](./prisma/schema.prisma) |
| Render 部署 | [`render.yaml`](./render.yaml) |
| i18n 检查脚本 | [`scripts/check-i18n-hardcoded.mjs`](./scripts/check-i18n-hardcoded.mjs) |
| 截图生成脚本 | [`scripts/capture-readme-assets.mjs`](./scripts/capture-readme-assets.mjs) |

---

<p align="center">
  <sub>Built with ❤️ for the Vibe Coding community</sub>
</p>
