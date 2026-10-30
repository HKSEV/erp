"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "@/app/lib/api";
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
        // 이전 로그인 정보가 반대쪽 저장소에 남지 않도록 정리
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", token);
        dispatch(setLogin({token}));

        const attributes = ["path=/", "SameSite=Lax",];
        if (rememberMe)
          attributes.push("max-age=3600");
        if (window.location.protocol === "https:")
          attributes.push("Secure");
        document.cookie = `login_token=true; ${attributes.join("; ")}`;

        // 2. 이후 모든 axios 요청 헤더에 JWT 토큰을 자동 포함하도록 설정
        // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        openAlertModal(
          "로그인 성공!",
          () => router.push("/dashboard"),
          {
            variant: "success",
            description: "정상적으로 로그인되었습니다.\n서비스를 이용해 보세요.",
          },
        );
      };
    } catch (err) {
      console.error("로그인 에러: ", err);
      openAlertModal(
        "로그인에 실패했습니다.",
        undefined,
        {
          variant: "error",
          description: "이메일 또는 비밀번호를 확인해 주세요.",
        },
      );
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
          <S.MemberSocialButton
          type="button"
          disabled={isLoading}>
            <FcGoogle aria-hidden="true"/>
            Google로 로그인하기
          </S.MemberSocialButton>
          <S.MemberSocialButton
          type="button"
          disabled={isLoading}>
            <S.InstagramIcon aria-hidden="true">
              <FiInstagram/>
            </S.InstagramIcon>
            Instargram으로 로그인하기
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
