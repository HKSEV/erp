"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as S from "@/assets/css/Style.styles";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

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
      <S.MemberCard>
        <S.MemberImageColumn/>
        <S.MemberFormColumn>
          <S.MemberTitle>Forgot Your Password?</S.MemberTitle>

          <S.MemberDescription>
            We get it, stuff happens. Just enter your email address below 
            and we'll send you a link to reset your password!
          </S.MemberDescription>

          <S.MemberForm onSubmit={handleResetPassword}>
            <S.MemberInput
            type="email"
            placeholder="Enter Email Address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required/>
            <S.Button
            $variant="primary"
            $size="medium"
            $fullWidth
            type="submit">
              Reset Password
            </S.Button>
          </S.MemberForm>

          <S.MemberDivider/>

          <S.MemberStyledLink href="/member">
            Create an Account!
          </S.MemberStyledLink>

          <S.MemberStyledLink href="/">
            Already have an account? Login!
          </S.MemberStyledLink>
        </S.MemberFormColumn>
      </S.MemberCard>
    </S.MemberContainer>
  );
};
