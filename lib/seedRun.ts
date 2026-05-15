import type { PrismaClient } from "@prisma/client";
import { DEMO_USER_ID } from "@/lib/constants";
import type { PostType } from "@/lib/domain/postType";
import type { Role } from "@/lib/domain/role";

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
  await prisma.marketItem.deleteMany();
  await prisma.tool.deleteMany();
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
            repoUrl: "https://github.com/example/vibecoding-demo",
            previewUrl: "https://example.com",
            stack: JSON.stringify(["Next.js", "Tailwind", "Prisma", "PostgreSQL"]),
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
                    repoUrl: "https://github.com/example/demo",
                    previewUrl: "https://example.com",
                    stack: JSON.stringify(["Next.js", "Tailwind", "Prisma"]),
                  },
                ]
              : [],
        },
      },
    });
  }

  const tools = [
    { name: "Cursor", category: "写代码", description: "AI 原生编辑器", avgRating: 4.8 },
    { name: "v0", category: "做网页", description: "从描述生成 UI", avgRating: 4.6 },
    { name: "Vercel", category: "自动部署", description: "前端部署与预览", avgRating: 4.7 },
    { name: "GitHub", category: "管理 GitHub", description: "代码托管与协作", avgRating: 4.9 },
    { name: "Claude", category: "写代码", description: "长上下文模型", avgRating: 4.7 },
    {
      name: "Midjourney",
      category: "生成图片或视频",
      description: "高质量图像生成与风格探索",
      avgRating: 4.5,
    },
  ];

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
}
