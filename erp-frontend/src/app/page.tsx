"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as S from "@/assets/css/Style.style";

export default function Home() {
  const router = useRouter();
  // 입력값 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 백엔드 로그인 API 호출
      const response = await axios.post("/api/members/login", {
        email, password,
      });
      if (response.status === 200) {
        // 1. 백엔드에서 발급한 JWT 토큰을 localStorage에 저장
        const token = response.data.token;
        localStorage.setItem("token", token);

        // 2. 이후 모든 axios 요청 헤더에 JWT 토큰을 자동 포함하도록 설정
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        alert("로그인 성공!");
        router.push("/dashboard");
        // 로그인 성공 후 이동할 메인 페이지 (필요에 따라 수정)
      };
    } catch (err) {
      console.error("로그인 에러: ", err);
      alert("이메일 또는 비밀번호를 확인해주세요.");
    };
  };

  return (
    <S.Container>
      <S.Card>
        <S.ImageColumn/>
        <S.FormColumn>
          <S.Title>Welcome Back!</S.Title>
          <S.Form onSubmit={handleLogin}>
            <S.Input
            type="email"
            id="exampleInputEmail"
            name=""
            placeholder="Enter Email Address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required/>

            <S.Input
            type="password"
            id="exampleInputPassword"
            name=""
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>

            <S.CheckboxWrapper>
              <input type="checkbox" id="customCheck"/>
              <S.CheckboxLabel htmlFor="customCheck">
                Remember me
              </S.CheckboxLabel>
            </S.CheckboxWrapper>

            <S.Button type="submit">
              Login
            </S.Button>

            <S.Divider/>

            <S.SocialButton type="button" $provider="kakao">
              <i className="fab fa-google fa-fw"/>
              Login with Google
            </S.SocialButton>

            <S.SocialButton type="button" $provider="insta">
              <i className="fab fa-facebook-f fa-fw"/>
              Login with Instargram
            </S.SocialButton>

            <S.Divider/>

            <S.StyledLink href="/forgot">
              패스워드가 기억나지 않나요?
            </S.StyledLink>

            <S.StyledLink href="/member">
              회원가입
            </S.StyledLink>
          </S.Form>
        </S.FormColumn>
      </S.Card>
    </S.Container>
  );
};
