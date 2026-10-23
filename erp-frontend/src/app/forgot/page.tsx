"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiLock,
  FiMail,
  FiInfo,
  FiArrowLeft,
} from "react-icons/fi";
import * as S from "@/assets/css/Style.styles";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("/api/members/forgot-password", {email});
      alert("이메일로 임시 비밀번호가 발송되었습니다. 확인 후 로그인해주세요.");
      router.push("/");
    } catch (err: any) {
      console.error("에러: ", err);
      alert(err.response?.data || "메일 발송에 실패했습니다. 이메일을 확인해주세요.");
    };
  };

  return (
    <S.MemberContainer>
      <S.MemberCard aria-labelledby="forgot-password-title">
        <S.MemberHeader>
          <S.MemberLogoIcon aria-hidden="true">
            <FiLock/>
          </S.MemberLogoIcon>
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
