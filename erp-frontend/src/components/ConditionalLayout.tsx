// 현재 URL을 읽어와서 숨겨야 할 목록에 포함되어 헤더 푸터를 온/오프
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SideBar } from "./SideBar";
import { ModalProvider } from "./contexts/ModalContext";
import * as S from "@/assets/css/Style.styles";

export default function ConditionalLayout({children}: {
  children: React.ReactNode
}) {
  // 현재 URL 경로를 가져옴
  const pathname = usePathname();
  // 헤더와 푸터를 숨기고 싶은 URL 배열 작성
  // /privacy, /manual: 로그인 없이 보는 문서 페이지 (app/(info) 레이아웃 사용)
  const hiddenPaths = ["/", "/register", "/find-id", "/forgot", "/privacy", "/manual"];
  const isHidden = hiddenPaths.includes(pathname);
  // 모바일 사이드바 서랍 열림 상태 (헤더 버튼과 사이드바가 함께 사용)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  // 서랍이 열려 있을 때 Esc 키로 닫기
  useEffect(() => {
    if (!isMenuOpen)
      return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape")
        setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <ModalProvider>
      <S.PageWrapper>
        {/* isHidden이 false일 때만 헤더 푸터 표시 */}
        {!isHidden ? (
          <>
            <S.TopArea>
              <Header
              isMenuOpen={isMenuOpen}
              onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
              onCloseMenu={closeMenu}/>
            </S.TopArea>
            <S.MainContent $isHidden={isHidden}>
              <S.LnbWrapper $isOpen={isMenuOpen}>
                <SideBar onNavigate={closeMenu}/>
              </S.LnbWrapper>
              {isMenuOpen && <S.DrawerBackdrop onClick={closeMenu}/>}
              <S.ContentArea>
                {children}
              </S.ContentArea>
            </S.MainContent>
            <Footer/>
          </>
        ) : (
          <S.MainContent $isHidden={isHidden}>
            {children}
          </S.MainContent>
        )}
      </S.PageWrapper>
    </ModalProvider>
  );
};
