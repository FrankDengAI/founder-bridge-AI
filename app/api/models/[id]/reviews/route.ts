import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { computeRankScore, isModelScenarioId } from "@/lib/models/rank";
import { getUserIdFromCookies } from "@/lib/session";

type Ctx = { params: { id: string } };

export async function POST(req: Request, { params }: Ctx) {
  const sessionUserId = getUserIdFromCookies();
  if (!sessionUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    userName?: string;
    rating?: number;
    pros?: string;
    cons?: string;
    scenario?: string;
    comment?: string;
  };

  const model = await prisma.aiModel.findUnique({ where: { id: params.id } });
  if (!model) return NextResponse.json({ error: "not found" }, { status: 404 });

  const userName = body.userName?.trim() || "匿名用户";
  const ratingInput = Number(body.rating ?? 5);
  if (!Number.isFinite(ratingInput)) {
    return NextResponse.json({ error: "invalid rating" }, { status: 400 });
  }

  const rating = Math.min(5, Math.max(1, Math.floor(ratingInput)));
  const pros = (body.pros ?? "").trim().slice(0, 120);
  const cons = (body.cons ?? "").trim().slice(0, 120);
  const scenarioRaw = (body.scenario ?? "coding").trim();
  const scenario = isModelScenarioId(scenarioRaw) && scenarioRaw !== "all" ? scenarioRaw : "coding";
  const comment = (body.comment ?? "").trim().slice(0, 600);
  if (!pros && !cons && !comment) {
    return NextResponse.json({ error: "missing review content" }, { status: 400 });
  }

  const review = await prisma.aiModelReview.create({
    data: {
      modelId: params.id,
      userName,
      rating,
      pros,
      cons,
      scenario,
      comment,
    },
  });

  const reviews = await prisma.aiModelReview.findMany({
    where: { modelId: params.id },
  });
  const avg =
    reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, reviews.length);
  const avgRating = Math.round(avg * 10) / 10;
  const reviewCount = reviews.length;
  const rankScore = computeRankScore(avgRating, reviewCount);

  await prisma.aiModel.update({
    where: { id: params.id },
    data: { avgRating, reviewCount, rankScore },
  });

  revalidatePath(`/models/${params.id}`);
  revalidatePath("/models");
  revalidatePath("/home");
  revalidatePath("/learn");

  return NextResponse.json({
    ok: true,
    avgRating,
    reviewCount,
    rankScore,
    review: {
      id: review.id,
      userName: review.userName,
      rating: review.rating,
      pros: review.pros,
      cons: review.cons,
      scenario: review.scenario,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
    },
  });
}
