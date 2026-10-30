import axios from "axios";

// 로그인 정보 삭제: 토큰(로그인 유지 여부에 따라 둘 중 한 곳에 저장)과 화면 이동용 쿠키
export function clearSession() {
  sessionStorage.removeItem("token");
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
  document.cookie = "login_token=true; path=/; max-age=0; SameSite=Lax";
};
