// trailingSlash 설정이면 usePathname()이 "/register/"처럼 끝에 /를 붙여 돌려주므로
// 경로를 비교하기 전에 끝의 /를 떼어 "/register"로 맞춤 (루트 "/"는 그대로)
export function normalizePath(pathname: string | null): string {
  if (!pathname || pathname === "/")
    return "/";
  return pathname.replace(/\/+$/, "") || "/";
}
