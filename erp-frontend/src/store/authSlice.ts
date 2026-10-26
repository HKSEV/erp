"use client";

// 먼저 로그인한 토큰과 사용자 상태를 관리할 슬라이스
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null; // JWT 토큰 문자열이 들어가거나 없으면 null
  isAuthenticated: boolean; // 로그인 여부
  userInfo: {
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
  } | null;
};
/**
 * Authentication(인증)
 * Authorization(인가/권한부여)
 * Accounting(회계/과금)
 */
const storage: Storage | null =
  typeof window === "undefined"
    ? null
    : window.localStorage.getItem("token")
      ? window.localStorage
      : window.sessionStorage;

const token = storage?.getItem("token") ?? null;
const initialState: AuthState = {
  // SSR 환경에서 에러가 나지 않도록 window 객체 존재 여부를 확인한 뒤 
  // localStorage의 토큰을 가져옴
  token: token,
  isAuthenticated: !!token,
  userInfo: null,
};

// 인증 관련 전역 상태와 상태 변경 로직(reducer)을 하나로 묶어주는 슬라이스 생성
export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 로그인 성공
    setLogin: (state, action: PayloadAction<{
      token: string;
      userInfo?: any;
    }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (action.payload.userInfo)
        state.userInfo = action.payload.userInfo
      storage?.setItem("token", action.payload.token);
    },
    // 로그아웃
    setLogout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userInfo = null;
      storage?.removeItem("token");
    },
  }
});

// 컴포넌트에서 상태를 변경하기 위해 dispatch할 수 있는 액션 생성 함수 내보냄
export const { setLogin, setLogout } = AuthSlice.actions;

// 스토어 등록을 위해 리듀서 함수를 기본값으로 내보냄
export default AuthSlice.reducer;