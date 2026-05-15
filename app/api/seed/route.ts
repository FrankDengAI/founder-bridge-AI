import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runSeedDatabase } from "@/lib/seedRun";

export async function POST(req: Request) {
  const secret = process.env.DEMO_SEED_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
  }
  const body = (await req.json().catch(() => ({}))) as { secret?: string };
  if (body.secret !== secret) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    await runSeedDatabase(prisma);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "seed failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
