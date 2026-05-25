import { prisma } from "@/lib/prisma";

/** 1:1 会话：按 userId 对排序后 find-or-create */
export async function findOrCreateDirectConversation(userA: string, userB: string) {
  if (userA === userB) throw new Error("cannot chat with self");

  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: userA } } },
        { participants: { some: { userId: userB } } },
      ],
    },
    include: {
      participants: { include: { user: { select: { id: true, displayName: true } } } },
    },
  });

  if (existing && existing.participants.length === 2) return existing;

  return prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId: userA }, { userId: userB }],
      },
    },
    include: {
      participants: { include: { user: { select: { id: true, displayName: true } } } },
    },
  });
}

export async function assertConversationMember(conversationId: string, userId: string) {
  const row = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!row) throw new Error("forbidden");
  return row;
}
