import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "已改为账号密码登录，无需邮箱验证" },
    { status: 410 },
  );
}
