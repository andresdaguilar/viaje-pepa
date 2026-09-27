import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_VALUE, authCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password?.trim() ?? "";
  if (password !== "pepa") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, AUTH_VALUE, authCookieOptions());
  return response;
}
