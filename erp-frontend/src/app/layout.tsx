import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "./lib/registry";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | ERP", // %s 자리에 각 페이지의 타이틀이 들어감
    default: "ERP 시스템", // 각 페이지의 타이틀 설정이 없을 때 나오는 기본값
  },
  description: "사내 ERP 시스템입니다.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="ko">
      <head>
        {/* 부트스트랩 CDN 추가 */}
        <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"/>
      </head>
      <body className="h-full m-0 bg-gray-50 text-gray-900 antialiased">
        <StyledComponentsRegistry>
          <ThemeProviderWrapper>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ThemeProviderWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};
