import type { Role } from "@/lib/domain/role";
import type { PostType } from "@/lib/domain/postType";

export const ROLE_LABEL: Record<Role, string> = {
  JUNGLE: "打野 · 增长/BD",
  SUPPORT: "辅助 · 产品/运营",
  ADC: "射手 · 技术/交付",
};

/** 匹配页：角色卡片说明（MOBA 隐喻 → 创业分工） */
export const ROLE_MATCH_DESC: Record<Role, string> = {
  JUNGLE:
    "擅长获客、渠道与商务拓展，把产品与市场连接起来，适合补「技术强但缺增长」的一侧。",
  SUPPORT:
    "擅长需求梳理、运营节奏与用户实验，能把想法拆成可执行里程碑，适合补「有产品但缺节奏」的一侧。",
  ADC:
    "擅长工程落地、架构与交付，能把方案写成稳定可用的产品，适合补「有想法但缺实现」的一侧。",
};

export const POST_TYPE_LABEL: Record<PostType, string> = {
  NOTE: "图文",
  VIDEO: "短视频",
  ARTICLE: "长文",
  SHOWCASE: "项目展示",
  REVIEW: "工具测评",
  IDEA: "创业想法",
  TUTORIAL: "教程",
  RECRUIT: "组队招募",
  MODEL_DISCUSSION: "模型讨论",
};
