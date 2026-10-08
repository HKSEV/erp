"use client";

import { useState, useEffect } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Holiday } from "@/app/types/Holiday";
import { fetchHolidays } from "@/app/api/holidays";
import * as S from "@/assets/css/Style.styles";
import ScheduleModal from "./modal/ScheduleModal";

// 일정 타입 정의 추가
interface Schedule {
  id: string;
  date: number;
  content: string;
  status: "대기" | "진행" | "완료";
  createdAt: string;
};

export default function Calendar({
  year = Temporal.Now.plainDateISO().year,
  month = Temporal.Now.plainDateISO().month,
} : {
  year?: number;
  month?: number;
}) {
  const [currentYear, setCurrentYear] = useState(year);
  const [currentMonth, setCurrentMonth] = useState(month);
  // 입력받은 연/월을 기준으로 Temporal 객체 생성
  const targetYearMonth = Temporal.PlainYearMonth.from({
    year: currentYear,
    month: currentMonth
  });
  const handleChangeMonth = (direction: "prev" | "next") => {
    const change = (
      direction === "prev"
      ? targetYearMonth.subtract({months: 1})
      : targetYearMonth.add({months: 1})
    );
    setCurrentYear(change.year);
    setCurrentMonth(change.month);
  };

  // 해당 월의 1일 날짜 정보 추출
  const firstDayDate = targetYearMonth.toPlainDate({day: 1});
  /* Temporal의 dayOfWeek는 1(월요일) ~ 7(일요일)입니다
  일요일부터 시작하는 달력 그리드를 위해 0(일) ~ 6(토) 인덱스로 변환합니다. */
  const firstDayIndex = firstDayDate.dayOfWeek === 7 ? 0 : firstDayDate.dayOfWeek;
  // 해당 월의 마지막 날짜(총 일수)를 직관적으로 가져옵니다.
  const daysInMonth = targetYearMonth.daysInMonth;
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  // 모달과 관련된 추가
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHolidays(currentYear, currentMonth).then(setHolidays);
  }, [currentYear, currentMonth]);

  // 오늘 날짜 정보
  const today = Temporal.Now.plainDateISO();
  const isThisMonth = today.year === currentYear && today.month === currentMonth;
  const getHoliday = (day: number) => holidays.find((h) => h.date === day);
  const days = [];

  const handleDayClick = (day: number) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  // 달력 빈칸 만들기
  for (let i = 0; i < firstDayIndex; i++)
    days.push(<S.CalDayCell key={`empty-${i}`} $isEmpty/>);

  // 실제 날짜 채우기
  for (let d = 1; d <= daysInMonth; d++) {
    const holiday = getHoliday(d);
    const currentDayOfWeek = (firstDayIndex + d - 1) % 7;
    const isSunday = currentDayOfWeek === 0;
    const isSaturday = currentDayOfWeek === 6;
    // 해당 날짜에 등록된 일정이 있는지 확인
    const hasSchedule = schedules.some((sch) => sch.date === d);

    days.push(
      <S.CalDayCell
      key={d}
      $isToday={isThisMonth && today.day === d}
      $isHoliday={!!holiday}
      $isSunday={isSunday}
      $isSaturday={isSaturday}
      onClick={() => handleDayClick(d)}>
        <span>{d}</span>
        {holiday && <S.CalTooltip>{holiday.name}</S.CalTooltip>}
        {holiday?.name === "성탄절" && <span>🎄</span>}
        {holiday?.name.includes("추석") && <span>🌕</span>}
        {hasSchedule && <S.ScheduleDot/>}
      </S.CalDayCell>
    );
  };

  return (
    <>
      <S.CalTopMargin>
        <S.CalendarWrapper>
          <S.CalHeader>
            <S.CalEventArrowBtn
            onClick={() => handleChangeMonth("prev")}>
              &lt;
            </S.CalEventArrowBtn>
            {currentYear}년 {currentMonth}월
            <S.CalEventArrowBtn
            onClick={() => handleChangeMonth("next")}>
              &gt;
            </S.CalEventArrowBtn>
          </S.CalHeader>
          <S.CalGrid>
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <S.CalDayName key={day}>
                {day}
              </S.CalDayName>
            ))}
            {days}
          </S.CalGrid>
        </S.CalendarWrapper>
      </S.CalTopMargin>

      {/* 분리한 스케줄 모달 컴포넌트 렌더링 */}
      <ScheduleModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      month={currentMonth}
      selectedDate={selectedDate}
      schedules={schedules}
      setSchedules={setSchedules}/>
    </>
  );
};
