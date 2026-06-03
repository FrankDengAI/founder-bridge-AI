import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookies } from "@/lib/session";
import { findOrCreateDirectConversation } from "@/lib/chat/conversations";
import { metaFromMessages } from "@/lib/chat/parseMeta";
import { dbErrorMessage } from "@/lib/dbErrorMessage";

export async function GET() {
  try {
    const userId = await getUserIdFromCookies();
    if (!userId) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const parts = await prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: { select: { id: true, displayName: true } } },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 8,
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: "desc" } },
    });

    const threads = parts.map((p) => {
      const peer = p.conversation.participants.find((x) => x.userId !== userId)?.user;
      const last = p.conversation.messages[0];
      const unread =
        last &&
        last.senderId !== userId &&
        (!p.lastReadAt || last.createdAt > p.lastReadAt);

      const meta = metaFromMessages(p.conversation.messages);

      return {
        id: p.conversationId,
        peerId: peer?.id ?? "",
        peerName: peer?.displayName ?? "用户",
        lastMessage: last?.body ?? "",
        updatedAt: p.conversation.updatedAt.getTime(),
        unread: Boolean(unread),
        source: meta.source === "match" ? "match" : undefined,
        contextTitle: typeof meta.contextTitle === "string" ? meta.contextTitle : undefined,
      };
    });

    return NextResponse.json({ conversations: threads });
  } catch (err) {
    console.error("[api/conversations GET]", err);
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 503 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromCookies();
    if (!userId) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const body = (await req.json()) as { peerId?: string; meta?: Record<string, unknown> };
    const peerId = body.peerId?.trim();
    if (!peerId) return NextResponse.json({ error: "缺少 peerId" }, { status: 400 });

    const peer = await prisma.user.findUnique({ where: { id: peerId } });
    if (!peer) return NextResponse.json({ error: "用户不存在" }, { status: 404 });

    const conv = await findOrCreateDirectConversation(userId, peerId);

    if (body.meta && Object.keys(body.meta).length > 0) {
      const msgCount = await prisma.message.count({
        where: { conversationId: conv.id },
      });
      if (msgCount === 0) {
        const draft =
          typeof body.meta.draftMessage === "string" ? body.meta.draftMessage.trim() : "";
        const bodyText =
          draft ||
          (body.meta.source === "match" ? "你好，通过匹配想聊聊合作。" : "");
        if (bodyText) {
          await prisma.message.create({
            data: {
              conversationId: conv.id,
              senderId: userId,
              body: bodyText,
              meta: JSON.stringify(body.meta),
            },
          });
          await prisma.conversation.update({
            where: { id: conv.id },
            data: { updatedAt: new Date() },
          });
        }
      }
    }

    return NextResponse.json({
      conversationId: conv.id,
      peerId: peer.id,
      peerName: peer.displayName,
    });
  } catch (err) {
    console.error("[api/conversations POST]", err);
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 503 });
  }
}
