"use client"

import Link from "next/link";
import * as S from "@/assets/css/NavButton";

export const Footer = () => {
  return (
    <S.FooterContainer>
      <S.FooterInfo>
        <strong>Smart ERP System</strong> v0.1.0<br/>
        &copy; {new Date().getFullYear()} All rights reserved.
      </S.FooterInfo>
      
      <S.FooterLinks>
        {/* 메일 링크는 <a>, 사이트 안의 페이지는 Link */}
        <a href="mailto:support@example.com">문의 support@example.com</a>
        <Link href="/privacy">개인정보처리방침</Link>
        <Link href="/manual">사용자 매뉴얼</Link>
      </S.FooterLinks>
    </S.FooterContainer>
  );
};