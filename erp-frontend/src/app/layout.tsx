import type { Metadata } from "next";
import StyledComponentsRegistry from "./lib/registry";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import ConditionalLayout from "@/components/ConditionalLayout";
import ReduxProvider from "@/store/ReduxProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | ERP", // %s 자리에 각 페이지의 타이틀이 들어감
    default: "ERP 시스템", // 각 페이지의 타이틀 설정이 없을 때 나오는 기본값
  },
  description: "사내 ERP 시스템입니다.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    // 스타일은 styled-components(GlobalStyle + 테마)로만 관리
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <ThemeProviderWrapper>
            <ReduxProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </ReduxProvider>
          </ThemeProviderWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};
