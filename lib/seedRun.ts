import type { PrismaClient } from "@prisma/client";
import { DEMO_USER_ID } from "@/lib/constants";
import type { PostType } from "@/lib/domain/postType";
import type { Role } from "@/lib/domain/role";
import { computeRankScore } from "@/lib/models/rank";

const directions = [
  "AI编程教育",
  "出海SaaS",
  "本地生活小程序",
  "创作者工具",
  "B端效率工具",
  "社区与社交",
];

const keywordsPool = [
  "Next.js",
  "增长",
  "运营",
  "产品设计",
  "Prompt",
  "自动化",
  "数据分析",
  "品牌",
  "BD",
  "全栈",
  "移动端",
  "UI设计",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function randomRoles(n: number): Role[] {
  const all: Role[] = ["JUNGLE", "SUPPORT", "ADC"];
  const out: Role[] = [];
  for (let i = 0; i < n; i++) out.push(all[(i * 2) % 3]);
  return out;
}

export async function runSeedDatabase(prisma: PrismaClient) {
  await prisma.demoOrder.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.userLessonProgress.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.postSave.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.toolReview.deleteMany();
  await prisma.aiModelReview.deleteMany();
  await prisma.aiModel.deleteMany();
  await prisma.marketItem.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.template.deleteMany();
  await prisma.post.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: DEMO_USER_ID,
      displayName: "演示用户",
      avatarUrl: "https://i.pravatar.cc/150?u=demo",
      profile: {
        create: {
          role: "ADC",
          budgetTier: 2,
          intro: "独立开发者，想做一款 Vibe Coding 学习产品。",
          direction: "AI编程教育",
          skillKeywords: JSON.stringify(["Next.js", "Prompt", "全栈"]),
          interestTags: JSON.stringify(["AI编程", "VibeCoding", "独立开发"]),
          desiredPartnerRoles: JSON.stringify(
            ["JUNGLE", "SUPPORT"] satisfies Role[],
          ),
        },
      },
      projects: {
        create: [
          {
            name: "VibeCoding 演示应用",
            description: "面向创业者的 AI 协作平台 Demo，含匹配、发布与工具市场。",
            coverUrl: "https://picsum.photos/seed/vbc-demo/800/420",
            repoUrl: "https://github.com/example/vibecoding-demo",
            previewUrl: "https://example.com",
            stack: JSON.stringify(["Next.js", "Tailwind", "Prisma", "PostgreSQL"]),
            teamNeeds: "寻找增长与产品运营合伙人",
            stage: "MVP 已上线",
            tags: JSON.stringify(["AI", "社交", "创业"]),
            revenueBand: "演示收入 · 月入 3k（自述）",
          },
        ],
      },
    },
  });

  const roles: Role[] = ["JUNGLE", "SUPPORT", "ADC"];
  const postTypes: PostType[] = [
    "NOTE",
    "SHOWCASE",
    "TUTORIAL",
    "REVIEW",
    "IDEA",
    "RECRUIT",
  ];
  for (let i = 0; i < 24; i++) {
    const id = `user_seed_${String(i + 1).padStart(2, "0")}`;
    const role = roles[i % 3];
    const kws = [pick(keywordsPool, i), pick(keywordsPool, i + 3)];
    await prisma.user.create({
      data: {
        id,
        displayName: `创业者 ${i + 1}`,
        avatarUrl: `https://i.pravatar.cc/150?u=${id}`,
        profile: {
          create: {
            role,
            budgetTier: i % 5,
            intro: `擅长${kws.join("与")}，希望找到互补伙伴。`,
            direction: pick(directions, i),
            skillKeywords: JSON.stringify(kws),
            interestTags: JSON.stringify([
              pick(["AI编程", "出海", "工具", "社群", "增长"], i),
              "VibeCoding",
            ]),
            desiredPartnerRoles: JSON.stringify(randomRoles(2)),
          },
        },
        posts: {
          create: [
            {
              type: pick(postTypes, i),
              title: `从想法到上线：我的第 ${i + 1} 个小项目`,
              excerpt: "记录一次完整的 Vibe Coding 实践过程。",
              coverUrl: `https://picsum.photos/seed/vb${i}/400/520`,
              body: "这里是正文占位，可链接 GitHub 与产品预览。",
              likes: 20 + ((i * 7) % 200),
              saves: 5 + ((i * 3) % 80),
              tags: JSON.stringify(["VibeCoding", "AI", "独立开发"]),
            },
          ],
        },
        projects: {
          create:
            i % 2 === 0
              ? [
                  {
                    name: `项目 Alpha ${i}`,
                    description: `第 ${i + 1} 个演示项目，展示技术栈与团队需求。`,
                    coverUrl: `https://picsum.photos/seed/proj${i}/800/420`,
                    repoUrl: "https://github.com/example/demo",
                    previewUrl: "https://example.com",
                    stack: JSON.stringify(["Next.js", "Tailwind", "Prisma"]),
                    teamNeeds: i % 2 === 0 ? "缺前端/设计" : "缺增长合伙人",
                    stage: i % 3 === 0 ? "种子轮洽谈中" : "MVP",
                    tags: JSON.stringify(["创业", "Demo"]),
                  },
                ]
              : [],
        },
      },
    });
  }

  const tools = [
    { name: "Cursor", category: "写代码", description: "AI 原生编辑器", avgRating: 4.8 },
    { name: "v0", category: "产品原型", description: "从描述生成 UI", avgRating: 4.6 },
    { name: "Vercel", category: "自动部署", description: "前端部署与预览", avgRating: 4.7 },
    { name: "GitHub", category: "管理 GitHub", description: "代码托管与协作", avgRating: 4.9 },
    { name: "Claude", category: "写代码", description: "长上下文模型", avgRating: 4.7 },
    {
      name: "Midjourney",
      category: "生成图片或视频",
      description: "高质量图像生成与风格探索",
      avgRating: 4.5,
    },
    { name: "Figma", category: "产品原型", description: "界面设计与协作", avgRating: 4.8 },
    { name: "Hotjar", category: "用户测试", description: "热力图与用户录屏", avgRating: 4.3 },
    { name: "Notion", category: "需求管理", description: "PRD 与任务看板", avgRating: 4.6 },
  ];

  const templates = [
    {
      title: "Next.js 创业社交脚手架",
      description: "含认证、匹配与发布模块的 Starter Kit。",
      category: "全栈",
      stack: JSON.stringify(["Next.js", "Prisma", "PostgreSQL"]),
      copyCmd: "npx create-next-app@latest my-vibe-app",
      downloadUrl: "https://github.com/example/vibecoding-starter",
    },
    {
      title: "PRD 拆解 Prompt 包",
      description: "产品需求 → 用户故事 → MVP 边界。",
      category: "产品",
      stack: JSON.stringify(["Prompt", "PRD"]),
      copyCmd: "curl -O https://example.com/prd-pack.zip",
      downloadUrl: "https://example.com/prd-pack.zip",
    },
    {
      title: "出海 SaaS 落地页模板",
      description: "Tailwind + 多语言占位。",
      category: "前端",
      stack: JSON.stringify(["Tailwind", "i18n"]),
      copyCmd: "git clone https://github.com/example/saas-landing",
      downloadUrl: "https://github.com/example/saas-landing",
    },
    {
      title: "企业内部 OA 面板",
      description: "适用于老赵类企业管理场景。",
      category: "B端",
      stack: JSON.stringify(["React", "Ant Design"]),
      copyCmd: "npm create vite@latest oa-admin -- --template react-ts",
      downloadUrl: "https://github.com/example/oa-admin",
    },
    {
      title: "Agent 工作流 Demo",
      description: "LLM 工具链最小可运行示例。",
      category: "AI",
      stack: JSON.stringify(["Python", "LangChain"]),
      copyCmd: "pip install langchain openai",
      downloadUrl: "https://github.com/example/agent-flow",
    },
    {
      title: "短视频脚本生成器",
      description: "内容创作者开箱即用。",
      category: "内容",
      stack: JSON.stringify(["Prompt", "小红书"]),
      copyCmd: "npx vibe-script-gen",
      downloadUrl: "https://example.com/script-gen",
    },
  ];

  for (const tpl of templates) {
    await prisma.template.create({ data: tpl });
  }

  for (const t of tools) {
    const tool = await prisma.tool.create({ data: t });
    await prisma.toolReview.createMany({
      data: [
        {
          toolId: tool.id,
          userName: "用户A",
          rating: 5,
          comment: "上手快，适合新手。",
        },
        {
          toolId: tool.id,
          userName: "用户B",
          rating: 4,
          comment: "场景覆盖广。",
        },
      ],
    });
  }

  const aiModelsSeed = [
    {
      name: "GPT-4.1",
      provider: "OpenAI",
      description: "通用能力强，代码与推理均衡，生态插件丰富。",
      scenarios: ["coding", "writing", "reasoning"],
      strengths: ["工具调用", "多模态", "生态"],
      reviews: [
        { userName: "全栈小林", rating: 5, scenario: "coding", pros: "改 bug 稳", cons: "贵", comment: "日常开发首选，但长对话成本偏高。" },
        { userName: "PM阿宁", rating: 4, scenario: "prototype", pros: "PRD 拆解快", cons: "偶尔幻觉", comment: "写需求文档很顺手。" },
      ],
      discussionTitle: "GPT-4.1 写 Next.js 是不是比 Claude 更稳？",
    },
    {
      name: "Claude Sonnet 4",
      provider: "Anthropic",
      description: "长文与代码风格克制，前端重构体验好。",
      scenarios: ["coding", "writing", "context"],
      strengths: ["长上下文", "代码审美", "安全"],
      reviews: [
        { userName: "前端阿杰", rating: 5, scenario: "coding", pros: "组件结构清晰", cons: "国内访问", comment: "Tailwind 页面生成质量高。" },
        { userName: "创作者Mia", rating: 5, scenario: "writing", pros: "文风自然", cons: "推理略慢", comment: "长文润色比 GPT 更有人味。" },
        { userName: "独立开发K", rating: 4, scenario: "coding", pros: "重构耐心", cons: "工具链少", comment: "适合认真改代码，不适合快速原型。" },
      ],
      discussionTitle: "Claude 写前端是不是比 GPT 更稳？",
    },
    {
      name: "Claude Opus 4",
      provider: "Anthropic",
      description: "复杂推理与架构设计，适合难题与方案评审。",
      scenarios: ["reasoning", "coding", "context"],
      strengths: ["深度推理", "架构", "审查"],
      reviews: [
        { userName: "架构师老周", rating: 5, scenario: "reasoning", pros: "系统设计强", cons: "价格", comment: "做技术方案评审很值。" },
        { userName: "创业者L", rating: 4, scenario: "reasoning", pros: "逻辑链完整", cons: "响应慢", comment: "适合每周一次深度思考，不适合高频。" },
      ],
      discussionTitle: "Opus 做架构评审值不值这个价？",
    },
    {
      name: "Gemini 2.5 Pro",
      provider: "Google",
      description: "多模态与搜索增强，适合资料整合与原型。",
      scenarios: ["prototype", "writing", "reasoning"],
      strengths: ["多模态", "搜索", "长上下文"],
      reviews: [
        { userName: "产品新人", rating: 4, scenario: "prototype", pros: "信息整合快", cons: "代码细节", comment: "做竞品调研很方便。" },
        { userName: "设计小白", rating: 4, scenario: "prototype", pros: "图文理解", cons: "风格不统一", comment: "从截图反推布局有用。" },
      ],
      discussionTitle: "Gemini 做竞品调研体验如何？",
    },
    {
      name: "DeepSeek V3",
      provider: "DeepSeek",
      description: "国产高性价比，编程与数学表现突出。",
      scenarios: ["coding", "value", "reasoning"],
      strengths: ["性价比", "数学", "开源生态"],
      reviews: [
        { userName: "学生党", rating: 5, scenario: "value", pros: "便宜", cons: "英文文档", comment: "同样的预算能跑更多轮对话。" },
        { userName: "后端老王", rating: 4, scenario: "coding", pros: "算法题", cons: "UI 弱", comment: "写 API 和业务逻辑够用。" },
        { userName: "创业团队", rating: 5, scenario: "value", pros: "批量调用", cons: "品牌认知", comment: "早期团队控制 token 成本的好选择。" },
      ],
      discussionTitle: "DeepSeek 能替代 Claude 做日常开发吗？",
    },
    {
      name: "Qwen 2.5 Max",
      provider: "Alibaba",
      description: "中文理解好，适合国内内容与运营场景。",
      scenarios: ["writing", "coding", "value"],
      strengths: ["中文", "本地化", "API 稳定"],
      reviews: [
        { userName: "运营小夏", rating: 4, scenario: "writing", pros: "中文文案", cons: "创意上限", comment: "小红书/公众号初稿效率高。" },
        { userName: "全栈阿飞", rating: 4, scenario: "coding", pros: "国内延迟低", cons: "英文代码注释", comment: "国内部署友好。" },
      ],
      discussionTitle: "Qwen 写中文运营文案谁用过？",
    },
    {
      name: "Kimi k1.5",
      provider: "Moonshot",
      description: "超长上下文阅读，适合文档与代码库问答。",
      scenarios: ["context", "writing", "reasoning"],
      strengths: ["超长上下文", "文档", "阅读"],
      reviews: [
        { userName: "法务助理", rating: 4, scenario: "context", pros: "长 PDF", cons: "代码弱", comment: "扔整份合同进去问条款很省时间。" },
        { userName: "维护老项目", rating: 4, scenario: "context", pros: "读仓库", cons: "幻觉", comment: "问 legacy 代码比 Copilot 更敢给全局答案。" },
      ],
      discussionTitle: "Kimi 读长文档 vs Claude 128k 怎么选？",
    },
    {
      name: "GPT-4o mini",
      provider: "OpenAI",
      description: "轻量快速，适合高频小任务与自动化脚本。",
      scenarios: ["value", "coding", "writing"],
      strengths: ["速度", "成本", "批量"],
      reviews: [
        { userName: "自动化党", rating: 4, scenario: "value", pros: "便宜快", cons: "复杂任务", comment: "Cron 里跑分类/摘要很合适。" },
        { userName: "独立黑客", rating: 3, scenario: "coding", pros: "响应快", cons: "深度不够", comment: "简单脚本 OK，架构别指望。" },
      ],
      discussionTitle: "4o mini 适合哪些自动化场景？",
    },
  ] as const;

  for (const m of aiModelsSeed) {
    const model = await prisma.aiModel.create({
      data: {
        name: m.name,
        provider: m.provider,
        description: m.description,
        logoUrl: `https://picsum.photos/seed/${encodeURIComponent(m.name)}/80/80`,
        websiteUrl: "https://example.com",
        strengths: JSON.stringify(m.strengths),
        scenarios: JSON.stringify(m.scenarios),
      },
    });

    for (const r of m.reviews) {
      await prisma.aiModelReview.create({
        data: {
          modelId: model.id,
          userName: r.userName,
          rating: r.rating,
          pros: r.pros,
          cons: r.cons,
          scenario: r.scenario,
          comment: r.comment,
        },
      });
    }

    const reviews = await prisma.aiModelReview.findMany({ where: { modelId: model.id } });
    const avg = reviews.reduce((s, x) => s + x.rating, 0) / Math.max(1, reviews.length);
    const avgRating = Math.round(avg * 10) / 10;
    const reviewCount = reviews.length;
    await prisma.aiModel.update({
      where: { id: model.id },
      data: {
        avgRating,
        reviewCount,
        rankScore: computeRankScore(avgRating, reviewCount),
      },
    });

    await prisma.post.create({
      data: {
        authorId: DEMO_USER_ID,
        type: "MODEL_DISCUSSION",
        title: m.discussionTitle,
        excerpt: `围绕 ${m.name} 的真实体验，欢迎补充你的场景与槽点。`,
        body: `## 讨论主题\n${m.discussionTitle}\n\n## 背景\n这是 VibeHub 模型评分社区的种子讨论帖，用来演示「短评 + 深聊」闭环。\n\n欢迎说说：你在什么场景下用 ${m.name}？和官方 benchmark 体验一致吗？`,
        status: "published",
        linkedModelId: model.id,
        coverUrl: `https://picsum.photos/seed/disc-${encodeURIComponent(m.name)}/800/420`,
        tags: JSON.stringify(["模型讨论", m.provider, "VibeHub"]),
        likes: 8 + reviewCount * 2,
        saves: 3 + reviewCount,
      },
    });
  }

  const marketRows = await prisma.$transaction([
    prisma.marketItem.create({
      data: {
        title: "Prompt 模板包 · 产品需求拆解",
        description: "含 PRD、用户故事与提示词骨架。",
        priceCents: 1990,
        itemType: "模板",
      },
    }),
    prisma.marketItem.create({
      data: {
        title: "Next.js + Prisma 脚手架",
        description: "含认证占位与部署脚本。",
        priceCents: 4990,
        itemType: "脚手架",
      },
    }),
    prisma.marketItem.create({
      data: {
        title: "冷启动增长咨询（1h）",
        description: "语音沟通，给可执行清单。",
        priceCents: 29900,
        itemType: "服务",
      },
    }),
  ]);

  const firstPost = await prisma.post.findFirst({
    where: { authorId: { not: DEMO_USER_ID } },
    orderBy: { createdAt: "asc" },
  });
  if (firstPost) {
    await prisma.comment.createMany({
      data: [
        {
          postId: firstPost.id,
          authorId: DEMO_USER_ID,
          body: "这条笔记结构很清晰，适合当模板。",
        },
        {
          postId: firstPost.id,
          authorId: "user_seed_02",
          body: "感谢分享，已收藏到本地。",
        },
      ],
    });
  }

  await prisma.follow.createMany({
    data: [
      { followerId: DEMO_USER_ID, followingId: "user_seed_01" },
      { followerId: DEMO_USER_ID, followingId: "user_seed_02" },
      { followerId: "user_seed_03", followingId: DEMO_USER_ID },
    ],
  });

  await prisma.userLessonProgress.createMany({
    data: [
      { userId: DEMO_USER_ID, step: 1, done: true },
      { userId: DEMO_USER_ID, step: 2, done: true },
      { userId: DEMO_USER_ID, step: 3, done: true },
    ],
  });

  await prisma.wishlistItem.create({
    data: { userId: DEMO_USER_ID, marketId: marketRows[0].id },
  });

  await prisma.demoOrder.create({
    data: { userId: DEMO_USER_ID, marketId: marketRows[1].id, status: "DEMO_PAID" },
  });

  await prisma.post.create({
    data: {
      authorId: DEMO_USER_ID,
      type: "RECRUIT",
      title: "招募增长合伙人 · VibeCoding 冷启动",
      excerpt: "每周 15h+ · 股权 + 项目分成 · 远程 OK",
      body: "## 我们在做什么\nVibeCoding 创业社交平台。\n\n## 你需要\n渠道、投放或社群增长经验。",
      status: "published",
      meta: JSON.stringify({
        recruitRole: "JUNGLE",
        recruitTime: "每周 15h+",
        recruitComp: "股权 + 项目分成",
      }),
      coverUrl: "https://picsum.photos/seed/recruit-demo/800/1000",
      tags: JSON.stringify(["招募", "VibeCoding"]),
      likes: 42,
      saves: 18,
    },
  });
}
