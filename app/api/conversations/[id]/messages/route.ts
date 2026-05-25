import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { assertConversationMember } from "@/lib/chat/conversations";

type Ctx = { params: { id: string } };

export async function GET(req: Request, { params }: Ctx) {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    await assertConversationMember(params.id, userId);
  } catch {
    return NextResponse.json({ error: "无权访问" }, { status: 403 });
  }

  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor");
  const take = 50;

  const messages = await prisma.message.findMany({
    where: { conversationId: params.id },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { sender: { select: { id: true, displayName: true } } },
  });

  return NextResponse.json({
    messages: messages.reverse().map((m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.sender.displayName,
      body: m.body,
      createdAt: m.createdAt.getTime(),
      meta: m.meta,
    })),
  });
}

export async function POST(req: Request, { params }: Ctx) {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    await assertConversationMember(params.id, userId);
  } catch {
    return NextResponse.json({ error: "无权访问" }, { status: 403 });
  }

  const body = (await req.json()) as { body?: string; meta?: Record<string, unknown> };
  const text = body.body?.trim();
  if (!text) return NextResponse.json({ error: "消息不能为空" }, { status: 400 });

  const meta = body.meta ? JSON.stringify(body.meta) : "{}";

  const msg = await prisma.message.create({
    data: {
      conversationId: params.id,
      senderId: userId,
      body: text,
      meta,
    },
  });

  await prisma.conversation.update({
    where: { id: params.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({
    id: msg.id,
    createdAt: msg.createdAt.getTime(),
  });
}
