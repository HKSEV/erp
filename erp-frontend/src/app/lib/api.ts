import axios, { isAxiosError } from "axios";
import { clearSession, getToken } from "@/app/lib/auth";

const api = axios.create();

const PUBLIC_AUTH_PATHS = new Set([
  "/api/members/login",
  "/api/members/register",
  "/api/members/google/authorize",
  "/api/members/google",
  "/api/members/kakao",
  "/api/members/forgot-password",
  "/api/members/reset-password",
]);

api.interceptors.request.use((config) => {
  if (typeof window === "undefined")
    return config;

  const token = getToken();

  if (token)
    config.headers.set("Authorization", `Bearer ${token}`);
  else
    config.headers.delete("Authorization");

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      const path = error.config?.url?.split("?")[0] ?? "";

      if (!PUBLIC_AUTH_PATHS.has(path)) {
        const token = getToken();
        const authorization = error.config?.headers.get("Authorization");

        // 이전 요청의 늦은 오류가 새 로그인을 해제하지 않도록 검사
        if (!token || authorization === `Bearer ${token}`)
          clearSession();
      };
    };

    return Promise.reject(error);
  }
);

export default api;
