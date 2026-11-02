"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { isAxiosError } from "axios";
import api from "@/app/lib/api";
import {
  clearSession,
  getToken,
  getServerToken,
  subscribeToken,
} from "@/app/lib/auth";
import type { MemberProfile } from "@/app/types/Member";
import { setLogin, setLogout } from "@/store/authSlice";
import * as S from "@/assets/css/Style.styles";

interface Verification {
  token: string;
  attempt: number;
  status: "success" | "error";
  message?: string;
};

export default function AuthGuard({children}: {
  children: React.ReactNode
}) {
  const token = useSyncExternalStore<string | null | undefined>(
    subscribeToken, getToken, getServerToken
  );

  // 저장소를 확인하기 전에는 로그인 페이지로 이동하지 않음
  if (token === undefined)
    return <AuthStatus/>;

  return (
    <TokenVerification key={token ?? "anonymous"} token={token}>
      {children}
    </TokenVerification>
  );
};

function TokenVerification({children, token}: {
  children: React.ReactNode;
  token: string | null;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [attempt, setAttempt] = useState(0);
  const [verification, setVerification] = useState<Verification | null>(null);

  useEffect(() => {
    if (!token) {
      dispatch(setLogout());
      router.replace("/");
      return;
    };

    const controller = new AbortController();

    const verifyToken = async () => {
      try {
        const {data} = await api.get<MemberProfile>("/api/members/me", {
          signal: controller.signal,
        });

        if (controller.signal.aborted || getToken() !== token)
          return;

        dispatch(setLogin({token, userInfo: data}));
        setVerification({token, attempt, status: "success"});
      } catch (err: unknown) {
        if (controller.signal.aborted || getToken() !== token)
          return;

        if (isAxiosError(err) && (
          err.response?.status === 401 || err.response?.status === 403
        )) {
          clearSession();
          return;
        };

        const data = isAxiosError<string | {message?: unknown}>(err)
          ? err.response?.data
          : undefined;

        const serverMessage = typeof data === "string" ? data : data?.message;
        const message = typeof serverMessage === "string" && serverMessage.trim()
          ? serverMessage
          : "로그인 정보를 확인하지 못했습니다. 다시 시도해 주세요.";

        setVerification({token, attempt, status: "error", message});
      };
    };

    void verifyToken();

    return () => controller.abort();
  }, [token, attempt, dispatch, router]);

  const isCurrent = verification?.token === token
    && verification?.attempt === attempt;

  const isReady = Boolean(
    token && isCurrent && verification?.status === "success"
  );

  if (isReady)
    return <>{children}</>;

  const error = isCurrent && verification?.status === "error"
    ? verification.message
    : null;

  return (
    <AuthStatus
    error={error}
    onRetry={() => setAttempt((prev) => prev + 1)}/>
  );
};

function AuthStatus({error, onRetry}: {
  error?: string | null;
  onRetry?: () => void;
}) {
  return (
    <S.AuthLoadingScreen aria-busy={!error}>
      {!error && <S.CalLoadingSpinner aria-hidden="true"/>}

      <S.AuthLoadingMessage role={error ? "alert" : "status"}>
        {error || "로그인 정보를 확인하는 중입니다."}
      </S.AuthLoadingMessage>

      {error && onRetry && (
        <S.AuthRetryButton type="button" onClick={onRetry}>
          다시 확인
        </S.AuthRetryButton>
      )}
    </S.AuthLoadingScreen>
  );
};