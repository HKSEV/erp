import styled from "styled-components";
import * as C from "@/assets/css/common/Common.styles";

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
  color: #000;
  background: none;
  border: 0;
  border-radius: 0.25rem;
  box-shadow: none;
  cursor: pointer;
  transform: translateY(-50%);
  transition: opacity 150ms ease, transform 150ms ease;

  svg {
    width: 2rem;
    height: 2rem;
    stroke-width: 2.5;
  }

  &:hover:not(:disabled) {
    background: none;
    opacity: 0.65;
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.94);
  }

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.25;
    cursor: default;
  }

  @media (max-width: 768px) {
    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
export const CalViewport = styled.div<{$dragging: boolean}>`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  padding-block: 0.75rem;
  overflow: hidden;
  isolation: isolate;
  user-select: none;
  -webkit-user-select: none;
  cursor: ${({$dragging}) => ($dragging ? "grabbing" : "grab")};

  button[data-calendar-day] {
    cursor: inherit;
  }
`;
export const CalendarWrapper = styled.section<{
  $slot: number;
  $moving: boolean;
}>`
  position: relative;
  grid-area: 1 / 1;
  align-self: start;
  left: 50%;
  width: var(--cal-card-width);
  min-width: 0;
  box-sizing: border-box;
  background-color: #FFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  transform: ${({$slot}) => (`
    translateX(calc(-50% + ${$slot * 64}%))
    scale(${$slot === 0 ? 1 : 0.84})
  `)};
  transform-origin: center center;
  z-index: ${({$slot}) => (10 - Math.min(Math.abs($slot), 3))};
  opacity: ${({$slot}) => (
    $slot === 0 ? 1 : Math.abs($slot) === 1 ? 0.28 : 0
  )};
  filter: ${({$slot}) => ($slot === 0 ? "none" : "blur(1.5px)")};
  pointer-events: ${({$slot, $moving}) => (
    $slot === 0 && !$moving ? "auto" : "none"
  )};
  transition: ${({$moving}) => (
    $moving
      ? `
        transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1),
        opacity 320ms ease,
        filter 320ms ease
      `
      : "none"
  )};

  @media (max-width: 768px) {
    transform: ${({$slot}) => `translateX(calc(-50% + ${$slot * 110}%))`};
    opacity: ${({$slot}) => ($slot === 0 ? 1 : 0)};
    filter: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;
export const CalHeader = styled.div<{
  $active: boolean;
  $moving: boolean;
}>`
  ${C.FlexBetween}
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: 1px solid #E2E8F0;
  background-color: #F8FAFC;
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
  color: #334155;
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
  color: #64748B;
  font-size: 0.875rem;
  line-height: 1.5;
  font-weight: 600;
`;
export const CalMonthTitle = styled.h2`
  color: #0F172A;
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
  border: 1px solid #DBE3EF;
  border-radius: 0.5rem;
  background-color: #FFF;
  color: #4E73DF;
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
    background: #EEF3FF;
    border-color: #4E73DF;
  }

  &:focus-visible {
    outline: 2px solid #4E73DF;
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
  color: ${({$weekday}) => (
    $weekday === 0
    ? "#EF5A67"
    : $weekday === 6 ? "#4E73DF" : "#64748B"
  )};
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
`;
// export const CalTooltip = styled.div`
//   position: absolute;
//   bottom: 10%;
//   left: 50%;
//   transform: translateX(-50%);
//   background-color: rgba(0, 0, 0, 0.7);
//   color: white;
//   text-align: center;
//   padding: 4px;
//   border-radius: 4px;
//   font-size: 0.75rem;
//   white-space: nowrap;
//   z-index: 10;
//   opacity: 0;
//   transition: opacity 0.2s ease-in-out;
// `;
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
  background-color: #FAFBFD;
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
  border: 1px solid ${({$selected}) => (
    $selected ? "#4E73DF" : "#EEF2F7"
  )};
  border-radius: 0.5rem;
  background-color: ${({$selected}) => (
    $selected ? "#EAF0FF" : "#FFF"
  )};
  color: ${({$isHoliday, $weekday}) => (
    $isHoliday || $weekday === 0 
    ? "#EF5A67" : $weekday === 6 ? "#4E73DF" : "#334155"
  )};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: #F0F4FF;
    border-color: #A9BCEF;
  }

  &:focus-visible {
    outline: 2px solid #4E73DF;
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
  color: #DF5566;
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
  background-color: #EDF2FF;
  color: #4E73DF;
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
  border-top: 1px solid #EEF2F7;
  color: #64748B;
  font-size: 0.8125rem;

  > span {
    ${C.InlineFlexCenter}
    gap: 0.375rem;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
    color: #4E73DF;
  }
`;
export const CalSelectedMark = styled.i`
  width: 0.75rem;
  height: 0.75rem;
  border: 1px solid #4E73DF;
  border-radius: 0.1875rem;
  background-color: #EAF0FF;
`;
export const CalHolidayMark = styled.i`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #EF5A67;
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