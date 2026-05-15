export const LEARN_STEPS = [
  {
    title: "想法生成",
    summary: "把模糊冲动变成一句话产品愿景，并写下 3 个非目标。",
    checklist: ["用一句话描述用户", "写下不做的事情", "列出 3 个假设"],
  },
  {
    title: "需求拆解",
    summary: "把愿景拆成用户故事与页面清单，优先 MVP。",
    checklist: ["用户故事 ≤10 条", "页面/路由清单", "数据实体草图"],
  },
  {
    title: "提示词编写",
    summary: "为模型提供上下文、约束与输出格式，减少返工。",
    checklist: ["角色+目标+约束", "示例输入输出", "失败兜底策略"],
  },
  {
    title: "代码生成",
    summary: "小步提交：先跑通主路径，再补边界与样式。",
    checklist: ["目录结构约定", "类型与 lint", "最小可运行版本"],
  },
  {
    title: "页面设计",
    summary: "先信息层级与组件复用，再打磨视觉与动效。",
    checklist: ["设计 Token", "移动端优先", "可访问性对比度"],
  },
  {
    title: "GitHub 管理",
    summary: "分支策略、PR 描述模板、Issue 与里程碑。",
    checklist: ["README 快速开始", "环境变量说明", "发布标签"],
  },
  {
    title: "部署上线",
    summary: "预览环境、回滚策略、基础监控与日志。",
    checklist: ["预览域名", "构建缓存", "健康检查"],
  },
  {
    title: "用户反馈",
    summary: "埋点/访谈/工单闭环，把反馈映射到路线图。",
    checklist: ["关键漏斗事件", "反馈入口", "两周迭代节奏"],
  },
] as const;
