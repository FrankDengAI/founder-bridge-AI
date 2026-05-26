import { WorkspaceDashboard } from "@/components/WorkspaceDashboard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const [postCount, userCount, toolCount, marketCount, projectCount] =
    await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.tool.count(),
      prisma.marketItem.count(),
      prisma.project.count(),
    ]);

  return (
    <WorkspaceDashboard
      stats={{
        posts: postCount,
        users: userCount,
        tools: toolCount,
        market: marketCount,
        projects: projectCount,
      }}
    />
  );
}
