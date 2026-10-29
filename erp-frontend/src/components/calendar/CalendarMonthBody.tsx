"use client";

import { memo, useMemo } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { FiCalendar } from "react-icons/fi";
import type { Holiday } from "@/app/types/Holiday";
import * as S from "@/assets/css/Style.styles";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface CalendarMonthBodyProps {
  year: number;
  month: number;
  selectedDate: string;
  todayKey: string;
  holidays: readonly Holiday[];
  scheduleCounts: Readonly<Record<string, number>>;
  onSelectDay: (
    year: number,
    month: number,
    day: number,
  ) => void;
}

const CalendarMonthBody = memo(function CalendarMonthBody({
  year,
  month,
  selectedDate,
  todayKey,
  holidays,
  scheduleCounts,
  onSelectDay,
}: CalendarMonthBodyProps) {
  const value = Temporal.PlainYearMonth.from({year, month});
  const firstWeekday = value.toPlainDate({day: 1}).dayOfWeek % 7;
  const holidaysByDay = useMemo(() => {
    const result = new Map<number, Holiday[]>();

    for (const holiday of holidays) {
      const entries = result.get(holiday.date);
      if (entries)
        entries.push(holiday);
      else
        result.set(holiday.date, [holiday]);
    };

    return result;
  }, [holidays]);

  return (
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
          if (day < 1 || day > value.daysInMonth) {
            return (
              <S.CalEmptyCell
              key={`empty-${index}`}
              aria-hidden="true"/>
            );
          };
          const dateKey = value.toPlainDate({day}).toString();
          const dayHolidays = holidaysByDay.get(day) ?? [];
          const names = dayHolidays.map(
            (holiday) => holiday.name
          ).join(", ");
          const count = scheduleCounts[`${year}-${month}-${day}`] ?? 0;
          const selected = selectedDate === dateKey;
          const isToday = todayKey === dateKey;

          return (
            <S.CalDayCell
            key={day}
            type="button"
            $selected={selected}
            $isHoliday={dayHolidays.length > 0}
            $weekday={index % 7}
            data-calendar-day="true"
            aria-current={isToday ? "date" : undefined}
            aria-pressed={selected}
            aria-label={
              `${year}년 ${month}월 ${day}일` +
              `${names ? `, ${names}` : ""}, 일정 ${count}건`
            }
            onClick={() => onSelectDay(year, month, day)}>
              <S.CalDateNumber>{day}</S.CalDateNumber>

              <S.CalHolidayRow title={names}>
                {dayHolidays.length > 0 && (
                  <>
                    <S.CalHolidayIcon aria-hidden="true">
                      {dayHolidays
                        .map((holiday) => holiday.icon)
                        .join("")}
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
  );
});

export default CalendarMonthBody;