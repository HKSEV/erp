"use client"

import { useRouter } from "next/navigation";
import axios from "axios";
import useModal from "./contexts/ModalContext";
import * as S from "@/assets/css/Style.styles";

interface HeaderProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};

export const Header = ({isMenuOpen, onToggleMenu, onCloseMenu}: HeaderProps) => {
  const router = useRouter();
  const {openAlertModal, openConfirmModal} = useModal();

  const handleLogout = () => {
    onCloseMenu();
    openConfirmModal("로그아웃 하시겠습니까?", () => {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      document.cookie = "login_token=true; path=/; max-age=0;";
      openAlertModal("로그아웃 되었습니다.", () => router.push("/"));
    });
  };

  return (
    <S.HeaderContainer>
      {/* 모바일 메뉴 버튼: 사이드바 서랍 열기/닫기 */}
      <S.HeaderMobileMenuToggle
      type="button"
      aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
      aria-expanded={isMenuOpen}
      aria-controls="side-menu"
      onClick={onToggleMenu}>
        {isMenuOpen ? "✕" : "☰"}
      </S.HeaderMobileMenuToggle>

      <S.HeaderLogo href="/dashboard">
        Apple iPhone Smart ERP
      </S.HeaderLogo>

      {/* 사용자 영역: 업무 메뉴는 사이드바에서만 제공 */}
      <S.HeaderUserSection>
        <S.HeaderUserName>관리자님 환영합니다</S.HeaderUserName>
        <S.HeaderUserLink href="/dashboard/mypage">내 정보</S.HeaderUserLink>
        <S.HeaderLogoutButton type="button" onClick={handleLogout}>
          로그아웃
        </S.HeaderLogoutButton>
      </S.HeaderUserSection>
    </S.HeaderContainer>
  );
};
/**
 * jwt 방식은 로그아웃을 백엔드를 거칠 필요가 없이 프론트엔드(브라우저)에
 *
 */
