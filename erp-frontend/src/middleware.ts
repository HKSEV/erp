import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 사용자가 페이지를 이동할 때마다 서버에서 먼저 실행
export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const token = request.cookies.get("login_token")?.value;
  
  if (pathname.startsWith("/dashboard")) {
    if (!token)
      return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  };
};

// 성능 최적화: 특정 경로에서만 작동
export const config = {
  matcher: ["/dashboard/:path*"],
};