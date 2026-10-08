"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AlertModal } from "@/components/modal/AlertModal";
import * as S from "@/assets/css/Style.styles";

export default function Home() {
  const router = useRouter();
  // 입력값 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 모달 상태관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [nextRoute, setNextRoute] = useState("");

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
        document.cookie = "login_token=true; path=/; max-age=86400;";

        // 2. 이후 모든 axios 요청 헤더에 JWT 토큰을 자동 포함하도록 설정
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setModalMessage("로그인 성공!");
        setNextRoute("/dashboard");
        // 로그인 성공 후 이동할 메인 페이지 (필요에 따라 수정)
        setIsModalOpen(true);
      };
    } catch (err) {
      console.error("로그인 에러: ", err);
      setModalMessage("이메일 또는 비밀번호를 확인해주세요.");
      setNextRoute("");
      setIsModalOpen(true);
    };
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (nextRoute)
      router.push(nextRoute);
  };

  return (
    <>
      <S.MemberContainer>
        <S.MemberCard>
          <S.MemberImageColumn/>
          <S.MemberFormColumn>
            <S.MemberTitle>Welcome Back!</S.MemberTitle>
            <S.MemberForm onSubmit={handleLogin}>
              <S.MemberInput
              type="email"
              id="exampleInputEmail"
              name=""
              placeholder="Enter Email Address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required/>

              <S.MemberInput
              type="password"
              id="exampleInputPassword"
              name=""
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required/>

              <S.MemberCheckboxWrapper>
                <input type="checkbox" id="customCheck"/>
                <S.MemberCheckboxLabel htmlFor="customCheck">
                  Remember me
                </S.MemberCheckboxLabel>
              </S.MemberCheckboxWrapper>

              <S.Button
              $variant="primary"
              $size="medium"
              $fullWidth
              type="submit">
                Login
              </S.Button>

              <S.MemberDivider/>

              <S.Button
              $variant="kakao"
              $size="medium"
              $fullWidth>
                <i className="fab fa-google fa-fw"/>
                Login with Google
              </S.Button>

              <S.Button
              $variant="insta"
              $size="medium"
              $fullWidth>
                <i className="fab fa-facebook-f fa-fw"/>
                Login with Instargram
              </S.Button>

              <S.MemberDivider/>

              <S.MemberStyledLink href="/forgot">
                패스워드가 기억나지 않나요?
              </S.MemberStyledLink>

              <S.MemberStyledLink href="/member">
                회원가입
              </S.MemberStyledLink>
            </S.MemberForm>
          </S.MemberFormColumn>
        </S.MemberCard>
      </S.MemberContainer>

      <AlertModal
      isOpen={isModalOpen}
      message={modalMessage}
      onClose={handleCloseModal}/>
    </>
  );
};
