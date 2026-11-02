"use client";

import React, { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { FiLock, FiMail, FiInfo, FiArrowLeft } from "react-icons/fi";
import api from "@/app/lib/api";
import useModal from "@/components/contexts/ModalContext";
import * as S from "@/assets/css/Style.styles";

export default function ForgotPassword() {
  const {openAlertModal} = useModal();
  const requestRef = useRef<AbortController | null>(null);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => () => {
    requestRef.current?.abort();
  }, []);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestRef.current)
      return;

    const controller = new AbortController();
    requestRef.current = controller;
    setIsLoading(true);

    try {
      await api.post(
        "/api/members/forgot-password",
        {email: email.trim()},
        {signal: controller.signal}
      );

      if (controller.signal.aborted)
        return;

      openAlertModal(
        "입력한 이메일로 가입된 계정이 있다면 재설정 링크가 발송됩니다.",
        undefined,
        {
          variant: "success",
          description: "메일함과 스팸함을 확인해 주세요.",
        }
      );
    } catch (err: unknown) {
      if (controller.signal.aborted)
        return;

      const data = isAxiosError<string | {message?: string}>(err)
        ? err.response?.data
        : undefined;

      const message = typeof data === "string"
        ? data
        : data?.message
          || "메일 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.";

      openAlertModal(message, undefined, {variant: "error"});
    } finally {
      if (!controller.signal.aborted) {
        requestRef.current = null;
        setIsLoading(false);
      };
    };
  };

  return (
    <S.MemberContainer>
      <S.MemberCard aria-labelledby="forgot-password-title">
        <S.MemberHeader>
          <S.MemberIcon aria-hidden="true">
            <FiLock/>
          </S.MemberIcon>
          <S.MemberTitle id="forgot-password-title">
            Forgot Your Password?
          </S.MemberTitle>
          <S.MemberDescription>
            가입한 이메일을 입력해 주세요.
            <br/>
            비밀번호 재설정 링크를 보내드릴게요.
          </S.MemberDescription>
        </S.MemberHeader>

        <S.MemberForm onSubmit={handleResetPassword}>
          <S.MemberField>
            <S.MemberInputLabel htmlFor="reset-email">
              이메일
            </S.MemberInputLabel>
            <S.MemberInputWrapper>
              <FiMail aria-hidden="true"/>
              <S.MemberInput
              id="reset-email"
              name="email"
              type="email"
              placeholder="Enter Email Address..."
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={100}
              disabled={isLoading}
              required/>
            </S.MemberInputWrapper>
          </S.MemberField>

          <S.MemberButton
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}>
            {isLoading ? "메일 발송 중..." : "재설정 링크 보내기"}
          </S.MemberButton>
        </S.MemberForm>

        <S.MemberHint>
          <FiInfo aria-hidden="true"/>
          <span>
            메일이 보이지 않으면 스팸함도 확인해 주세요.
          </span>
        </S.MemberHint>

        <S.MemberFooter style={{flexDirection: "column", gap: "1rem"}}>
          <S.MemberBackLink href="/">
            <FiArrowLeft aria-hidden="true"/>
            로그인으로 돌아가기
          </S.MemberBackLink>
          <span>
            아직 계정이 없으신가요?{" "}
            <S.MemberTextLink href="/register">
              회원가입
            </S.MemberTextLink>
          </span>
        </S.MemberFooter>
      </S.MemberCard>
    </S.MemberContainer>
  );
};
