"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { isAxiosError } from "axios";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import api from "@/app/lib/api";
import { saveToken } from "@/app/lib/auth";
import { startKakaoLogin } from "@/app/lib/kakao";
import useModal from "@/components/contexts/ModalContext";
import * as S from "@/assets/css/Style.styles";
import { setLogin } from "@/store/authSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {openAlertModal} = useModal();
  // 입력값 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => {
    requestRef.current?.abort();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestRef.current)
      return;

    const controller = new AbortController();
    requestRef.current = controller;
    setIsLoading(true);

    try {
      const {data} = await api.post<{token: string}>(
        "/api/members/login",
        {email: email.trim(), password},
        {signal: controller.signal}
      );

      if (controller.signal.aborted)
        return;

      const token = data?.token;

      if (typeof token !== "string" || !token.trim()) {
        openAlertModal("로그인 응답에 토큰이 없습니다.", undefined, {
          variant: "error",
        });
        return;
      };

      saveToken(token, rememberMe);
      dispatch(setLogin({token}));

      openAlertModal(
        "로그인 성공!",
        () => router.replace("/dashboard"),
        {
          variant: "success",
          description: "정상적으로 로그인되었습니다.\n서비스를 이용해 보세요.",
        }
      );
    } catch (err: unknown) {
      if (controller.signal.aborted)
        return;

      const data = isAxiosError<string | {message?: unknown}>(err)
        ? err.response?.data
        : undefined;

      const serverMessage = typeof data === "string" ? data : data?.message;
      const message = typeof serverMessage === "string" && serverMessage.trim()
        ? serverMessage
        : "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.";

      openAlertModal(message, undefined, {variant: "error"});
    } finally {
      if (!controller.signal.aborted) {
        requestRef.current = null;
        setIsLoading(false);
      };
    };
  };

  const handleGoogleLogin = () => {

  };

  const handleKakaoLogin = () => {
    try {
      startKakaoLogin({rememberMe});
    } catch (err: unknown) {
      openAlertModal(
        err instanceof Error
          ? err.message
          : "카카오 로그인에 실패했습니다.",
        undefined,
        {variant: "error"}
      );
    };
  };

  return (
    <S.MemberContainer>
      <S.MemberCard aria-labelledby="login-title">
        <S.MemberHeader>
          <S.MemberIcon aria-hidden="true">
            <FaUser/>
          </S.MemberIcon>
          <S.MemberTitle id="login-title">
            Welcome Back!
          </S.MemberTitle>
          <S.MemberDescription>
            계정에 로그인하고 시작하세요
          </S.MemberDescription>
        </S.MemberHeader>

        <S.MemberForm onSubmit={handleLogin}>
          <S.MemberField>
            <S.MemberInputLabel htmlFor="email">
              이메일
            </S.MemberInputLabel>
            <S.MemberInputWrapper>
              <FiMail aria-hidden="true"/>
              <S.MemberInput
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email Address..."
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required/>
            </S.MemberInputWrapper>
          </S.MemberField>

          <S.MemberField>
            <S.MemberInputLabel htmlFor="password">
              비밀번호
            </S.MemberInputLabel>
            <S.MemberInputWrapper>
              <FiLock aria-hidden="true"/>
              <S.MemberInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required/>
              <S.MemberPasswordToggle
              type="button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              aria-pressed={showPassword}
              aria-controls="password"
              onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <FiEyeOff aria-hidden="true"/>
                ) : (
                  <FiEye aria-hidden="true"/>
                )}
              </S.MemberPasswordToggle>
            </S.MemberInputWrapper>
          </S.MemberField>

          <S.MemberOptionWrapper>
            <S.MemberOptionLabel>
              <input
              type="checkbox"
              name="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}/>
              로그인 상태 유지
            </S.MemberOptionLabel>
            <S.MemberTextLink href="/forgot">
              비밀번호 찾기
            </S.MemberTextLink>
          </S.MemberOptionWrapper>

          <S.MemberButton type="submit" disabled={isLoading}>
            Login
          </S.MemberButton>
        </S.MemberForm>

        <S.MemberDivider/>

        <S.MemberSocialWrapper>
          <S.GoogleSocialButton
          type="button"
          disabled={isLoading}>
            <FcGoogle aria-hidden="true"/>
            Google로 로그인하기
          </S.GoogleSocialButton>
          <S.KakaoSocialButton
          type="button"
          onClick={handleKakaoLogin}
          disabled={isLoading}>
            <RiKakaoTalkFill aria-hidden="true"/>
            Kakao로 로그인하기
          </S.KakaoSocialButton>
        </S.MemberSocialWrapper>

        <S.MemberFooter>
          <span>아직 계정이 없으신가요?</span>
          <S.MemberTextLink href="/register">
            회원가입
          </S.MemberTextLink>
        </S.MemberFooter>
      </S.MemberCard>
    </S.MemberContainer>
  );
};
