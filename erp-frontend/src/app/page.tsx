"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiInstagram,
} from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useModal from "@/components/contexts/ModalContext";
import * as S from "@/assets/css/Style.styles";

export default function Home() {
  const router = useRouter();
  const {openAlertModal} = useModal();
  // 입력값 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 백엔드 로그인 API 호출
      const response = await axios.post("/api/members/login", {
        email, password,
      });
      if (response.status === 200) {
        // 1. 백엔드에서 발급한 JWT 토큰을 localStorage에 저장
        const token = response.data.token;
        localStorage.setItem("token", token);
        document.cookie = "login_token=true; path=/; max-age=86400;";

        // 2. 이후 모든 axios 요청 헤더에 JWT 토큰을 자동 포함하도록 설정
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        openAlertModal("로그인 성공!", () => router.push("/dashboard"));
      };
    } catch (err) {
      console.error("로그인 에러: ", err);
      openAlertModal("이메일 또는 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
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
              <input type="checkbox" name="remember"/>
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
          <S.MemberSocialButton
          type="button"
          disabled={isLoading}>
            <FcGoogle aria-hidden="true"/>
            Login with Google
          </S.MemberSocialButton>
          <S.MemberSocialButton
          type="button"
          disabled={isLoading}>
            <S.InstagramIcon aria-hidden="true">
              <FiInstagram/>
            </S.InstagramIcon>
            Login with Instargram
          </S.MemberSocialButton>
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
