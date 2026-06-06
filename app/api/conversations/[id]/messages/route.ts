import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { assertConversationMember } from "@/lib/chat/conversations";
import { checkProfanity } from "@/lib/moderation/profanity";

type Ctx = { params: { id: string } };

function parseMeta(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function GET(req: Request, { params }: Ctx) {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    await assertConversationMember(params.id, userId);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const participants = await prisma.conversationParticipant.findMany({
    where: { conversationId: params.id },
    select: { userId: true, lastReadAt: true },
  });
  const peerPart = participants.find((p) => p.userId !== userId);
  const peerLastReadAt = peerPart?.lastReadAt?.getTime() ?? null;

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
    peerLastReadAt,
    messages: messages.reverse().map((m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.sender.displayName,
      body: m.body,
      createdAt: m.createdAt.getTime(),
      meta: parseMeta(m.meta),
    })),
  });
}

export async function POST(req: Request, { params }: Ctx) {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    await assertConversationMember(params.id, userId);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as {
    body?: string;
    meta?: Record<string, unknown>;
  };
  const text = body.body?.trim() ?? "";
  const meta = body.meta ?? {};
  const isImage = meta.type === "image" && typeof meta.url === "string";

  if (!text && !isImage) {
    return NextResponse.json({ error: "empty message" }, { status: 400 });
  }

  if (text) {
    const { blocked } = checkProfanity(text);
    if (blocked) {
      return NextResponse.json(
        { error: "profanity", message: "Content contains prohibited words." },
        { status: 422 },
      );
    }
  }

  if (isImage) {
    const url = meta.url as string;
    if (!url.startsWith("/uploads/messages/")) {
      return NextResponse.json({ error: "invalid image url" }, { status: 400 });
    }
  }

  const msg = await prisma.message.create({
    data: {
      conversationId: params.id,
      senderId: userId,
      body: text || (isImage ? "[image]" : ""),
      meta: JSON.stringify(meta),
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
