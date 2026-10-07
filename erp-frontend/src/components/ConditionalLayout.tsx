// 현재 URL을 읽어와서 숨겨야 할 목록에 포함되어 헤더 푸터를 온/오프
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Top } from "./Top";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SideBar } from "./SideBar";
import * as S from "@/assets/css/Layout.style";

export default function ConditionalLayout({children}: {
  children: React.ReactNode
}) {
  // 현재 URL 경로를 가져옴
  const pathname = usePathname();
  // 헤더와 푸터를 숨기고 싶은 URL 배열 작성
  const hiddenPaths = ["/", "/member", "/find-id", "/forgot"];
  const isHidden = hiddenPaths.includes(pathname);

  return (
    <S.PageWrapper>
      {/* isHidden이 false일 때만 헤더 푸터 표시 */}
      {!isHidden ? (
        <>
          <S.TopArea>
            <Top/>
            <Header/>
          </S.TopArea>
          <S.MainContent $isHidden={isHidden}>
            <S.LnbWrapper>
              <SideBar/>
            </S.LnbWrapper>
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
  );
};
