"use client";

import * as S from "@/assets/css/Style.style";

export default function ForgotPassword() {
  return (
    <S.Container>
      <S.Card>
        <S.ImageColumn/>
        <S.FormColumn>
          <S.Title>Forgot Your Password?</S.Title>

          <S.Description>
            We get it, stuff happens. Just enter your email address below 
            and we'll send you a link to reset your password!
          </S.Description>

          <S.Form>
            <S.Input
            type="email"
            id=""
            placeholder="Enter Email Address..."/>
            <S.Button type="submit">
              Reset Password
            </S.Button>
          </S.Form>

          <S.Divider/>

          <S.StyledLink href="/member">
            Create an Account!
          </S.StyledLink>

          <S.StyledLink href="/">
            Already have an account? Login!
          </S.StyledLink>
        </S.FormColumn>
      </S.Card>
    </S.Container>
  );
};
