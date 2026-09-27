import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_VALUE } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const unlocked = request.cookies.get(AUTH_COOKIE)?.value === AUTH_VALUE;

  if (pathname === "/entrar") {
    if (!unlocked) return NextResponse.next();
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (unlocked) return NextResponse.next();

  const login = new URL("/entrar", request.url);
  const next = `${pathname}${search}`;
  if (next !== "/") login.searchParams.set("next", next);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/entrar|api/salir).*)"],
};
