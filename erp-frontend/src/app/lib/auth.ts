// 로그인 유지 여부에 따라 토큰을 한 곳에 저장하고 변경을 구독
const AUTH_CHANGED_EVENT = "erp:auth-changed";

export function getToken(): string | null {
  if (typeof window === "undefined")
    return null;

  return window.sessionStorage.getItem("token")
    || window.localStorage.getItem("token");
};

// 서버와 최초 hydration에서는 아직 브라우저 저장소를 확인하지 않은 상태
export function getServerToken(): undefined {
  return undefined;
};

export function subscribeToken(listener: () => void): () => void {
  if (typeof window === "undefined")
    return () => {};

  window.addEventListener(AUTH_CHANGED_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};

export function saveToken(token: string, rememberMe: boolean) {
  if (typeof window === "undefined")
    return;

  if (!token.trim())
    throw new Error("로그인 토큰이 없습니다.");

  try {
    window.sessionStorage.removeItem("token");
    window.localStorage.removeItem("token");

    const storage = rememberMe
      ? window.localStorage
      : window.sessionStorage;

    storage.setItem("token", token);
  } finally {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  };
};

export function clearSession() {
  if (typeof window === "undefined")
    return;

  try {
    window.sessionStorage.removeItem("token");
    window.localStorage.removeItem("token");
  } finally {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  };
};