"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as S from "@/assets/css/Style.styles";

export const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    document.cookie = "login_token=true; path=/; max-age=0;";
    alert("로그아웃 되었습니다.");
    router.push("/")
  };

  return (
    <S.HeaderContainer>
      <S.HeaderLogo onClick={() => router.push("/dashboard")}>
        Smart ERP
      </S.HeaderLogo>

      {/* 데스크탑 네비게이션 */}
      <S.HeaderDesktopNav>
        <S.HeaderNavLink href="/production">생산관리</S.HeaderNavLink>
        <S.HeaderNavLink href="/material">자재관리</S.HeaderNavLink>
        <S.HeaderNavLink href="/quality">품질관리</S.HeaderNavLink>
        <S.HeaderNavLink href="/equipment">설비관리</S.HeaderNavLink>
      </S.HeaderDesktopNav>

      {/* 데스크탑 유저 섹션 */}
      <S.HeaderUserSection>
        <span>관리자님 환영합니다</span>
        <S.HeaderLogoutButton onClick={handleLogout}>
          로그아웃
        </S.HeaderLogoutButton>
      </S.HeaderUserSection>

      {/* 모바일 햄버거 버튼 */}
      <S.HeaderMobileMenuToggle onClick={toggleMenu}>
        {isMobileMenuOpen ? "✕" : "☰"}
      </S.HeaderMobileMenuToggle>

      {/* 모바일 드롭다운 메뉴 */}
      <S.HeaderMobileNav $isOpen={isMobileMenuOpen}>
        <a href="/production">생산관리</a>
        <a href="/material">자재관리</a>
        <a href="/quality">품질관리</a>
        <a href="/equipment">설비관리</a>
        <a href="/dashboard/mypage">내 정보</a>
        <a href="/">로그아웃</a>
      </S.HeaderMobileNav>
    </S.HeaderContainer>
  );
};
/**
 * jwt 방식은 로그아웃을 백엔드를 거칠 필요가 없이 프론트엔드(브라우저)에
 * 
 */