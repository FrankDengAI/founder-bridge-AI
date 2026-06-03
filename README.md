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
    <strong>37</strong> 页面 · <strong>31</strong> API · <strong>1286+</strong> i18n 键 · <strong>28</strong> 种子用户 · 先逛后登 · App / Web 双模式
  </sub>
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> ·
  <a href="#产品演示">产品演示</a> ·
  <a href="#界面一览">界面一览</a> ·
  <a href="#完整路由">完整路由</a> ·
  <a href="#账户与认证">账户</a> ·
  <a href="#架构图解">架构图</a> ·
  <a href="#伙伴匹配算法详解">匹配算法</a> ·
  <a href="#界面与模块详解">设计说明</a> ·
  <a href="#部署指南">部署</a>
</p>

---

## 目录

**怎么读这份 README？**

| 你是谁 | 建议阅读顺序 |
|--------|----------------|
| 完全不懂技术 | 先 [术语小词典](#术语小词典看不懂可先看这里) → [核心能力](#核心能力) → [界面与模块详解](#界面与模块详解) |
| 产品 / 运营 | [产品设计哲学](#产品设计哲学) → [界面与模块详解](#界面与模块详解) → [产品路径](#产品路径) |
| 开发者 | [快速开始](#快速开始) → [伙伴匹配算法详解](#伙伴匹配算法详解) → [系统架构](#系统架构) → [技术架构文档](./docs/ARCHITECTURE.md) |
| 投资人 / 路演 | [产品演示](#产品演示) → [品牌站亮点](#品牌站亮点) → [架构图解 §4](#4-五大产品子系统) |

<details>
<summary><strong>展开完整目录</strong></summary>

- [产品演示](#产品演示)
- [品牌站亮点](#品牌站亮点)
- [界面一览](#界面一览)
- [核心能力](#核心能力)
- [产品设计哲学](#产品设计哲学)
- [界面与模块详解](#界面与模块详解)
  - [发现 / 匹配 / 消息 / 注册 / 我的 / 品牌 / 工具](#发现首页-home)
- [产品路径](#产品路径)
- [伙伴匹配算法详解](#伙伴匹配算法详解)
- [项目简介](#项目简介)
- [快速开始](#快速开始)
- [账户与认证](#账户与认证)
- [技术栈](#技术栈)
- [系统架构](#系统架构) · [架构图解](#架构图解)
- [技术架构与算法](./docs/ARCHITECTURE.md)
- [完整路由](#完整路由) · [API 概览](#api-概览)
- [环境变量](#环境变量) · [常用命令](#常用命令) · [部署指南](#部署指南)
- [开发规范](#开发规范) · [常见问题](#常见问题)

</details>

### 术语小词典（看不懂可先看这里）

| 词 | 通俗解释 |
|----|----------|
| **画像 / 资料** | 你在平台填的角色、技能、方向、简介等，用来帮你找队友 |
| **匹配** | 根据资料给其他人打分排序，推荐更合适的创业伙伴 |
| **七维雷达** | 用 7 个方面（角色、技能、方向等）画成的图，帮你看清「合不合适」 |
| **理由文案** | 系统用大白话写的几句话，解释为什么推荐这个人 |
| **今日一人** | 首页每天固定推荐 1 位候选人，同一天看到的都是同一个人 |
| **私信 / 会话** | 两人一对一聊天，类似微信私聊 |
| **冷启动** | 新用户资料还很少时，平台仍先给你能看的内容，不让你对着空白页 |
| **API** | 网页和服务器之间传数据的「接口」，用户一般无感 |
| **数据库** | 存用户、帖子、消息的地方，本项目用 PostgreSQL |

> 带文件名、英文函数名的表格主要给开发者看；**普通读者只看「作用」和「为什么」两列即可。**

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

官网首页（`/`）和手机 App **共用同一份真实数据**（不是两张皮），方便对外介绍时「说的和用的是一套」。

> **注意：** 官网上看到的匹配雷达图是**事先画好的展示效果**，用来好看、好传播；**真正会随你资料变化的分数**，要在 App 里打开 [伙伴匹配](#伙伴匹配-match) 才会计算。

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
      <a href="#发现首页-home"><img src="./docs/assets/readme/app-home-feed.png" alt="发现首页" width="100%" /></a><br/>
      <sub><strong>/home</strong> 发现 · 灵感流与今日推荐</sub>
    </td>
    <td align="center" width="33%">
      <a href="#伙伴匹配-match"><img src="./docs/assets/readme/app-match-results.png" alt="智能匹配" width="100%" /></a><br/>
      <sub><strong>/match</strong> 匹配 · 七维雷达与候选评分</sub>
    </td>
    <td align="center" width="33%">
      <a href="#工具与模型-tools-models"><img src="./docs/assets/readme/app-tools-market.png" alt="工具商城" width="100%" /></a><br/>
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
  <tr>
    <td align="center" width="33%" colspan="3">
      <sub><strong>/search</strong> 搜索 · 热搜榜 · 实时热榜（帖子 / 工具 / 模型）· 类型筛选与热度排序</sub>
    </td>
  </tr>
</table>

---

## 核心能力

| 你能做什么 | 为什么值得这样做 |
|------------|-------------------|
| **找队友** | 不只给个名单，还告诉你「哪里合拍」，才敢点「联系」 |
| **刷灵感、发帖** | 新人首页也不会空；老用户会看到更贴兴趣的内容 |
| **逛工具、看模型榜** | 围绕「写代码、做产品」的场景，让人愿意多停留 |
| **做任务、完善资料** | 把「填资料 → 去匹配 → 发消息」拆成小步，不那么容易第一天就走 |
| **中英文、品牌页** | 方便给外人演示；英文路径 `/en/...` 给海外协作者 |

> **一条主线：** 在匹配里点「联系」去聊天时，系统会记住「这是匹配来的」，方便以后统计「有多少人真的聊上了」，而不只是点进页面又离开。

<details>
<summary><strong>展开：各能力域截图与链接</strong></summary>

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="./docs/assets/readme/app-match-results.png" alt="匹配能力" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h4>匹配与社交</h4>
      <p><a href="#伙伴匹配-match">界面详解</a> · <a href="#5-伙伴匹配设计流水线">架构图</a> · <a href="./docs/ARCHITECTURE.md#23-七维打分公式">算法公式</a></p>
      <ul>
        <li>画像匹配 · 今日一人 · 雷达与理由 · 私信与会话</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="./docs/assets/readme/app-tools-market.png" alt="工具生态" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h4>工具与模型</h4>
      <p><a href="#工具与模型-tools-models">界面详解</a></p>
      <ul>
        <li>工具商城 · 大模型排行 · 模板与演示订单</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="./docs/assets/readme/marketing-pulse.png" alt="数据叙事" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h4>品牌叙事</h4>
      <p><a href="#品牌落地页">界面详解</a></p>
      <ul>
        <li>Pulse KPI · Bento 功能矩阵 · 雷达海报化传播</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="./docs/assets/readme/demo-locale-switch.gif" alt="国际化" width="100%" />
    </td>
    <td width="50%" valign="top">
      <h4>全球化</h4>
      <ul>
        <li>中英文界面 · 选过的语言会记住</li>
      </ul>
    </td>
  </tr>
</table>

</details>

---

## 产品设计哲学

我们想解决的不是「信息不够」，而是：**找不到合适的人，或者找到了也不敢发第一条消息**。

| 原则 | 大白话 | 产品里怎么做 |
|------|--------|----------------|
| **说得明白** | 推荐谁，要说清理由 | 雷达图 + 几句中文说明；不用「黑盒 AI」那种说不清为啥的结果 |
| **新人不尴尬** | 刚注册也不能空白首页 | 先选兴趣就能逛；首页仍有热门内容；资料不够会提示你去补 |
| **路径要短** | 别让人找半天 | 底部四个入口：发现、匹配、消息、我的；匹配完能直接聊 |
| **快慢自选** | 有人要快，有人要仪式感 | 匹配时可选调「快 / 正常 / 慢一点」的等待动画，也能跳过 |
| **演示能跑通** | 给别人看时要真有数据 | 官网和 App 同一套库；28 个种子用户 + `demo`/`demo1`–`demo3` 可直接密码登录 |

```mermaid
flowchart LR
  A["填好资料"] --> B["系统排序推荐"]
  B --> C["看懂推荐理由"]
  C --> D["一键发私信"]
  D --> E["第二天再来"]
  E --> A
```

---

## 界面与模块详解

> 按页面说明：**这块是干什么的 · 为什么这样设计**。  
> 表格里若有英文文件名，是给程序员对代码用的，**可以整列忽略**。

| 跳转 | 页面 |
|------|------|
| [全局导航](#全局底部导航与视图模式) | Tab · App/Web 模式（见下节标题） |
| [发现首页](#发现首页-home) | `/home` |
| [伙伴匹配](#伙伴匹配-match) | `/match`（字段与按钮最细） |
| [私信](#私信-messages) | `/messages` |
| [注册 Onboarding](#注册与-onboarding) | `/welcome/*` |
| [我的](#我的-me) | `/me` |
| [品牌站](#品牌落地页) | `/` |
| [工具与模型](#工具与模型-tools-models) | `/tools` · `/models` |
| [发布与搜索](#发布与搜索) | `/publish` · `/search` |

### 全局底部导航与视图模式

| 按钮 | 去哪个页面 | 为什么放这里 |
|------|------------|--------------|
| **发现** | 首页 `/home` | 大多数人习惯先「刷内容」，门槛最低 |
| **匹配** | `/match` | 这是平台最核心的能力，单独给一个入口 |
| **消息** | `/messages` | 有人找你聊天时，红点提醒；匹配完也常来这里 |
| **我的** | `/me` | 改资料、看成就、进设置，不挤在首页里 |

**手机版 / 电脑版**（注册后可选）：手机上像 App 一样底栏；电脑上左边导航、右边热榜，投屏演示更好看。选过一次会记住，不用每次问。

---

### 发现首页 /home

| 你看到的 | 是干什么的 | 为什么这样设计 |
|----------|------------|----------------|
| **今日一人** | 每天推荐 1 个可能合适的伙伴 | 一天一个，像「每日签到」，促使人打开首页；同一天不会乱跳 |
| **说你好** | 一键开聊 | 自动写好开场白，不用对着空白输入框发愁 |
| **黄色提示条** | 提醒「今天还没联系」 | 温和提醒，不弹窗轰炸 |
| **去完善资料** | 资料太少时跳转编辑页 | 写得越全，匹配越准 |
| **推荐帖子流** | 按兴趣、热度给你看帖 | 新人也有东西看；老用户越看越贴兴趣 |
| **类型筛选** | 只要笔记 / 项目等某一类 | 内容多时不眼花 |
| **今日任务** | 小任务：去匹配、发帖等 | 一步一步带着用，减少「不知道干啥」 |
| **⌘K / Ctrl+K** | 键盘快速搜页面 | 熟手提高效率（类似很多专业软件的命令面板） |

---

### 伙伴匹配 /match

注册时要选的三种「角色」，借用了游戏里的叫法，方便理解（**分数里大约占 26% 权重**）：

| 选项 | 适合谁 | 举例 |
|------|--------|------|
| **打野 JUNGLE** | 搞增长、商务、拉客户 | 运营、BD |
| **辅助 SUPPORT** | 产品、设计、运营 | 产品经理、设计师 |
| **射手 ADC** | 写代码、做交付 | 工程师、独立开发者 |

**页面怎么排？** 电脑上左边填资料、右边看名单；手机上先填资料再往下滑。名单上 **#1、#2** 表示推荐优先级。右上角能进「消息」，匹配到一半也能回聊天。

#### 填资料：每一项在算什么

| 你填的 | 占分大概比例 | 为啥要问 |
|--------|--------------|----------|
| **我的角色** | 约 26% | 系统更推荐「能和你互补」的人，而不是克隆一个你 |
| **技能关键词** | 约 18% | 看你们会不会同一套技术/能力；可点推荐词，少打字 |
| **创业方向** | 约 14% | 做的东西像不像一路人；有常用方向可一键选 |
| **期望伙伴角色** | 约 10% | 你说想找哪种人；双方都想要对方这类角色时，会排更前 |
| **兴趣相关（简介等）** | 约 16% | 简介和方向补全「像不像一路人」 |
| **资金档位** | 约 8% | 不问具体多少钱，只问阶段（0–4 档），差太多会提醒 |
| **资料新不新** | 约 4% | 最近更新、写得认真的人略优先 |

#### 按钮是干什么的

| 按钮 | 你会感受到什么 | 为啥要有 |
|------|----------------|----------|
| **开始匹配** | 等一小段动画，然后出名单 | 不必先点保存也能试；动画让人觉得「确实在算」 |
| **快 / 正常 / 慢一点** | 等待时间长短不同 | 赶时间就快；想要仪式感就慢，会记住你的选择 |
| **重新匹配** | 改完资料再算一遍 | 立刻看新结果，不用刷新整页 |
| **跳过 / 取消动画** | 不等了或这次不算了 | 不强迫你看完动画 |
| **展开更多理由** | 先看两句，点开看七维图 | 列表别太挤；想深究再展开 |
| **联系 TA** | 跳进聊天，带好一句开场白 | 最关键的一步：从「看」到「聊」 |
| **查看主页** | 看对方更多帖子和介绍 | 聊之前先了解，减少尬聊 |
| **分享工具** | 去工具页 | 聊工具比聊「要不要合伙」压力小，也能带你逛站内别的内容 |

#### 分数怎么看

- 显示成 **0–100 分**，大家直观。
- 分成 **高匹配 / 中匹配 / 探索** 三档（大约 76 分以上、58 分以上、其余），不纠结差一两分。
- **不是只有第一名才值得聊**——「探索」档也鼓励你先打个招呼试试。

> **背后逻辑（可选读）：** 系统更推「不同角色搭档」（例如增长 + 技术），而不是两个完全一样的人。  
> **完整公式、权重为何这样定、与小红书/大厂推荐的区别** → 见下文 **[伙伴匹配算法详解](#伙伴匹配算法详解)**（与代码 [`lib/matching/score.ts`](./lib/matching/score.ts) 一一对应）。

---

## 伙伴匹配算法详解

本节回答三件事：**权重比例依据什么**、**最终分数怎么算出来**、**README 里图为什么有时画不出来**。实现以 [`lib/matching/score.ts`](./lib/matching/score.ts) 为准；程序员速查仍可用 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md#23-七维打分公式)。

### 权重是「抄小红书 / 大厂」的吗？

**不是。** 小红书、抖音、LinkedIn、Tinder 等产品的推荐权重与模型参数属于**商业机密**，不会公开；它们也普遍使用**海量行为日志 + 深度学习/召回排序**，与当前 demo 的「几十到几百人、资料以表单为主」的冷启动场景不同。

本项目的 **v2 七维加权** 是面向 **「创业组队找互补队友」** 的产品假设，在工程上做的**可解释启发式**（heuristic），具体数字在代码里以常量 `W_*` 写死，便于路演演示与后续 A/B 调参：

| 常量（代码） | 权重 | 对应你填的字段 | 设计意图（为何是这个量级） |
|:--:|:--:|--|--|
| `W_ROLE` | **0.26** | 我的角色 | 组队第一性问题往往是「缺哪种分工」；同角色对角线故意低分，跨角色（如增长×技术）更高 → 对齐 Belbin / 创业铁三角类「**互补 > 克隆**」共识 |
| `W_KW` | **0.18** | 技能关键词 | 能力栈是否对齐协作语言；与招聘/协作工具里的 skills overlap 类似，但不做简历 NLP |
| `W_DIR` | **0.14** | 创业方向 | 做的东西是否像「一路人」；权重低于角色，避免方向文案略写就压过硬分工 |
| `W_INT` | **0.16** | 简介 + 方向词 + 关键词拼合 | 补全「叙事层」相似度（兴趣画像），与 keywords 合计 **0.34**，体现「能做什么 + 想做什么」并重 |
| `W_RECIPROCITY` | **0.10** | 期望伙伴角色 | 借鉴相亲/招聘里的 **mutual preference**（双向意向）；双方都勾选对方角色类型时显著加分 |
| `W_BUDGET` | **0.08** | 资金档位 0–4 | 只表达投入阶段，不问具体金额；差一档仍可合作，故权重不宜过高 |
| `W_ACTIVITY` | **0.04** | 资料新鲜度与密度 | **tie-breaker**：避免僵尸资料排太前，但不主导「合不合拍」 |

**与常见「主流」机制的类比（仅思路，非数值抄袭）：**

| 产品类型 | 常见信号 | 本项目中的近似 |
|----------|----------|----------------|
| 内容流（小红书等） | 点击、完播、关注、话题 embedding | **不参与**伙伴匹配；`interestTags` 只用于首页帖子 [`lib/forYou.ts`](./lib/forYou.ts) |
| 职场社交（LinkedIn 等） | 技能、职位、共同连接 | `keywords` + `direction` + 部分 `interest` |
| 相亲/社交 App | 双向喜欢、活跃、距离 | `reciprocity` + `activity`（无 LBS） |
| 组队游戏匹配 | 角色定位、段位 | `role` 互补矩阵 + `desiredPartnerRoles` |

调权记录见 `score.ts` 顶部注释 **v2 多维加权**；若线上有真实「邀约率 / 回复率」数据，应改为**离线标定**或学习排序，而不是继续拍脑袋改常数。

### 总体公式（与 UI 的 0–100 分）

对当前用户画像 **me** 与候选人 **them**，先算七个维度子分 `s_* ∈ [0, 1]`，再加权：

```text
S_raw = 0.26·s_role + 0.18·s_kw + 0.14·s_dir + 0.16·s_int
      + 0.10·s_recip + 0.08·s_budget + 0.04·s_act
```

界面展示分（四舍五入整数）：

```text
S_ui = round(100 × S_raw)
```

档位（[`lib/matchUiCopy.ts`](./lib/matchUiCopy.ts)）：`S_ui ≥ 76` 高匹配 · `≥ 58` 中匹配 · 其余为探索档。

候选池内按 `S_raw` **降序**取 Top-N（[`lib/matching/rank.ts`](./lib/matching/rank.ts)）。首页「今日一人」对同一用户池按**日期哈希**稳定抽 1 人（`GET /api/match?daily=1`），避免同一天反复变。

### 七维子分：逐项公式

以下与 [`lib/matching/score.ts`](./lib/matching/score.ts)、[`lib/matching/roleMatrix.ts`](./lib/matching/roleMatrix.ts) **完全一致**。

#### 1. 角色互补 s_role（权重 0.26）

查表 `RAW[myRole][theirRole]`，再按**我方行**归一化到 [0, 1]：

```text
s_role = RAW[r_me][r_them] / max_{r' ∈ {JUNGLE,SUPPORT,ADC}} RAW[r_me][r']
```

原始矩阵（同角色偏低、跨角色偏高）：

| me / them | JUNGLE | SUPPORT | ADC |
|-----------|--------|---------|-----|
| JUNGLE | 0.45 | 0.82 | **0.95** |
| SUPPORT | 0.88 | 0.50 | 0.90 |
| ADC | **0.92** | 0.85 | 0.48 |

#### 2. 能力关键词 s_kw（权重 0.18）

设 `J(·,·)` 为集合 **Jaccard**，`C_TF(·,·)` 为技能标签词频向量的 **余弦相似度**：

```text
overlap = 0.5·J(K_me, K_them) + 0.5·C_TF(K_me, K_them)
```

期望角色加成 `b_desired`（me 勾选的期望伙伴类型）：

| 条件 | b_desired |
|------|-----------|
| 未勾选任何期望角色 | 0.55 |
| r_them ∈ desiredPartnerRoles_me | 1.0 |
| 否则 | 0.25 |

```text
s_kw = min(1, 0.6·overlap + 0.4·b_desired)
```

#### 3. 创业方向 s_dir（权重 0.14）

对 `direction` 字符串先 `normalize`（去空白、小写）。规则表：

| 条件 | s_dir |
|------|-------|
| 双方为空 | 0.55 |
| 仅一方为空 | 0.35 |
| 归一化后相等 | 1.0 |
| 一方字符串包含另一方 | 0.88 |
| 其他 | min(1, 0.5·J(tokens) + 0.5·bigramOverlap) |

`tokenize`：中英文混合轻量分词（中文按字、英文按词；过滤停用词）。`bigramOverlap` 为字符二元组上的重叠率。

#### 4. 兴趣画像 s_int（权重 0.16）

词池（对方同理得 P_them）：

```text
P_me = K_me ∪ tokenize(direction_me) ∪ tokenize(intro_me)
```

空池规则同 direction。否则：

```text
s_int = min(1, 0.6·C_TF(P_me, P_them) + 0.4·J(P_me, P_them))
```

> README 表格里的「兴趣相关（简介等）约 16%」对应这一维；**不是**注册页的 `interestTags`（后者只影响首页推帖）。

#### 5. 双向意向 s_recip（权重 0.10）

```text
theyWantMe = (r_me ∈ desiredPartnerRoles_them)
iWantThem  = (r_them ∈ desiredPartnerRoles_me)
```

| 条件 | s_recip |
|------|---------|
| theyWantMe 且 iWantThem | 1.0 |
| 恰一方为真 | 0.65 |
| 都未勾选 | max(0.3, 0.55 × s_role) |

#### 6. 资金档位 s_budget（权重 0.08）

`d = |budgetTier_me - budgetTier_them|`，档位 ∈ {0,…,4}：

| d | 0 | 1 | 2 | 3 | ≥4 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| s_budget | 1.00 | 0.82 | 0.58 | 0.35 | 0.15 |

#### 7. 活跃度 s_act（权重 0.04）

仅看**候选人**资料。新鲜度 `f`（按 `updatedAt` 距今天数）：

| 天数 | f |
|------|---|
| ≤7 | 1.0 |
| ≤30 | 0.85 |
| ≤90 | 0.65 |
| 更久 | 0.45 |

```text
s_act = min(1,
  0.55·f
+ 0.18·min(1, |intro|/180)
+ 0.12·𝟙[direction 非空]
+ 0.15·min(1, |skillKeywords|/6)
)
```

### 从公式到界面：流水线

```mermaid
flowchart TB
  Start["UserProfile 数据库"]
  Parse["parseProfile 解析 JSON 字段"]
  Pool["候选池 除自己外已完善资料用户"]
  Score["scorePair 逐对计算"]
  D1["s_role  w=0.26"]
  D2["s_kw  w=0.18"]
  D3["s_dir  w=0.14"]
  D4["s_int  w=0.16"]
  D5["s_recip  w=0.10"]
  D6["s_budget  w=0.08"]
  D7["s_act  w=0.04"]
  Total["S_raw 加权和"]
  Rank["rankCandidates 排序截断"]
  UI["雷达 breakdown + reasons 文案"]

  Start --> Parse
  Parse --> Score
  Pool --> Score
  Score --> D1
  Score --> D2
  Score --> D3
  Score --> D4
  Score --> D5
  Score --> D6
  Score --> D7
  D1 --> Total
  D2 --> Total
  D3 --> Total
  D4 --> Total
  D5 --> Total
  D6 --> Total
  D7 --> Total
  Total --> Rank --> UI
```

<details>
<summary><strong>纯文本版流水线（图无法显示时可看）</strong></summary>

```
UserProfile → parseProfile → scorePair(me, eachCandidate)
  ├─ s_role     × 0.26
  ├─ s_kw       × 0.18
  ├─ s_dir      × 0.14
  ├─ s_int      × 0.16
  ├─ s_recip    × 0.10
  ├─ s_budget   × 0.08
  └─ s_act      × 0.04
       → S_raw → 排序 → UI 百分制 + 最多 8 条 reasons
```

</details>

### 可解释文案 `reasons`

`scorePair` 在算分后按阈值追加中文说明（如双向意向命中、共同技能标签、资金差过大等），最多 **8 条**，与雷达七维同源，避免「分数和文案各说各话」。

### 为何 README 以前没写这么细？

历史原因：主 README 面向**产品 / 路演**读者，只保留「填什么 → 大概占几分 → 为啥要问」；完整公式放在 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) 给开发者。你反馈需要**一份文档里既能讲人话又能对公式**，因此把设计依据与公式前移到本节，并与代码常量对齐。

### 如何改权重或矩阵？

1. 修改 [`lib/matching/score.ts`](./lib/matching/score.ts) 顶部 `W_*`（须保持 **七项之和 = 1.0**）。  
2. 修改角色倾向则改 [`lib/matching/roleMatrix.ts`](./lib/matching/roleMatrix.ts) 的 `RAW`。  
3. 同步更新本节表格与 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md#23-七维打分公式)，避免文档与代码漂移。

---

### 私信 /messages

| 设计 | 通俗说明 |
|------|----------|
| **定时刷新消息**（大约 5～20 秒一次） | 不用很复杂的「实时长连接」，部署简单；创业私信也不需要毫秒级即时 |
| **只支持两人对话** | 就是一对一私聊，不搞群聊，先把「配对破冰」做好 |
| **记住「从匹配来的」** | 列表里能区分来源，方便以后统计有多少人真的聊了 |
| **进聊天页可带好一句话** | 减少「不知道第一句说什么」 |
| **未读红点** | 对方发来新消息、你没读到，就亮红点 |

---

### 注册与 Onboarding

| 步骤 | 为什么这样 |
|------|------------|
| **不用邮箱也能注册** | 少填一项，更快进来（以后需要可加邮箱验证） |
| **四步注册向导** | 渐变顶栏 + 进度条：账号 → 昵称 → 分工 → 兴趣（[`RegisterWizard`](./app/[locale]/(shell)/welcome/register/RegisterWizard.tsx)） |
| **中间要选角色** | 一注册就能用匹配 |
| **要选至少 1 个兴趣** | 首页推荐才有依据 |
| **访客模式** | 扫码先逛一圈，再决定是否注册 |
| **演示账号** | `demo` / `demo1`–`demo3` 密码 `12345678`（seed 写入）；或登录页「快速体验」 |
| **选手机版或电脑版** | 同一套产品，两种界面 |

---

### 我的 /me

| 模块 | 为什么 |
|------|--------|
| **资料完成度条** | 告诉你还差什么，补全后匹配更好 |
| **新手任务步骤** | 「去匹配、发帖…」打勾，有成就感 |
| **一堆快捷入口** | 常用功能集中，不用记路径 |
| **学习进度** | 课学到哪了，在个人中心就能看到 |

---

### 品牌落地页

| 模块 | 为什么 |
|------|--------|
| **大块功能拼图（Bento）** | 一屏看懂平台能干什么 |
| **雷达图** | 主要是好看、适合截图传播；**真实打分在 App 里** |
| **数据墙 Pulse** | 用图表讲平台故事（匹配、留存等） |
| **和 App 同一套数据** | 不是假网页，点进去真能用到功能 |

---

### 工具与模型 /tools · /models

| 设计 | 为什么 |
|------|--------|
| **评分 + 评价人数一起算榜** | 避免只有 1 条五星就霸榜 |
| **每周之星之类栏目** | 让人有理由常回来看看 |
| **匹配页里的「分享工具」** | 聊 AI 工具比聊合伙更轻松，也能带你逛这里 |

---

### 发布与搜索

| 页面 | 干什么 | 为什么 |
|------|--------|--------|
| **发布** | 写笔记、发项目、招募 | 一个入口够用；你发的内容会出现在首页流里 |
| **搜索** `/search` | 标题检索 + 类型 / 最新·热度排序 | 吸顶搜索框；未输入时展示**热搜榜**与**社区热榜**（综合 / 帖子 / 工具 / 模型 Tab，Top3 大卡 + 4–10 列表）；与 ⌘K 互补 |
| **帖子详情** | 点赞、评论、收藏 | 越热闹的内容越容易被推荐；游客点击触发登录弹层（先逛后登） |
| **他人主页** | 看对方公开信息 | 匹配前先了解；也方便分享链接 |

搜索相关组件：[`SearchTrendingBoard`](./components/search/SearchTrendingBoard.tsx) · [`SearchHotQueries`](./components/search/SearchHotQueries.tsx) · [`SearchDiscoverySections`](./components/search/SearchDiscoverySections.tsx)

---

### 几个设计点对照（给想深究的人）

| 你看到的 | 技术上 | 对用户的好处 |
|----------|--------|--------------|
| 七维雷达 | 七项打分再加权 | 知道哪里合拍 |
| 今日一人 | 每天固定算法抽 1 人 | 养成每天打开的习惯 |
| 匹配动画 | 只是前端等待效果 | 可选快慢，不增加服务器负担 |
| 不保存也能试匹配 | 草稿和已保存资料合并计算 | 敢随便试 |
| 匹配来源标记 | 聊天里记一笔来源 | 方便统计「匹配有没有促成聊天」 |

公式、权重设计依据与接口细节见 **[伙伴匹配算法详解](#伙伴匹配算法详解)** 与 [技术文档](./docs/ARCHITECTURE.md)。

---

## 产品路径

新用户从品牌站到主功能的典型路径（自上而下，避免交叉线）：

```mermaid
flowchart TB
  Landing["① 品牌站 /"]
  Welcome["② 注册登录 /welcome"]
  Mode["③ 选择视图 /welcome/mode"]
  Home["④ 发现首页 /home"]

  Landing --> Welcome
  Welcome --> Mode
  Mode --> Home

  Home --> Match["伙伴匹配 /match"]
  Home --> Publish["发布内容 /publish"]
  Home --> Tools["工具市场 /tools"]
  Home --> Learn["学习路径 /learn"]
  Home --> Workspace["工作台 /workspace"]

  Match --> Messages["私信 /messages"]
  Tools --> Models["模型排行 /models"]
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

> 想了解**每个页面、按钮为什么这样设计**？请阅读 [产品设计哲学](#产品设计哲学) 与 [界面与模块详解](#界面与模块详解)。技术实现见 [架构图解](#架构图解) 与 [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)。

| 能力域 | 一句话 | 详细设计说明 |
|--------|--------|----------------|
| 发现与内容 | 灵感流 + For You + 发布/搜索/热榜 | [发现首页](#发现首页-home) · [发布与搜索](#发布与搜索) |
| 匹配与社交 | 七维可解释匹配 → 私信闭环 | [伙伴匹配](#伙伴匹配-match) · [私信](#私信-messages) |
| 工具与模型 | 工具链 + 模型榜 + 模板演示 | [工具与模型](#工具与模型-tools-models) |
| 学习与成长 | 分步路径、成就、协作空间 | `/learn` · `/me/achievements` · `/collab/[id]` |
| 账户与安全 | 先逛后登 + 四步注册 + 演示密码号 | [先逛后登](#先逛后登弹窗登录) · [注册 Onboarding](#注册与-onboarding) · [账户与认证](#账户与认证) |

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

**本地可选**（开启演示/游客入口，便于体验匹配池）：

```env
ENABLE_DEMO_LOGIN=true
ENABLE_GUEST=true
```

### 3. 初始化数据库

```bash
npx prisma migrate deploy
npm run db:seed
```

写入 **28 个种子用户**（含 `demo` / `demo1`–`demo3` 可密码登录）+ 工具 / 模型 / 帖子等演示数据（详见 [账户与认证](#账户与认证)）。

### 4. 启动开发服务器

```bash
npm run dev          # 默认 http://localhost:3000
# 或（Windows 一键，默认 3001，自动 npm install）：
python main.py
```

| 入口 | 地址（以实际端口为准） |
|------|----------------------|
| 品牌落地页 | `http://localhost:3000/` 或 `3001` |
| 欢迎 / 注册 | `/welcome` · `/welcome/register` |
| 应用首页（中文） | `/home` |
| 搜索 / 热榜 | `/search` |
| 应用首页（英文） | `/en/home` |
| 健康检查 | `/api/health` |

**本地演示登录（需已 `db:seed`）：**

| 账号 | 密码 |
|------|------|
| `demo` | `12345678` |
| `demo1` · `demo2` · `demo3` | `12345678` |

### 5. 生产构建（本地验证）

```bash
npm run build
npm start
```

---

## 账户与认证

> **速查：** seed 后 **28** 个演示用户（其中 `demo` / `demo1`–`demo3` 可密码登录，默认 `12345678`）· 正式注册 **无需邮箱** · 账号 ≥3 位 + 密码 ≥8 位 + 昵称 + 角色 + ≥1 兴趣标签

### 数据库里有多少用户？

| 类型 | 数量 | 标识 | 密码登录 |
|------|:----:|------|:--------:|
| 可密码登录演示号 | 4 | `demo`、`demo1`、`demo2`、`demo3` | ✅ 统一 `12345678` |
| 匹配池创业者 | 24 | `founder_01` … `founder_24` | ❌¹ |
| **种子用户合计** | **28** | 均为 `isDemo: true` | 见上 |
| 正式注册用户 | 不限 | 自注册，`isDemo: false` | ✅ |
| 游客 | 按需 | `guest_*` 临时 ID | ❌ |

> ¹ `founder_xx` 仍无密码，仅用于匹配池；需 `ENABLE_DEMO_LOGIN=true` 走「快速体验」，或使用上表 `demo` / `demo1`–`demo3` 账号密码登录。密码由 `npm run db:seed` 写入（见 `lib/auth/demoSeed.ts` 中 `DEMO_SEED_PASSWORD`）。

**总用户数** = 25（seed）+ 正式注册数 + 游客数。  
`npm run db:seed` 为 **upsert**：刷新种子与 catalog，**不会删除**你已注册的真实账号。全量清空重建用 `npm run db:seed:reset`。

**匹配前提：** 至少 2 位用户有完整画像。seed 后已满足；若库中仅有 1 个真实用户，需再注册或执行 seed。

---

### 账号类型怎么选？

| | 正式注册 | 游客 | 演示（账号+密码） | 演示（快速体验） |
|---|:---:|:---:|:---:|:---:|
| 入口 | `/welcome/register` | `/welcome/guest` | `/welcome/login` 或首页登录弹层 | 登录页「快速体验」 |
| 环境开关 | 无 | `ENABLE_GUEST=true` | 无（seed 写入密码） | `ENABLE_DEMO_LOGIN=true` |
| 密码 | 自设 ≥8 位 | 无 | **`demo` / `demo1`–`demo3` → `12345678`** | 口令 `demo` 或留空（选种子 userId） |
| 邮箱 | 不需要 | 不需要 | 不需要 | 不需要 |
| 画像 | 账号+昵称+角色+兴趣 | 仅兴趣标签 | 预置完整资料 | 预置完整资料 |
| 适用 | 长期使用 | 零门槛试用 | **路演最快：直接输账号密码** | 本地选 `founder_xx` 等无密码种子 |

---

### 四种进入方式

```mermaid
flowchart TD
  Start["/welcome"] --> Browse["/home 先逛发现"]
  Start --> Reg["/welcome/register"]
  Start --> Login["/welcome/login"]
  Start --> Guest["/welcome/guest"]

  Browse --> Gate{"需要登录?"}
  Gate -->|弹窗/全屏| Login
  Login --> Mode["/welcome/mode?next=…"]
  Reg --> Mode
  Guest --> Mode
  Mode --> App["next 目标或 /home"]
```

| 方式 | 说明 |
|------|------|
| **正式注册** | 4 步向导 → 自动登录 → 模式选择 → 进入 App |
| **账号登录** | 已注册用户或 **`demo` / `demo1`–`demo3`**（密码 `12345678`，见 [`lib/auth/demoSeed.ts`](./lib/auth/demoSeed.ts)） |
| **游客** | 选 ≥1 兴趣标签即进 App；无密码，建议后续注册转正 |
| **快速体验** | `ENABLE_DEMO_LOGIN=true` 时选 `founder_xx` 等无密码种子（口令 `demo`） |

生产环境（[`render.yaml`](./render.yaml) 默认）关闭 `ENABLE_DEMO_LOGIN` 与 `ENABLE_GUEST`，仅保留注册 / 登录。

---

### 先逛后登（弹窗登录）

未登录用户**默认进入发现页** `/home` 浏览双列帖子流（`GET /api/posts` 只读可用），不再被 middleware 强制打到全屏 `/welcome`。

| 行为 | 说明 |
|------|------|
| 可游客访问 | 仅 `/home`（及 `/welcome/*`、公开 API） |
| 需登录操作 | 点帖子详情、底栏匹配/消息/我的、顶栏发布/搜索/⌘K 等 → **半透明登录弹层**，背后仍是发现流 |
| 直链受保护页 | 如 `/match` → `307` 到 `/home?auth=login&next=/match`，自动弹窗并在登录后跳转 |
| 全屏登录页 | `/welcome/login` 保留，供 embed、分享深链；主路径为弹窗 |

实现要点：`middleware.ts` 游客路径 · [`AuthGateProvider`](./components/auth/AuthGateProvider.tsx) / [`LoginModal`](./components/auth/LoginModal.tsx) · [`useRequireAuth`](./lib/hooks/useRequireAuth.ts) · 文案 `authModal.*`（`messages/zh.json`）。

**视图模式：** [`ViewModeGate`](./components/view-mode/ViewModeGate.tsx) 首访无 `sessionStorage` 时按视口静默默认 App/Web，**不阻断**直达 `/home`；仍可在 `/welcome/mode` 主动切换。

**自动化验收（需本地已 `npm run build` 且 `npm run start`；端口与 dev 一致，如 `3000` 或 `python main.py` 的 `3001`）：**

```bash
npm run smoke:guest          # 游客 middleware + /api/posts
npm run auth:smoke           # 注册/登录 API
npm run smoke:pages          # 登录后页面非 500
npm run test:e2e             # Playwright：先逛、弹窗、Feed/底栏、注册进匹配

# 非默认端口时：
# set PLAYWRIGHT_BASE_URL=http://localhost:3001   (Windows)
# PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e
```

> Edge middleware 仅校验 Cookie 形状与过期（[`sessionCookieEdge`](./lib/auth/sessionCookieEdge.ts)），完整验签在 Node API；演示环境可接受，生产请配置 `SESSION_SECRET`。

### 进入 / 返回 / 退出（导航约定）

统一由 [`lib/navBack.ts`](./lib/navBack.ts) 与 [`PageHeader`](./components/PageHeader.tsx) / [`BackButton`](./components/nav/BackButton.tsx) 处理：

| 场景 | 返回目标 | 说明 |
|------|----------|------|
| 帖子详情 `/post/:id` | `/home` | 从发现流进入 |
| 发布 / 搜索 / 模板等 | `/home` | 子功能回到发现枢纽 |
| 设置 / 创作者中心 | `/me` | 个人中心子页 |
| 设置 · 编辑资料 | `/settings` | 二级设置 |
| 工具 / 模型详情 | `/tools` 或 `/models` | 列表父级 |
| 欢迎页登录 / 注册 | `/home` | **先逛后登**主路径；欢迎页入口保留 |
| 模式选择 `/welcome/mode` | `/home` | 可跳过选模式先逛 |
| 主 Tab（发现/匹配/消息/我的） | 无顶栏返回钮 | 用底部 `BottomNav` |

**`next` 参数：** 登录 / 注册 / 弹窗注册链会带上 `?next=/post/xxx` 等，成功后进入原目标（全屏页走 `modeHref(next)`，弹窗走 `AuthGateProvider` + `router.push`）。

**退出登录：** 设置页登出后 middleware 不再放行受保护路由，会回到 `/home` 并保留游客可逛的发现流。

---

### 正式注册必填项

UI 四步向导 [`RegisterWizard`](./app/[locale]/(shell)/welcome/register/RegisterWizard.tsx) · API `POST /api/auth/register`

| 步骤 | 字段 | 校验规则 |
|:----:|------|----------|
| 1 | 账号 `username` | 字母开头；3–32 位；字母 / 数字 / `_`（存库自动小写） |
| 1 | 密码 `password` | **8–128** 位 |
| 1 | 确认密码 | 与密码一致 |
| 2 | 昵称 `displayName` | 非空 |
| 3 | 角色 `role` | `ADC` / `JUNGLE` / `SUPPORT`，默认 `ADC` |
| 4 | 兴趣 `interestTags` | **≥1** 个（下表 10 项） |

**角色含义：** `ADC` 射手·技术/交付 · `JUNGLE` 打野·增长/BD · `SUPPORT` 辅助·产品/运营

**兴趣标签（10 选 N）：**  
`AI编程` · `VibeCoding` · `独立开发` · `创业组队` · `增长与运营` · `产品与设计` · `工具测评` · `出海SaaS` · `社群与内容` · `投融资`

**不需要：** 邮箱 · 手机号 · 邀请码 · 验证码

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"xiaolin","password":"password1234","displayName":"小林","role":"ADC","interestTags":["VibeCoding"]}'
```

成功后写入 `User` + `UserProfile`，下发 Cookie `vbc_session`（HttpOnly，**30 天**），跳转 `/welcome/mode?next=/home`。

---

### 登录 API

| 场景 | `POST /api/auth/login` 请求体 |
|------|-------------------------------|
| 正式用户 / 演示密码号 | `{ "username": "demo", "password": "12345678" }`（`demo1`–`demo3` 同理） |
| 快速体验（无密码种子） | `{ "userId": "user_demo_vibe", "demoMode": true, "password": "demo" }`（需 `ENABLE_DEMO_LOGIN`） |

生产建议配置固定 `SESSION_SECRET`（≥32 位），避免 Render 重启后全员掉线。

---

### 种子数据明细（`db:seed` 后）

**用户（28）**

| 账号 | 密码登录 | 说明 |
|------|:--------:|------|
| `demo` | ✅ `12345678` | 主演示角色（`user_demo_vibe`），含示例项目与帖子 |
| `demo1` · `demo2` · `demo3` | ✅ `12345678` | 额外演示号，分工分别为增长 / 运营 / 技术 |
| `founder_01` … `founder_24` | ❌ | 匹配候选池；各含 Profile，多数有 Post / Project；走快速体验或注册 |

**Catalog（非用户，每次 seed 刷新）**

| 数据 | 数量 | 说明 |
|------|:----:|------|
| AI 工具 | 9 | Cursor、Claude、Figma 等 + 评价 |
| 大模型 | 10 | GPT-4.1、Claude、DeepSeek 等 + 讨论帖 |
| 模板 | 6 | Starter Kit、PRD Prompt 包等 |
| 市场商品 | 3+ | 模板包、课程等演示 SKU |
| 帖子 | 24+ | 种子用户 UGC + 模型讨论帖 |

---

### 认证相关环境变量

| 变量 | 本地建议 | 生产建议 |
|------|----------|----------|
| `ENABLE_DEMO_LOGIN` | `true`（可选） | `false` |
| `ENABLE_GUEST` | `true`（可选） | `false` |
| `SESSION_SECRET` | 可不设（有 dev fallback） | **必设** 固定随机串 |
| `RESEND_API_KEY` + `EMAIL_FROM` | 可选 | 需邮箱验证时再配 |

完整列表见 [环境变量](#环境变量)。

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

**通俗说：** 网站、接口、匹配计算、存数据，都在**同一套程序**里完成，像一家店里前台、后厨、仓库在一起，而不是三家分开的公司。

**技术说：** 本项目是 **Next.js 14 单仓单体**——浏览器只连一个 Node 服务；页面、接口、匹配、数据库都在一个代码仓库里，**不是**三套独立微服务。

```mermaid
flowchart TB
  Browser["浏览器"]

  subgraph NextApp ["Next.js 14 单进程"]
    MW["middleware 国际化与页面鉴权"]
    Pages["页面 app/locale"]
    API["接口 app/api"]
    Lib["业务库 lib"]
  end

  DB[("PostgreSQL")]

  Browser --> MW
  MW --> Pages
  MW --> API
  Pages --> API
  API --> Lib
  Lib --> DB
```

**补充：** 匹配打分在 [`lib/matching/`](./lib/matching/)；聊天是「定时刷新」拉新消息，没有做成微信那种秒级长连接。程序员看公式请打开 **[技术架构文档](./docs/ARCHITECTURE.md)** 或 **[架构图解](#架构图解)**。

**路由分组概览：**

| 路由组 | 路径示例 | 用途 |
|--------|----------|------|
| `(marketing)` | `/`、`/login` | 对外品牌与入口 |
| `(shell)/welcome` | `/welcome/login` | 注册、登录、访客 onboarding |
| `(shell)/(tabs)` | `/home`、`/match`、`/tools` | 登录后主应用 |
| `app/api` | `/api/posts`、`/api/match` | 后端 REST 接口 |

---

## 架构图解

> 给想看清「怎么串起来」的读者：每张图只讲一件事。  
> 不需要懂编程也能看懂大意；**匹配公式**见 [伙伴匹配算法详解](#伙伴匹配算法详解)，接口字段见 [技术文档](./docs/ARCHITECTURE.md)。

**若图显示 `Unable to render rich display`：** 常见于 Cursor / 部分 Markdown 预览器——(1) 节点文字里不要写半角 `%`（在 Mermaid 里会当成注释截断）；(2) 避免 `%%{init:...}%%` 主题行。本文已按此修正；仍失败时请用 [GitHub 网页预览](https://github.com) 打开本 README，或看各图下方的 **纯文本版** / [伙伴匹配算法详解](#伙伴匹配算法详解) 里的 ASCII 流水线。

### 1. 三大块：界面、服务器逻辑、算分规则

（部署上仍是**一个程序在跑**，只是分工不同。）

```mermaid
flowchart TB
  subgraph Frontend ["前端 · 展示与交互"]
    F1["页面 app/locale"]
    F2["组件 components"]
  end

  subgraph Backend ["后端 · HTTP 与数据"]
    B1["路由 app/api"]
    B2["鉴权 lib/auth"]
    B3["聊天 lib/chat"]
    B4["ORM lib/prisma"]
  end

  subgraph Algorithm ["算法 · 纯函数计算"]
    A1["伙伴匹配 lib/matching"]
    A2["帖子推荐 lib/forYou"]
    A3["模型榜 lib/models/rank"]
  end

  F1 --> B1
  F2 --> B1
  B1 --> A1
  B1 --> A2
  B1 --> B3
  A1 --> B4
  A2 --> B4
  B3 --> B4
  A3 --> B4
```

| 块 | 通俗理解 |
|----|----------|
| **界面** | 你在浏览器里点的页面、按钮、雷达图 |
| **服务器** | 登录、存消息、读数据库等「幕后工作」 |
| **算分规则** | 匹配打几分、首页推哪些帖——用写好的公式算，**不用 ChatGPT 那种大模型** |

---

### 2. 仓库目录职责

```mermaid
flowchart LR
  subgraph Root ["code_demo_web 根目录"]
    direction TB
    APP["app/ 页面与 API"]
    COMP["components/ UI 组件"]
    LIB["lib/ 业务与算法"]
    PRISMA["prisma/ 表结构与种子"]
    MSG["messages/ 中英文文案"]
    I18N["i18n/ 路由国际化"]
  end

  APP --> P1["locale 用户界面"]
  APP --> P2["api REST 接口"]
  LIB --> L1["matching 匹配引擎"]
  LIB --> L2["chat 会话逻辑"]
  LIB --> L3["auth 登录注册"]
  PRISMA --> DB[("PostgreSQL")]
```

---

### 3. 一次请求的旅程

```mermaid
sequenceDiagram
  participant U as 用户浏览器
  participant M as middleware
  participant P as 页面或 API
  participant L as lib 业务层
  participant D as PostgreSQL

  U->>M: 访问 /match 或 /api/match
  M->>M: 语言前缀与页面登录检查
  M->>P: 放行
  P->>L: 读 Cookie 取用户 ID
  L->>D: Prisma 查询或写入
  D-->>L: 数据
  L-->>P: 结果
  P-->>U: HTML 或 JSON
```

说明：`/api/*` 在 middleware 中不强制登录，由各接口自行返回 401。

---

### 4. 五大产品子系统

```mermaid
flowchart TB
  Hub["VibeCoding 创业社交平台"]

  subgraph Social ["社交与匹配"]
    S1["发现流 /home"]
    S2["伙伴匹配 /match"]
    S3["私信 /messages"]
    S4["用户主页 /user"]
  end

  subgraph Content ["内容与创作"]
    C1["发布 /publish"]
    C2["项目 /project"]
    C3["搜索 /search"]
  end

  subgraph Tools ["工具与模型"]
    T1["工具商城 /tools"]
    T2["模型排行 /models"]
    T3["模板 /templates"]
  end

  subgraph Growth ["学习与留存"]
    G1["学习路径 /learn"]
    G2["成就 /achievements"]
    G3["工作台 /workspace"]
  end

  subgraph Brand ["品牌与账户"]
    B1["营销站 /"]
    B2["注册登录 /welcome"]
  end

  Hub --> Social
  Hub --> Content
  Hub --> Tools
  Hub --> Growth
  Hub --> Brand
```

---

### 5. 伙伴匹配：设计流水线

匹配在服务端完成；前端只展示分数、雷达与理由文案。**七维公式、权重设计依据、百分制换算** 见 **[伙伴匹配算法详解](#伙伴匹配算法详解)**（含 Mermaid / ASCII 流水线图）。

| API | 用途 |
|-----|------|
| `POST /api/match` | 返回 Top-N 候选人 + breakdown |
| `GET /api/match?daily=1` | 首页「今日一人」（按日哈希稳定） |

**为什么不用「神秘 AI」，而用七项打分相加？**

| 好处 | 说明 |
|------|------|
| 说得清 | 每一项对应真实问题：角色合不合、技能像不像、方向近不近… |
| 好改 | 觉得「角色」该更重要？调一下比例就行，不用重新训练模型 |
| 好展示 | 雷达图和下面那几句理由，来自同一套计算 |
| 省钱 | 不调用付费 AI 接口，演示阶段够用 |
| 好回访 | 「今日一人」+ 理由，让人愿意明天再来看 |

控件级说明见 [伙伴匹配 /match](#伙伴匹配-match)。

---

### 6. 私信模块：设计逻辑

**不做相似度计算**；只做会话存储、未读判断与定时拉取。

**为什么聊天不用「秒回」那种实时通道？**

| 原因 | 说明 |
|------|------|
| 够用 | 创业私聊不需要像游戏语音那样即时 |
| 好部署 | 演示和上线都更简单 |
| 重点在匹配 | 先把「找对人说上话」做好 |

```mermaid
flowchart TB
  subgraph Client ["前端 MessagesClient"]
    List["会话列表"]
    Chat["聊天窗口"]
    Poll["定时轮询 5s / 20s"]
  end

  subgraph RestAPI ["REST 接口"]
    C1["GET /api/conversations"]
    C2["POST /api/conversations"]
    C3["GET/POST messages API"]
    C4["POST read API"]
  end

  subgraph Store ["数据库"]
    Conv["Conversation 会话"]
    Part["Participant 参与者"]
    Msg["Message 消息体 + meta"]
  end

  List --> C1
  Chat --> C3
  Chat --> C4
  Poll --> C1
  Poll --> C3

  C1 --> Conv
  C2 --> Conv
  C3 --> Msg
  C2 --> Part
  C4 --> Part
```

**未读规则：** 最后一条消息是对方发的，且你的 `lastReadAt` 早于该消息时间 → 显示红点。

**从匹配进入聊天：**

```mermaid
flowchart LR
  M["/match 点击联系"]
  API["POST conversations"]
  Page["/messages?peer=..."]
  M --> API --> Page
```

---

### 7. 认证与会话

```mermaid
flowchart TB
  Reg["注册 POST /api/auth/register"]
  Login["登录 POST /api/auth/login"]
  Cookie["Cookie vbc_session"]
  Session["Session 表"]
  Protected["受保护页面 /home /match ..."]

  Reg --> Cookie
  Login --> Cookie
  Cookie --> Session
  Cookie --> Protected
```

---

### 8. 主 Tab 与 API 对应关系

```mermaid
flowchart LR
  subgraph Tabs ["底部主 Tab"]
    H["/home"]
    Ma["/match"]
    Me["/messages"]
    My["/me"]
  end

  subgraph APIs ["主要 API"]
    A1["/api/feed /api/posts"]
    A2["/api/match /api/profile"]
    A3["/api/conversations"]
    A4["/api/me /api/profile"]
  end

  H --> A1
  Ma --> A2
  Me --> A3
  My --> A4
```

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
| **匹配** | `GET/POST /api/match` | 伙伴打分排序；画像读写见 `/api/profile` |
| **消息** | `GET/POST /api/conversations` · `.../messages` · `.../read` | 会话与已读 |
| **工具/模型** | `GET /api/models` · `POST .../reviews` · `tools/[id]/reviews` | 目录与评价 |
| **其他** | `GET /api/home/rail` · `learn/progress` · `wishlist` · `orders` · `templates` | 首页推荐 / 学习 / 心愿单 |
| **运维** | `POST /api/seed` | 演示种子（需 `DEMO_SEED_SECRET`） |

---

## 更新截图

README 视觉资源由 Playwright **自动生成**（[`docs/assets/readme/`](./docs/assets/readme/)）。**推送到 GitHub 前请运行下方命令并把生成的 PNG/GIF 一并提交**，否则 README 里的 `<img>` 会显示裂图（仓库里仅有 `manifest.json` 不够）。

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
| `ENABLE_DEMO_LOGIN` | 可选 | 演示快速登录（见 [账户与认证](#账户与认证)；生产 `false`） |
| `ENABLE_GUEST` | 可选 | 访客模式（生产 `false`） |
| `DEMO_SEED_SECRET` | 可选 | 保护 `/api/seed` |

> ⚠️ 切勿将 `.env.local` 提交到 Git。

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `python main.py` | Windows 一键启动 Next（默认 **3001**，可 `--port`） |
| `npm run dev` | 启动开发服务器（默认 3000） |
| `npm run build` | 生产构建 |
| `npm run check:i18n` | 扫描 UI 硬编码中文 |
| `npm run docs:assets` | 重新生成 README 截图与 GIF |
| `npm run db:seed` | 写入演示种子（含演示密码；见 `lib/auth/demoSeed.ts`） |
| `npm run db:seed:reset` | 全库清空后重建（慎用） |
| `npm run auth:smoke` | 认证流程冒烟测试 |
| `npm run smoke:guest` | 先逛后登：游客 `/home`、middleware |
| `npm run smoke:pages` | 受保护页面可达性测试 |
| `npm run test:e2e` | Playwright E2E（可用 `PLAYWRIGHT_BASE_URL` 改端口） |

---

## 目录结构

```
code_demo_web/
├── app/[locale]/           # 国际化页面（marketing + shell）
├── app/api/                # 31 个 REST Route Handlers
├── components/             # UI（Feed、Match、search/ 热榜与热搜…）
├── docs/assets/readme/     # README 截图 / GIF / manifest.json
├── i18n/                   # next-intl 配置
├── lib/                    # 业务逻辑、鉴权、匹配算法
├── docs/                   # ARCHITECTURE.md 技术架构与算法详解
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
<summary><strong>演示账号怎么登录？</strong></summary>

执行 `npm run db:seed` 后，可用 **账号 + 密码** 登录：

| 账号 | 密码 |
|------|------|
| `demo` | `12345678` |
| `demo1` · `demo2` · `demo3` | `12345678` |

密码定义见 [`lib/auth/demoSeed.ts`](./lib/auth/demoSeed.ts)（改 `DEMO_SEED_PASSWORD` 后需重新 seed）。

`founder_01` … `founder_24` **仍无密码**，仅匹配池；需 `ENABLE_DEMO_LOGIN=true` 的「快速体验」，或自行注册。

</details>

<details>
<summary><strong>重复执行 db:seed 会删掉我的账号吗？</strong></summary>

不会。默认 `npm run db:seed` 为 upsert：只刷新 **28** 个 `isDemo` 用户的内容与 catalog，**已注册的真实账号保留**。若需清空整库重建，使用 `npm run db:seed:reset`（慎用）。

</details>

<details>
<summary><strong>忘记密码怎么办？</strong></summary>

当前版本注册**不要求邮箱**，自助找回尚未默认开启。可在 `/welcome/forgot-password` 查看说明，或重新注册新账号。若已配置 Resend，可使用 `POST /api/auth/forgot-password` + `reset-password` 流程（需用户曾绑定邮箱）。

</details>

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

<details>
<summary><strong>匹配分数是怎么算出来的？会用 AI 吗？</strong></summary>

**不会**用 ChatGPT 这类大模型给你「算缘分」。服务器按你填的资料，从 **7 个方面** 分别打分（例如角色是否互补、关键词是否重合），再加权成一个总分，并写出几句中文理由。  
想看得更细：[技术文档 · 七维公式](./docs/ARCHITECTURE.md#23-七维打分公式)；想理解产品想法：[产品设计哲学](#产品设计哲学)。

</details>

<details>
<summary><strong>品牌站雷达和 App 里分数不一致？</strong></summary>

这是正常的。官网上的雷达多半是**固定展示图**，为了好看；**只有 App 里点「开始匹配」**，才会根据你的资料现场算分。

</details>

---

## 相关链接

| 资源 | 路径 |
|------|------|
| **技术架构与算法** | [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) |
| 环境变量模板 | [`.env.example`](./.env.example) |
| 数据模型 | [`prisma/schema.prisma`](./prisma/schema.prisma) |
| 匹配引擎 | [`lib/matching/score.ts`](./lib/matching/score.ts) |
| 种子逻辑 | [`lib/seedRun.ts`](./lib/seedRun.ts) |
| 注册 API | [`app/api/auth/register/route.ts`](./app/api/auth/register/route.ts) |
| 截图清单 | [`docs/assets/readme/manifest.json`](./docs/assets/readme/manifest.json) |
| 截图脚本 | [`scripts/capture-readme-assets.mjs`](./scripts/capture-readme-assets.mjs) |
| Render 部署 | [`render.yaml`](./render.yaml) |

---

<p align="center">
  <sub>Built with ❤️ for the Vibe Coding community</sub>
</p>
