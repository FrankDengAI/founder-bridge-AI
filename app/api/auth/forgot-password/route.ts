import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "已改为账号密码登录，不支持邮箱找回密码" },
    { status: 410 },
  );
}
