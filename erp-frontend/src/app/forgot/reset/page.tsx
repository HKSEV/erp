"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { FiLock, FiCheck, FiInfo, FiArrowLeft } from "react-icons/fi";
import api from "@/app/lib/api";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  getPasswordError,
} from "@/app/lib/password";
import useModal from "@/components/contexts/ModalContext";
import * as S from "@/assets/css/Style.styles";

export default function ResetPassword() {
  return (
    <>
      <title>비밀번호 재설정 | ERP</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="referrer" content="no-referrer" />

      <Suspense
      fallback={
        <S.MemberContainer>
          <S.MemberCard>
            <S.MemberDescription role="status">
              비밀번호 재설정 페이지를 불러오는 중입니다.
            </S.MemberDescription>
          </S.MemberCard>
        </S.MemberContainer>
      }>
        <ResetPasswordContent/>
      </Suspense>
    </>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const tokens = searchParams.getAll("token");
  const token = tokens.length === 1 ? tokens[0] : "";

  return <ResetPasswordForm key={token} token={token} />;
}

function ResetPasswordForm({token}: {token: string}) {
  const router = useRouter();
  const {openAlertModal} = useModal();

  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState("");

  const requestRef = useRef<AbortController | null>(null);
  const hasToken = /^[A-Za-z0-9_-]{43}$/.test(token);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  const showError = (message: string) => {
    setError(message);
    openAlertModal(message, undefined, { variant: "error" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestRef.current || isDone) return;

    if (!hasToken) {
      showError("올바른 재설정 링크로 다시 접속해 주세요.");
      return;
    };

    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      showError(passwordError);
      return;
    };

    if (newPassword !== passwordConfirm) {
      showError("비밀번호가 일치하지 않습니다.");
      return;
    };

    const controller = new AbortController();
    requestRef.current = controller;
    setIsLoading(true);
    setError("");

    try {
      await api.post(
        "/api/members/reset-password",
        {token, newPassword},
        {signal: controller.signal}
      );

      if (controller.signal.aborted) return;

      setNewPassword("");
      setPasswordConfirm("");
      setIsDone(true);

      openAlertModal(
        "비밀번호가 변경되었습니다.",
        () => router.replace("/"),
        {
          variant: "success",
          description: "새 비밀번호로 로그인해 주세요.",
          confirmText: "로그인하기",
        }
      );
    } catch (err: unknown) {
      if (controller.signal.aborted) return;

      const data = isAxiosError<string | {message?: string}>(err)
        ? err.response?.data
        : undefined;

      showError(
        typeof data === "string"
          ? data
          : data?.message
            || "비밀번호 변경에 실패했습니다. 다시 시도해 주세요."
      );
    } finally {
      if (!controller.signal.aborted) {
        requestRef.current = null;
        setIsLoading(false);
      };
    };
  };

  return (
    <S.MemberContainer>
      <S.MemberCard aria-labelledby="reset-password-title">
        <S.MemberHeader>
          <S.MemberIcon aria-hidden="true">
            {isDone ? <FiCheck /> : <FiLock />}
          </S.MemberIcon>

          <S.MemberTitle id="reset-password-title">
            {isDone ? "비밀번호 변경 완료" : "Reset Your Password"}
          </S.MemberTitle>

          <S.MemberDescription>
            {isDone
              ? "새 비밀번호로 로그인해 주세요."
              : "사용할 새 비밀번호를 입력해 주세요."}
          </S.MemberDescription>
        </S.MemberHeader>

        {isDone ? (
          <S.MemberHint role="status">
            비밀번호가 정상적으로 변경되었습니다.
          </S.MemberHint>
        ) : !hasToken ? (
          <S.MemberDescription role="alert">
            재설정 링크가 올바르지 않습니다.
            아래에서 새 링크를 요청해 주세요.
          </S.MemberDescription>
        ) : (
          <S.MemberForm onSubmit={handleSubmit} noValidate>
            {[
              {
                id: "new-password",
                label: "새 비밀번호",
                value: newPassword,
                setValue: setNewPassword,
              },
              {
                id: "password-confirm",
                label: "새 비밀번호 확인",
                value: passwordConfirm,
                setValue: setPasswordConfirm,
              },
            ].map((field) => (
              <S.MemberField key={field.id}>
                <S.MemberInputLabel htmlFor={field.id}>
                  {field.label}
                </S.MemberInputLabel>

                <S.MemberInputWrapper $disabled={isLoading}>
                  <FiLock aria-hidden="true"/>
                  <S.MemberInput
                  id={field.id}
                  name={field.id}
                  type="password"
                  placeholder={field.label}
                  autoComplete="new-password"
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={PASSWORD_MAX_LENGTH}
                  disabled={isLoading}
                  aria-describedby={
                    error
                      ? "reset-password-error"
                      : "reset-password-hint"
                  }
                  required/>
                </S.MemberInputWrapper>
              </S.MemberField>
            ))}

            {error && (
              <S.MemberDescription id="reset-password-error" role="alert">
                {error}
              </S.MemberDescription>
            )}

            <S.MemberButton
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "비밀번호 변경 중..." : "새 비밀번호 저장"}
            </S.MemberButton>
          </S.MemberForm>
        )}

        {!isDone && (
          <S.MemberHint id="reset-password-hint">
            <FiInfo aria-hidden="true"/>
            <span>
              링크는 발급 후 15분 동안 한 번만 사용할 수 있습니다.
            </span>
          </S.MemberHint>
        )}

        <S.MemberFooter style={{flexDirection: "column", gap: "1rem"}}>
          <S.MemberBackLink href="/">
            <FiArrowLeft aria-hidden="true"/>
            로그인으로 돌아가기
          </S.MemberBackLink>

          {!isDone && (
            <S.MemberTextLink href="/forgot">
              재설정 링크 다시 받기
            </S.MemberTextLink>
          )}
        </S.MemberFooter>
      </S.MemberCard>
    </S.MemberContainer>
  );
}