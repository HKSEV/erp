"use client";

import useCurrentMember from "@/app/lib/currentMember";
import { PageContainer, PageHeader } from "@/components/ui";

export default function SystemLayout({children}: {children: React.ReactNode}) {
  const {isAdmin, isLoading} = useCurrentMember();

  if (isLoading)
    return (
      <PageContainer>
        <p role="status">권한을 확인하는 중입니다.</p>
      </PageContainer>
    );

  if (isAdmin)
    return <>{children}</>;

  return (
    <PageContainer>
      <PageHeader
      title="접근 권한이 없습니다."
      description="시스템 관리 메뉴는 관리자만 사용할 수 있습니다."/>
    </PageContainer>
  );
};