"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// 전역 상태를 관리할 Redux
export const store = configureStore({
  reducer: {
    auth: authReducer,
  }
});

// 스토어에 정의된 전체 상태의 타입 구조를 추출하여 RootState 타입으로 정의
export type RootState = ReturnType<typeof store.getState>;

// 비동기 액션 등을 처리할 때 사용할 수 있는 디스패치의 타입 구조 정의
// Thunk: 당장 실행하지 않고 나중에 필요할 때 연산하기 위해 명시적으로 연산을 감싸주는 함수
export type AppDispatch = typeof store.dispatch;