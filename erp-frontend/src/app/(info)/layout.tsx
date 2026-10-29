import * as S from "@/assets/css/Info.styles";

// 로그인 없이 볼 수 있는 문서형 페이지 레이아웃 (개인정보처리방침, 사용자 매뉴얼)
// 괄호 폴더(라우트 그룹)라 주소에는 (info)가 나타나지 않음: /privacy, /manual
export default function InfoLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <S.InfoWrapper>
      <S.InfoTopBar>
        {/* 로그인 상태가 아니면 middleware가 로그인 화면으로 보냄 */}
        <S.InfoLogo href="/dashboard">Smart ERP System</S.InfoLogo>
      </S.InfoTopBar>
      <S.InfoContent>
        {children}
      </S.InfoContent>
    </S.InfoWrapper>
  );
};
