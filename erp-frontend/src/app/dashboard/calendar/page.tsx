"use client";

import Calendar from "@/components/calendar/Calendar";
import { PageContainer, PageHeader } from "@/components/ui";
import * as S from "@/assets/css/Style.styles";

export default function Dashboard() {
  return (
    <PageContainer>
      <PageHeader
      title="업무 캘린더"
      description="개인 일정을 등록하고 진행 상태를 관리합니다."/>
      <S.CalendarLayout>
        <S.CalendarPanel>
          <Calendar/>
        </S.CalendarPanel>
      </S.CalendarLayout>
    </PageContainer>
  );
};
