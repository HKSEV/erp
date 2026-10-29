import styled from "styled-components";
import type { CSSProperties } from "react";
import * as C from "@/assets/css/common/Common.styles";

interface CalendarWrapperProps {
  $slot: number;
  $moving: boolean;
};

type CalendarMotionStyle = CSSProperties &
  Record<`--cal-${string}`, string | number>;

// 캘린더
export const CalTopMargin = styled.div`
  width: 100%;
  min-width: 0;
  margin-top: 2rem;
`;
export const CalCarousel = styled.div`
  --cal-card-width: min(42rem, calc(100% - 3rem));
  --cal-arrow-size: 2.5rem;

  position: relative;
  width: 100%;
  min-width: 0;
  overflow: visible;

  @media (max-width: 768px) {
    --cal-card-width: min(42rem, calc(100% - 1.5rem));
    --cal-arrow-size: 1.75rem;
  }
`;
export const CalSideArrowButton = styled.button<{$side: "prev" | "next"}>`
  position: absolute;
  top: 50%;
  z-index: 30;
  left: ${({$side}) => (
    $side === "next"
      ? "calc(50% + var(--cal-card-width) / 2 + 0.25rem)"
      : "auto"
  )};
  right: ${({$side}) => (
    $side === "prev"
      ? "calc(50% + var(--cal-card-width) / 2 + 0.25rem)"
      : "auto"
  )};
  display: grid;
  place-items: center;
  width: var(--cal-arrow-size);
  height: 2.75rem;
  padding: 0;
  color: ${({theme}) => theme.colors.textStrong};
  background: none;
  border: 0;
  border-radius: 0.25rem;
  box-shadow: none;
  cursor: pointer;
  transform: translateY(-50%);
  transition: opacity 150ms ease, transform 150ms ease;

  svg {
    width: 3rem;
    height: 3rem;
    stroke-width: 2;
  }

  &:hover:not(:disabled) {
    background: none;
    opacity: 0.65;
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.94);
  }

  &:focus-visible {
    outline: 2px solid ${({theme}) => theme.colors.textStrong};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.25;
    cursor: default;
  }

  @media (max-width: 768px) {
    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
export const CalViewport = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  padding-block: 0.75rem;
  overflow: hidden;
  isolation: isolate;
  user-select: none;
  -webkit-user-select: none;
`;
export const CalendarWrapper = styled.section.attrs<CalendarWrapperProps>(
  ({$slot, $moving}) => {
    const distance = Math.abs($slot);

    const style: CalendarMotionStyle = {
      "--cal-x": `${-50 + $slot * 64}%`,
      "--cal-mobile-x": `${-50 + $slot * 110}%`,

      "--cal-scale":
        1 - Math.min(distance, 1) * 0.16,

      "--cal-opacity":
        distance <= 1
          ? 1 - distance * 0.72
          : Math.max(0, 0.28 * (2 - distance)),

      "--cal-mobile-opacity":
        Math.max(0, 1 - distance),

      "--cal-blur":
        `${Math.min(distance, 1) * 1.5}px`,

      zIndex:
        10 - Math.min(Math.round(distance), 3),

      pointerEvents:
        $slot === 0 && !$moving ? "auto" : "none",
    };

    return {
      "data-moving": $moving ? "true" : "false",
      style
    };
  })`
  position: relative;
  grid-area: 1 / 1;
  align-self: start;
  left: 50%;
  width: var(--cal-card-width);
  min-width: 0;
  box-sizing: border-box;
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: 10px;
  box-shadow: ${({theme}) => theme.shadow.card};
  overflow: hidden;
  transform: translateX(var(--cal-x)) scale(var(--cal-scale));
  transform-origin: center center;
  opacity: var(--cal-opacity);
  filter: blur(var(--cal-blur));
  transition: none;

  &[data-moving="true"] {
    filter: none;
  }

  @media (max-width: 768px) {
    transform: translateX(var(--cal-mobile-x));
    opacity: var(--cal-mobile-opacity);
    filter: none;
  }
`;
export const CalHeader = styled.div<{
  $active: boolean;
  $moving: boolean;
}>`
  ${C.FlexBetween}
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: 1px solid ${({theme}) => theme.colors.border};
  background-color: ${({theme}) => theme.colors.bg};
  opacity: ${({$active}) => ($active ? 1 : 0)};
  transform: ${({$active}) => (
    $active ? "translateY(0)" : "translateY(0.375rem)"
  )};
  transition: ${({$moving}) => (
    $moving ? "opacity 320ms ease, transform 320ms ease" : "none"
  )};

  @media (max-width: 600px) {
    padding: 1rem 0.75rem;
    gap: 0.5rem;
    flex-direction: column;
    text-align: center;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;
export const CalPreviewTitle = styled.p<{
  $active: boolean;
  $moving: boolean;
}>`
  position: absolute;
  top: 1.5rem;
  left: 50%;
  margin: 0;
  color: ${({theme}) => theme.colors.textBody};
  font-size: 1.25rem;
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${({$active}) => ($active ? 0 : 1)};
  transform: ${({$active}) => (
    $active ? "translate(-50%, -0.375rem)" : "translate(-50%, 0)"
  )};
  transition: ${({$moving}) => (
    $moving ? "opacity 320ms ease, transform 320ms ease" : "none"
  )};

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;
export const CalEyebrow = styled.p`
  margin: 0 0 0.25rem;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: 0.875rem;
  line-height: 1.5;
  font-weight: 600;
`;
export const CalMonthTitle = styled.h2`
  color: ${({theme}) => theme.colors.textStrong};
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  font-size: 1.5rem;
  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 1.25rem;
  }
`;
export const CalNavigation = styled.div`
  ${C.FlexCenter}
  gap: 0.375rem;
`;
export const CalTodayButton = styled.button`
  ${C.FlexCenter}
  width: auto;
  height: 2.25rem;
  padding: 0 0.75rem;
  border: 1px solid ${({theme}) => theme.colors.borderStrong};
  border-radius: 0.5rem;
  background-color: ${({theme}) => theme.colors.surface};
  color: ${({theme}) => theme.colors.accent};
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  &:hover:not(:disabled) {
    background: ${({theme}) => theme.colors.accentSubtle};
    border-color: ${({theme}) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({theme}) => theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: default;
    opacity: 0.55;
  }

  @media (max-width: 600px) {
    padding-inline: 0.5rem;
  }
`;
export const CalBody = styled.div`
  padding: 1rem 1.25rem 0;

  @media (max-width: 600px) {
    padding: 0.75rem 0.5rem 0;
  }
`;
export const CalWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  margin-bottom: 0.5rem;
`;
export const CalDayName = styled.div<{$weekday: number}>`
  padding: 0.375rem 0;
  // 일요일 빨강, 토요일 강조색
  color: ${({theme, $weekday}) => (
    $weekday === 0
    ? theme.colors.danger
    : $weekday === 6 ? theme.colors.accent : theme.colors.textMuted
  )};
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
`;
export const CalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-template-rows: repeat(6, 4.25rem);
  gap: 0.375rem;

  @media (max-width: 600px) {
    grid-template-rows: repeat(6, 3.875rem);
    gap: 0.25rem;
  }
`;
export const CalEmptyCell = styled.div`
  min-width: 0;
  border-radius: 0.5rem;
  background-color: ${({theme}) => theme.colors.bg};
`;
export const CalDayCell = styled.button<{
  $selected: boolean;
  $isHoliday: boolean;
  $weekday: number;
}>`
  display: grid;
  grid-template-rows: 1.125rem 1rem 1rem;
  gap: 0.125rem;
  align-content: center;
  width: 100%;
  min-width: 0;
  padding: 0.25rem 0.375rem;
  border: 1px solid ${({theme, $selected}) => (
    $selected ? theme.colors.accent : theme.colors.border
  )};
  border-radius: 0.5rem;
  background-color: ${({theme, $selected}) => (
    $selected ? theme.colors.accentSubtle : theme.colors.surface
  )};
  color: ${({theme, $isHoliday, $weekday}) => (
    $isHoliday || $weekday === 0
    ? theme.colors.danger : $weekday === 6 ? theme.colors.accent : theme.colors.textBody
  )};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: ${({theme}) => theme.colors.accentSubtle};
    border-color: ${({theme}) => theme.colors.accentBorder};
  }

  &:focus-visible {
    outline: 2px solid ${({theme}) => theme.colors.accent};
    outline-offset: 1px;
  }

  @media (max-width: 600px) {
    padding-inline: 0.1875rem;
  }
`;
export const CalDateNumber = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.125rem;
`;
// 날짜 / 공휴일 / 일정: 각각 별도 그리드 행을 사용하므로 겹치지 않습니다.
export const CalHolidayRow = styled.span`
  display: flex;
  align-items: center;
  min-width: 0;
  height: 1rem;
  gap: 0.1875rem;
  overflow: hidden;
  color: ${({theme}) => theme.colors.danger};
`;
export const CalHolidayIcon = styled.span`
  flex-shrink: 0;
  max-width: 2rem;
  overflow: hidden;
  font-size: 0.875rem;
  line-height: 1rem;
`;
export const CalHolidayName = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.75rem;

  @media (max-width: 600px) {
    display: none;
  }
`;
export const CalScheduleRow = styled.span`
  display: flex;
  align-items: center;
  min-width: 0;
  height: 1rem;
`;
export const CalScheduleBadge = styled.span`
  ${C.InlineFlexCenter}
  min-width: 0;
  max-width: 100%;
  height: 1rem;
  padding: 0 0.1875rem;
  gap: 0.125rem;
  overflow: hidden;
  border-radius: 0.25rem;
  background-color: ${({theme}) => theme.colors.accentSubtle};
  color: ${({theme}) => theme.colors.accent};
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1;

  svg {
    width: 0.625rem;
    height: 0.625rem;
    flex-shrink: 0;
  }
  > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 600px) {
    padding-inline: 0.125rem;

    svg {
      display: none;
    }
  }
`;
export const CalLegend = styled.div`
  ${C.FlexCenter}
  gap: 1.25rem;
  margin-top: 1rem;
  padding: 0.75rem;
  border-top: 1px solid ${({theme}) => theme.colors.border};
  color: ${({theme}) => theme.colors.textMuted};
  font-size: 0.8125rem;

  > span {
    ${C.InlineFlexCenter}
    gap: 0.375rem;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
    color: ${({theme}) => theme.colors.accent};
  }
`;
export const CalSelectedMark = styled.i`
  width: 0.75rem;
  height: 0.75rem;
  border: 1px solid ${({theme}) => theme.colors.accent};
  border-radius: 0.1875rem;
  background-color: ${({theme}) => theme.colors.accentSubtle};
`;
export const CalHolidayMark = styled.i`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${({theme}) => theme.colors.danger};
`;
export const CalLiveMonth = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;