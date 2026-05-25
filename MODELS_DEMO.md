# 大模型评分社区 · 演示路径

## 前置

```bash
cd code_demo_web
npx prisma db push
npm run db:seed
npm run dev
```

## 核心路径

| 步骤 | 路径 | 说明 |
|------|------|------|
| 1 | `/models` | 大模型排行榜，按场景筛选、综合分/评分/评价数排序 |
| 2 | `/models/[id]` | 模型详情：短评列表、提交评分、关联讨论帖 |
| 3 | 详情页「提交评价」 | 写入 `AiModelReview`，重算 `avgRating` / `rankScore` |
| 4 | 详情页「发起讨论」 | 跳转 `/publish?type=MODEL_DISCUSSION&modelId=...` |
| 5 | 发布讨论帖 | 帖子带 `linkedModelId`，详情页讨论区可见 |
| 6 | `/home` | 首页「热门模型」榜 Top 5 |
| 7 | `/learn` | 学习页「大模型评分榜」入口卡 |
| 8 | ⌘K 命令面板 | 搜索「模型」→ 大模型评分榜 |
| 9 | 底部导航 | 在 `/models` 时「学习」Tab 高亮 |

## 成就徽章

- **模型观察员**（`model_review_first`）：首次提交模型短评
- **榜单共建者**（`model_discussion_first`）：首次发布 `MODEL_DISCUSSION` 类型帖子

在 `/me/achievements` 查看。

## 排行榜算法

```
rankScore = avgRating × 0.7 + log10(reviewCount + 1) × 0.8
```

## 种子数据

`npm run db:seed` 会写入 8 个主流模型（GPT-4.1、Claude Sonnet/Opus、Gemini、DeepSeek、Qwen、Kimi、GPT-4o mini 等），每个模型 2–3 条短评 + 1 条 `MODEL_DISCUSSION` 讨论帖。
