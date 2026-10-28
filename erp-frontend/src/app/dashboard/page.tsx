"use client";

import SmallCalendar from "@/components/SmallCalendar";
import Calendar from "@/components/Calendar";
import * as S from "@/assets/css/Style.styles";

export default function Dashboard() {
  return (
    <S.CalendarLayout>
      <S.CalendarPanel>
        <Calendar/>
      </S.CalendarPanel>
    </S.CalendarLayout>
  );
};
