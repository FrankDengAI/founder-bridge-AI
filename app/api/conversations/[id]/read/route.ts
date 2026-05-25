import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { assertConversationMember } from "@/lib/chat/conversations";

type Ctx = { params: { id: string } };

export async function POST(_req: Request, { params }: Ctx) {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    await assertConversationMember(params.id, userId);
  } catch {
    return NextResponse.json({ error: "无权访问" }, { status: 403 });
  }

  await prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId: params.id, userId } },
    data: { lastReadAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
