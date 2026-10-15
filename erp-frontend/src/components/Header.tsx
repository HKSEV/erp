"use client"

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import useModal from "./contexts/ModalContext";
import * as S from "@/assets/css/Style.styles";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {openAlertModal} = useModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    openAlertModal("로그아웃 하시겠습니까?", () => {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      document.cookie = "login_token=true; path=/; max-age=0;";
      setTimeout(() => {
        openAlertModal("로그아웃 되었습니다.", () => router.push("/"));
      }, 100);
    });
  };

  return (
    <S.HeaderContainer>
      <S.HeaderLogo onClick={() => router.push("/dashboard")}>
         Apple iPhone Smart ERP
      </S.HeaderLogo>

      {/* 데스크탑 네비게이션 */}
      <S.HeaderDesktopNav>
        <S.HeaderNavLink href="/dashboard">대시보드</S.HeaderNavLink>
        <S.HeaderNavLink href="/dashboard/production">생산관리</S.HeaderNavLink>
        <S.HeaderNavLink href="/dashboard/inventory">재고관리</S.HeaderNavLink>
        <S.HeaderNavLink href="/dashboard/hr">인사관리</S.HeaderNavLink>
        <S.HeaderNavLink href="/dashboard/settings">기준정보</S.HeaderNavLink>
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
        <Link
        href="/dashboard"
        onClick={() => setIsMobileMenuOpen(false)}>
          대시보드
        </Link>
        <Link
        href="/dashboard/production"
        onClick={() => setIsMobileMenuOpen(false)}>
          생산관리
        </Link>
        <Link
        href="/dashboard/inventory"
        onClick={() => setIsMobileMenuOpen(false)}>
          재고관리
        </Link>
        <Link
        href="/dashboard/hr"
        onClick={() => setIsMobileMenuOpen(false)}>
          인사관리
        </Link>
        <Link
        href="/dashboard/settings"
        onClick={() => setIsMobileMenuOpen(false)}>
          기준정보
        </Link>
        <Link
        href="/admin/mypage"
        onClick={() => setIsMobileMenuOpen(false)}>
          내 정보
        </Link>
        <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }}>
          로그아웃
        </Link>
      </S.HeaderMobileNav>
    </S.HeaderContainer>
  );
};
/**
 * jwt 방식은 로그아웃을 백엔드를 거칠 필요가 없이 프론트엔드(브라우저)에
 * 
 */