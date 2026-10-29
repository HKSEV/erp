"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Holiday } from "@/app/types/Holiday";
import { fetchHolidays } from "@/app/api/holidays";
import type { Schedule } from "./modal/ScheduleModal";
import * as S from "@/assets/css/Style.styles";
import useModal from "./contexts/ModalContext";

const OFFSETS = [-2, -1, 0, 1, 2];
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
type Direction = -1 | 0 | 1;

export default function Calendar({
  year = Temporal.Now.plainDateISO().year,
  month = Temporal.Now.plainDateISO().month,
} : {
  year?: number;
  month?: number;
}) {
  const {openScheduleModal, updateScheduleModal} = useModal();
  const [viewMonth, setViewMonth] = useState(() => (
    Temporal.PlainYearMonth.from({year, month})
  ));
  const [direction, setDirection] = useState<Direction>(0);
  const movingRef = useRef(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => (
    Temporal.Now.plainDateISO().toString()
  ));
  // 모달과 관련된 추가
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [holidayMap, setHolidayMap] = useState<Record<string, Holiday[]>>({});
  // 오늘 날짜 정보
  const today = Temporal.Now.plainDateISO();
  const months = useMemo(() => OFFSETS.map((offset) => ({
    offset, value: viewMonth.add({months: offset})
  })), [viewMonth]);
  
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      months.map(async ({value}) => [
        value.toString(),
        await fetchHolidays(value.year, value.month),
      ] as const),
    ).then((entries) => {
      if (!cancelled)
        setHolidayMap((previous) => ({
          ...previous, ...Object.fromEntries(entries),
        }));
    }).catch((err: unknown) =>
      console.error("공휴일을 불러오지 못했습니다.", err)
    );
    return () => {
      cancelled = true;
    };
  }, [months]);

  useEffect(() => {
    updateScheduleModal(schedules);
  }, [schedules, updateScheduleModal]);

  const finishTransition = useCallback(() => {
    if (!movingRef.current || direction === 0)
      return;
    movingRef.current = false;
    setViewMonth((previous) => previous.add({months: direction}));
    setDirection(0);
  }, [direction]);

  useEffect(() => {
    if (direction === 0)
      return;
    // transitionend 누락 및 동작 줄이기 설정에서도 이동을 완료합니다.
    const timer = window.setTimeout(finishTransition, 420);
    return () => window.clearTimeout(timer);
  }, [direction, finishTransition]);

  const handleChangeMonth = (nextDirection: -1 | 1) => {
    if (movingRef.current)
      return;
    movingRef.current = true;
    setDirection(nextDirection);
  };

  return (
    <S.CalTopMargin aria-label="업무 캘린더">
      <S.CalViewport aria-busy={direction !== 0}>
        {months.map(({value, offset}) => {
          const active = offset === 0;
          const slot = offset - direction;
          const firstWeekday = value.toPlainDate({day: 1}).dayOfWeek % 7;
          const holidays = holidayMap[value.toString()] ?? [];
          return (
            <S.CalendarWrapper
            key={value.toString()}
            $slot={slot}
            $moving={direction !== 0}
            aria-hidden={!active}
            inert={!active || direction !== 0}
            data-month={value.toString()}
            data-active={active}
            onTransitionEnd={(event) => {
              if (active &&
                event.target === event.currentTarget &&
                event.propertyName === "transform"
              )
                finishTransition();
            }}>
              <S.CalPreviewTitle
              $active={slot === 0}
              $moving={direction !== 0}
              aria-hidden="true">
                {value.year}년 {value.month}월
              </S.CalPreviewTitle>

              <S.CalHeader
              $active={slot === 0}
              $moving={direction !== 0}>
                <div>
                  <S.CalEyebrow>업무 캘린더</S.CalEyebrow>
                  <S.CalMonthTitle>
                    {value.year}년 {value.month}월
                  </S.CalMonthTitle>
                </div>
                <S.CalNavigation>
                  <S.CalEventArrowButton
                  type="button"
                  aria-label="이전 달"
                  disabled={direction !== 0}
                  onClick={() => handleChangeMonth(-1)}>
                    <FiChevronLeft aria-hidden="true"/>
                  </S.CalEventArrowButton>
                  <S.CalTodayButton
                  type="button"
                  disabled={direction !== 0}
                  onClick={() => {
                    if (movingRef.current)
                      return;
                    setViewMonth(
                      Temporal.PlainYearMonth.from({
                        year: today.year,
                        month: today.month,
                      })
                    );
                    setSelectedDate(today.toString());
                  }}>
                    오늘
                  </S.CalTodayButton>
                  <S.CalEventArrowButton
                  type="button"
                  aria-label="다음 달"
                  disabled={direction !== 0}
                  onClick={() => handleChangeMonth(1)}>
                    <FiChevronRight aria-hidden="true"/>
                  </S.CalEventArrowButton>
                </S.CalNavigation>
              </S.CalHeader>

              <S.CalBody>
                <S.CalWeekdays aria-hidden="true">
                  {WEEKDAYS.map((day, index) => (
                    <S.CalDayName key={day} $weekday={index}>
                      {day}
                    </S.CalDayName>
                  ))}
                </S.CalWeekdays>
                <S.CalGrid>
                  {Array.from({ length: 42 }, (_, index) => {
                    const day = index - firstWeekday + 1;
                    if (day < 1 || day > value.daysInMonth)
                      return (
                        <S.CalEmptyCell
                        key={`empty-${index}`}
                        aria-hidden="true"/>
                      );
                    const date = value.toPlainDate({day});
                    const dayHolidays = holidays.filter(
                      (holiday) => holiday.date === day,
                    );
                    const count = schedules.filter(
                      (item) =>
                        item.year === value.year &&
                        item.month === value.month &&
                        item.date === day,
                    ).length;
                    const names = dayHolidays.map(
                      (holiday) => holiday.name
                    ).join(", ");
                    return(
                      <S.CalDayCell
                      key={day}
                      type="button"
                      $selected={selectedDate === date.toString()}
                      $isHoliday={dayHolidays.length > 0}
                      $weekday={index % 7}
                      aria-current={date.equals(today) ? "date" : undefined}
                      aria-pressed={selectedDate === date.toString()}
                      aria-label={`${value.year}년 ${value.month}월 ${day}일${names ? `, ${names}` : ""}, 일정 ${count}건`}
                      onClick={() => {
                        if (!active || movingRef.current)
                          return;
                        setSelectedDate(date.toString());
                        openScheduleModal(
                          value.year,
                          value.month,
                          day,
                          schedules,
                          setSchedules,
                        );
                      }}>
                        <S.CalDateNumber>{day}</S.CalDateNumber>
                        <S.CalHolidayRow title={names}>
                          {dayHolidays.length > 0 && (
                            <>
                              <S.CalHolidayIcon aria-hidden="true">
                                {dayHolidays.map(
                                  (holiday) => holiday.icon
                                ).join("")}
                              </S.CalHolidayIcon>
                              <S.CalHolidayName>
                                {dayHolidays[0].name}
                                {dayHolidays.length > 1
                                  ? ` 외 ${dayHolidays.length - 1}`
                                  : ""}
                              </S.CalHolidayName>
                            </>
                          )}
                        </S.CalHolidayRow>
                        <S.CalScheduleRow>
                          {count > 0 && (
                            <S.CalScheduleBadge>
                              <FiCalendar aria-hidden="true" />
                              <span>{count}건</span>
                            </S.CalScheduleBadge>
                          )}
                        </S.CalScheduleRow>
                      </S.CalDayCell>
                    );
                  })}
                </S.CalGrid>
              </S.CalBody>

              <S.CalLegend aria-hidden="true">
                <span>
                  <S.CalSelectedMark/>
                  선택 날짜
                </span>
                <span>
                  <S.CalHolidayMark/>
                  공휴일
                </span>
                <span>
                  <FiCalendar/>
                  일정
                </span>
              </S.CalLegend>
            </S.CalendarWrapper>
          );
        })}
      </S.CalViewport>
      <S.CalLiveMonth aria-live="polite" aria-atomic="true">
        {viewMonth.year}년 {viewMonth.month}월
      </S.CalLiveMonth>
    </S.CalTopMargin>
  );
};