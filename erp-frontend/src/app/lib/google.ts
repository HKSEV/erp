import { isAxiosError } from "axios";
import api from "./api";

const FLOW_KEY = "erp:google-login";
const CALLBACK_PATH = "/oauth/google";
const RANDOM_PATTERN = /^[a-f0-9]{64}$/;

export interface GoogleOptions {
  rememberMe: boolean;
  signup?: boolean;
  firstName?: string;
  lastName?: string;
};

interface GoogleAuthorizeResponse {
  authorizationUrl: string;
  state: string;
  flowToken: string;
};

interface GoogleFlow {
  state: string;
  flowToken: string;
  rememberMe: boolean;
  expiresAt: number;
};

export async function startGoogleLogin(
  options: GoogleOptions,
  signal?: AbortSignal
) {
  const firstName = options.firstName?.trim();
  const lastName = options.lastName?.trim();

  if (options.signup && (!firstName || !lastName)) {
    throw new Error(
      "위의 성과 이름을 입력한 후 Google 가입을 진행해 주세요."
    );
  }

  const {data} = await api.post<GoogleAuthorizeResponse>(
    "/api/members/google/authorize",
    {signup: options.signup === true, firstName, lastName},
    {signal}
  );

  if (signal?.aborted)
    return;

  if (!data || typeof data.state !== "string"
    || !RANDOM_PATTERN.test(data.state)
    || typeof data.flowToken !== "string"
    || !RANDOM_PATTERN.test(data.flowToken)
    || typeof data.authorizationUrl !== "string") {
    throw new Error("Google 인증 요청을 생성하지 못했습니다.");
  }

  const url = new URL(data.authorizationUrl);

  if (url.origin !== "https://accounts.google.com"
    || url.pathname !== "/o/oauth2/v2/auth"
    || url.searchParams.get("state") !== data.state
    || url.searchParams.get("redirect_uri")
      !== window.location.origin + CALLBACK_PATH) {
    throw new Error(
      "Google 로그인 주소와 리디렉션 설정을 확인해 주세요."
    );
  }

  const flow: GoogleFlow = {
    state: data.state,
    flowToken: data.flowToken,
    rememberMe: options.rememberMe,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  sessionStorage.setItem(FLOW_KEY, JSON.stringify(flow));
  window.location.assign(url.toString());
};

export function exchangeGoogleCode() {
  const params = new URLSearchParams(window.location.search);
  const stored = sessionStorage.getItem(FLOW_KEY);

  sessionStorage.removeItem(FLOW_KEY);
  window.history.replaceState(
    window.history.state, "", CALLBACK_PATH
  );

  let flow: Partial<GoogleFlow> | null = null;

  try {
    flow = stored ? JSON.parse(stored) : null;
  } catch {
    throw new Error(
      "Google 로그인을 처음부터 다시 시도해 주세요."
    );
  }

  if (!flow || typeof flow !== "object"
    || typeof flow.state !== "string"
    || !RANDOM_PATTERN.test(flow.state)
    || typeof flow.flowToken !== "string"
    || !RANDOM_PATTERN.test(flow.flowToken)
    || typeof flow.expiresAt !== "number"
    || !Number.isFinite(flow.expiresAt)
    || flow.expiresAt <= Date.now()
    || params.getAll("state").length !== 1
    || params.get("state") !== flow.state) {
    throw new Error(
      "Google 인증 상태를 확인할 수 없습니다. 다시 시도해 주세요."
    );
  }

  if (params.has("error")) {
    throw new Error(
      "Google 로그인이 취소되었거나 인증에 실패했습니다."
    );
  }

  const code = params.get("code");

  if (!code || params.getAll("code").length !== 1) {
    throw new Error(
      "Google 인증 코드가 없습니다. 다시 시도해 주세요."
    );
  }

  return {
    rememberMe: flow.rememberMe === true,
    request: api.post<{token: string}>("/api/members/google", {
      code,
      state: flow.state,
      flowToken: flow.flowToken,
    }),
  };
};

export function getGoogleError(err: unknown) {
  const data = isAxiosError<string | {message?: unknown}>(err)
    ? err.response?.data
    : undefined;

  const message = typeof data === "string"
    ? data
    : data?.message;

  return typeof message === "string" && message.trim()
    ? message
    : !isAxiosError(err) && err instanceof Error
    ? err.message
    : "Google 인증에 실패했습니다. 다시 시도해 주세요.";
};
