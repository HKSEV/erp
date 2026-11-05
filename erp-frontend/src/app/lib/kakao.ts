import api from "./api";

const FLOW_KEY = "erp:kakao-login";
const CALLBACK_PATH = "/oauth/kakao";

interface KakaoOptions {
  rememberMe: boolean;
  signup?: boolean;
  firstName?: string;
  lastName?: string;
};

interface KakaoFlow extends KakaoOptions {
  state: string;
  expiresAt: number;
};

export function startKakaoLogin(options: KakaoOptions) {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri)
    throw new Error("카카오 로그인 설정을 확인해 주세요.");

  if (options.signup
    && (!options.firstName?.trim() || !options.lastName?.trim())) {
    throw new Error(
      "위의 성과 이름을 입력한 후 카카오 가입을 진행해 주세요."
    );
  }

  const state = Array.from(
    crypto.getRandomValues(new Uint8Array(32)),
    (byte) => byte.toString(16).padStart(2, "0")
  ).join("");

  const flow: KakaoFlow = {
    ...options,
    state,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };

  sessionStorage.setItem(FLOW_KEY, JSON.stringify(flow));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
  });

  window.location.assign(
    "https://kauth.kakao.com/oauth/authorize?" + params
  );
};

export function exchangeKakaoCode() {
  const params = new URLSearchParams(window.location.search);
  const stored = sessionStorage.getItem(FLOW_KEY);

  sessionStorage.removeItem(FLOW_KEY);
  window.history.replaceState(
    window.history.state, "", CALLBACK_PATH
  );

  if (!stored)
    throw new Error("카카오 로그인을 처음부터 다시 시도해 주세요.");

  const flow = JSON.parse(stored) as KakaoFlow;

  if (typeof flow.state !== "string"
    || !/^[a-f0-9]{64}$/.test(flow.state)
    || !Number.isFinite(flow.expiresAt)
    || flow.expiresAt < Date.now()
    || params.getAll("state").length !== 1
    || params.get("state") !== flow.state) {
    throw new Error(
      "카카오 인증 상태를 확인할 수 없습니다. 다시 시도해 주세요."
    );
  }

  if (params.has("error"))
    throw new Error("카카오 로그인이 취소되었거나 인증에 실패했습니다.");

  const code = params.get("code");

  if (!code || params.getAll("code").length !== 1)
    throw new Error("카카오 인증 코드가 없습니다. 다시 시도해 주세요.");

  return {
    rememberMe: flow.rememberMe === true,
    request: api.post<{token: string}>("/api/members/kakao", {
      code,
      state: flow.state,
      signup: flow.signup === true,
      firstName: flow.firstName,
      lastName: flow.lastName,
    }),
  };
};