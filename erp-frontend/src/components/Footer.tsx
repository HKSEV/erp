"use client"

import * as S from "@/assets/css/NavButton";

export const Footer = () => {
  return (
    <S.FooterContainer>
      <S.FooterInfo>
        <strong>Smart ERP System</strong> v0.1.0<br/>
        &copy; {new Date().getFullYear()} All rights reserved.
      </S.FooterInfo>
      
      <S.FooterLinks>
        <a href="mailto:support@example.com">문의 support@example.com </a>
        <a href="/terms">개인정보처리방침</a>
        <a href="/manual">사용자 매뉴얼</a>
      </S.FooterLinks>
    </S.FooterContainer>
  );
};