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
  const {openAlertModal} = useModal();

  const handleLogout = () => {
    onCloseMenu();
    openAlertModal(
      "로그아웃 하시겠습니까?",
      () => {
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        document.cookie = "login_token=true; path=/; max-age=0; SameSite=Lax";
        openAlertModal(
          "로그아웃 되었습니다.",
          () => router.push("/"),
          {variant: "success"}
        );
      },
      {
        variant: "confirm",
        description: "로그아웃 후에는 다시 로그인해야\n서비스를 이용할 수 있습니다.",
        confirmText: "로그아웃",
        cancelText: "취소",
      },
    );
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
