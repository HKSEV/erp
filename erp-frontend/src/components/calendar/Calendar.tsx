"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback
} from "react";
import { isAxiosError } from "axios";
import api from "@/app/lib/api";
import { Temporal } from "@js-temporal/polyfill";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CalendarMonthBody from "./CalendarMonthBody";
import getHolidays from "@/app/api/holidays";
import type { Schedule } from "../modal/ScheduleModal";
import * as S from "@/assets/css/Style.styles";
import useModal from "../contexts/ModalContext";

const OFFSETS = [-2, -1, 0, 1, 2];
const DRAG_START_PX = 8;
const MONTH_CHANGE_PX = 64;

type CalendarDrag = {
  startX: number;
  startY: number;
  dragging: boolean;
};

type CalendarScheduleData = {
  schedules: Schedule[];
  loadedKey: string | null;
  error: {key: string; message: string} | null;
};

export default function Calendar({
  year = Temporal.Now.plainDateISO().year,
  month = Temporal.Now.plainDateISO().month,
} : {
  year?: number;
  month?: number;
}) {
  const {
    openScheduleModal,
    updateScheduleModal,
    openAlertModal,
    scheduleModalConfig,
  } = useModal();

  const [slide, setSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => (
    Temporal.PlainYearMonth.from({year, month})
  ));

  const movingRef = useRef(false);
  const dragRef = useRef<CalendarDrag | null>(null);
  const suppressClickRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const viewMonthRef = useRef(viewMonth);
  const calendarLoadRef = useRef<AbortController | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<string>(() => (
    Temporal.Now.plainDateISO().toString()
  ));

  // 모달과 관련된 추가
  const isScheduleModalOpen = scheduleModalConfig.isOpen;
  const [calendarData, setCalendarData] =
    useState<CalendarScheduleData>({
      schedules: [],
      loadedKey: null,
      error: null,
    });

  const [retryKey, setRetryKey] = useState(0);
  const schedules = calendarData.schedules;

  // 기존 모달에서 사용하는 setSchedules 형식을 유지합니다.
  const setSchedules = useCallback<React.Dispatch<
    React.SetStateAction<Schedule[]>
  >>((next) => {
    setCalendarData((prev) => {
      const updated = typeof next === "function"
        ? next(prev.schedules)
        : next;

      return updated === prev.schedules
        ? prev
        : { ...prev, schedules: updated };
    });
  }, []);

  const currentMonthKey = viewMonth.toString();
  const isCalendarReady =
    calendarData.loadedKey === currentMonthKey;

  const currentError =
    calendarData.error?.key === currentMonthKey
      ? calendarData.error.message
      : null;

  // 오늘 날짜 정보
  const today = Temporal.Now.plainDateISO();
  const renderCenter = Math.round(slide);
  const months = useMemo(() => {
    return OFFSETS.map((relativeOffset) => {
      const offset = renderCenter + relativeOffset;
      const value = viewMonth.add({ months: offset });

      return {
        offset,
        value,
        holidays: getHolidays(value.year, value.month),
      };
    });
  }, [viewMonth, renderCenter]);

  useEffect(() => {
    const key = viewMonth.toString();

    // 모달 편집 중이거나 이미 준비된 월이면 조회를 생략합니다.
    if (isScheduleModalOpen || calendarData.loadedKey === key)
      return;

    const controller = new AbortController();
    calendarLoadRef.current = controller;

    const load = async () => {
      setCalendarData((prev) => (
        prev.error === null ? prev : { ...prev, error: null }
      ));

      try {
        const targets = OFFSETS.map((offset) =>
          viewMonth.add({ months: offset }),
        );

        // 표시 범위의 모든 월이 준비될 때까지 기다립니다.
        const responses = await Promise.all(
          targets.map((target) =>
            api.get<Schedule[]>("/api/schedules", {
              params: {
                year: target.year,
                month: target.month,
              },
              signal: controller.signal,
            }),
          ),
        );

        if (controller.signal.aborted)
          return;

        const targetKeys = new Set(
          targets.map((target) =>
            target.year + "-" + target.month,
          ),
        );

        const incoming = responses.flatMap(
          (response) => response.data,
        );

        // 데이터와 준비 상태를 한 번에 반영합니다.
        setCalendarData((prev) => ({
          schedules: [
            ...prev.schedules.filter(
              (item) =>
                !targetKeys.has(item.year + "-" + item.month),
            ),
            ...incoming,
          ],
          loadedKey: key,
          error: null,
        }));
      } catch (err: unknown) {
        if (controller.signal.aborted)
          return;

        let message =
          "일정을 불러오지 못했습니다. 다시 시도해 주세요.";

        if (isAxiosError<{message?: unknown}>(err)) {
          if (err.response?.status === 401) {
            message =
              "로그인 정보를 확인할 수 없습니다. 다시 로그인해 주세요.";
          } else {
            const detail = err.response?.data?.message;

            if (typeof detail === "string" && detail.trim())
              message = detail;
          }
        }

        setCalendarData((prev) => ({
          ...prev,
          error: { key, message },
        }));

        controller.abort();
      };
    };

    void load();

    return () => {
      controller.abort();

      if (calendarLoadRef.current === controller)
        calendarLoadRef.current = null;
    };
  }, [
    viewMonth,
    calendarData.loadedKey,
    isScheduleModalOpen,
    retryKey,
  ]);

  useEffect(() => {
    updateScheduleModal(schedules);
  }, [schedules, updateScheduleModal]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null)
        cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const updateSlide = useCallback((value: number) => {
    slideRef.current = value;
    setSlide(value);
  }, []);

  const animateTo = useCallback((
    target: number,
    duration: number,
    onComplete: () => void,
  ) => {
    if (frameRef.current !== null)
      cancelAnimationFrame(frameRef.current);

    movingRef.current = true;
    setIsAnimating(true);

    const from = slideRef.current;
    const startedAt = performance.now();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tick = (now: number) => {
      const progress = reducedMotion
        ? 1
        : Math.min((now - startedAt) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      updateSlide(from + (target - from) * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      frameRef.current = null;
      movingRef.current = false;
      setIsAnimating(false);
      onComplete();
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [updateSlide]);

  const commitMonth = useCallback((month: Temporal.PlainYearMonth) => {
    viewMonthRef.current = month;
    setViewMonth(month);
    updateSlide(0);
  }, [updateSlide]);

  const handleChangeMonth = useCallback((nextDirection: -1 | 1) => {
    if (movingRef.current)
      return;

    animateTo(nextDirection, 280, () => {
      commitMonth(viewMonthRef.current.add({months: nextDirection}));
    });
  }, [animateTo, commitMonth]);

  const handleToday = () => {
    if (movingRef.current || isDragging)
      return;

    const now = Temporal.Now.plainDateISO();
    const target = Temporal.PlainYearMonth.from({
      year: now.year,
      month: now.month,
    });

    setSelectedDate(now.toString());

    const current = viewMonthRef.current;
    const distance =
      (target.year - current.year) * 12 +
      target.month - current.month;

    if (distance === 0)
      return;

    // 가까운 달은 천천히, 멀리 있는 달은 빠르게 연속 이동합니다.
    const duration = Math.min(
      1600,
      380 + Math.abs(distance) * 65,
    );

    animateTo(distance, duration, () => {
      commitMonth(target);
    });
  };

  const scheduleCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const schedule of schedules) {
      const key = `${schedule.year}-${schedule.month}-${schedule.date}`;
      counts[key] = (counts[key] ?? 0) + 1;
    };

    return counts;
  }, [schedules]);

  const handleSelectDay = useCallback((
    year: number,
    month: number,
    day: number,
  ) => {
    if (movingRef.current || dragRef.current?.dragging)
      return;

    const current = viewMonthRef.current;

    if (current.year !== year || current.month !== month)
      return;

    calendarLoadRef.current?.abort();
    setSelectedDate(
      Temporal.PlainDate.from({
        year,
        month,
        day,
      }).toString(),
    );

    openScheduleModal(
      year,
      month,
      day,
      schedules,
      setSchedules,
    );
  }, [openScheduleModal, schedules]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) 
      return;

    suppressClickRef.current = false;
    dragRef.current = null;
    setIsDragging(false);

    if (movingRef.current) 
      return;

    // 날짜 버튼에서는 드래그를 허용하고,
    // 오늘 버튼 등 다른 입력 요소에서는 시작하지 않습니다.
    if (
      e.target instanceof Element && e.target.closest(
        "button:not([data-calendar-day]), a, input, textarea, select",
      )
    ) 
      return;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      dragging: false,
    };
  };

  const handleCalendarClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const shouldSuppress = suppressClickRef.current;
    suppressClickRef.current = false;

    // 키보드로 발생한 클릭은 허용합니다.
    if (shouldSuppress && e.detail > 0) {
      e.preventDefault();
      e.stopPropagation();
    };
  };

  useEffect(() => {
    const getDragSlide = (dx: number) => {
      const card = viewportRef.current
        ?.querySelector<HTMLElement>('[data-active="true"]');

      if (!card)
        return 0;

      const mobile = window.matchMedia("(max-width: 768px)").matches;
      const pageWidth = card.offsetWidth * (mobile ? 1.1 : 0.64);

      // 한 번의 드래그에서는 앞뒤 한 달까지 이동합니다.
      return Math.max(-1, Math.min(1, -dx / pageWidth));
    };

    const cancelDrag = () => {
      if (!dragRef.current)
        return;

      dragRef.current = null;
      setIsDragging(false);

      if (!movingRef.current && slideRef.current !== 0)
        animateTo(0, 180, () => updateSlide(0));
    };

    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;

      if (!drag)
        return;

      // 창 밖에서 마우스를 놓은 경우에도 상태를 정리합니다.
      if ((e.buttons & 1) === 0) {
        cancelDrag();
        return;
      }

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;

      if (
        Math.abs(dx) >= DRAG_START_PX ||
        Math.abs(dy) >= DRAG_START_PX
      )
        suppressClickRef.current = true;

      const horizontal = Math.abs(dx) > Math.abs(dy) * 1.2;

      if (
        !drag.dragging &&
        horizontal &&
        Math.abs(dx) >= DRAG_START_PX
      ) {
        drag.dragging = true;
        setIsDragging(true);
      };

      if (drag.dragging) {
        e.preventDefault();
        updateSlide(getDragSlide(dx));
      };
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 0)
        return;

      const drag = dragRef.current;

      if (!drag)
        return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;

      dragRef.current = null;
      setIsDragging(false);

      const moved =
        drag.dragging ||
        Math.abs(dx) >= DRAG_START_PX ||
        Math.abs(dy) >= DRAG_START_PX;

      if (moved)
        suppressClickRef.current = true;

      const changeMonth =
        Math.abs(dx) >= MONTH_CHANGE_PX &&
        Math.abs(dx) > Math.abs(dy) * 1.2;

      if (changeMonth) {
        const nextDirection = dx < 0 ? 1 : -1;
        animateTo(nextDirection, 220, () => {
          commitMonth(viewMonthRef.current.add({months: nextDirection}));
        });
      } else if (slideRef.current !== 0) {
        // 이동 기준보다 짧게 밀었다면 원래 위치로 복귀합니다.
        animateTo(0, 180, () => updateSlide(0));
      };
    };

    // 달력 밖으로 마우스가 나가도 드래그 종료를 감지합니다.
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("blur", cancelDrag);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("blur", cancelDrag);
    };
  }, [animateTo, commitMonth, updateSlide]);

  if (!isCalendarReady) {
    return (
      <S.CalTopMargin
      aria-label="업무 캘린더"
      aria-busy={!currentError}>
        {currentError ? (
          <div role="alert">
            <p>{currentError}</p>
            <S.CalTodayButton
            type="button"
            onClick={() => {
              setCalendarData((prev) => ({
                ...prev, error: null
              }));
              setRetryKey((prev) => prev + 1);
            }}>
              다시 시도
            </S.CalTodayButton>
          </div>
        ) : (
          <p role="status">
            캘린더 일정을 불러오는 중입니다.
          </p>
        )}
      </S.CalTopMargin>
    );
  };

  // 이 아래의 기존 달력 return JSX는 유지합니다.
  return (
    <S.CalTopMargin aria-label="업무 캘린더">
      <S.CalCarousel>
        <S.CalSideArrowButton
        type="button"
        $side="prev"
        aria-label="이전 달"
        disabled={isAnimating || isDragging}
        onClick={() => handleChangeMonth(-1)}>
          <FiChevronLeft aria-hidden="true"/>
        </S.CalSideArrowButton>

        <S.CalViewport
        ref={viewportRef}
        aria-busy={isAnimating}
        onMouseDown={handleDragStart}
        onClickCapture={handleCalendarClickCapture}
        onDragStart={(e) => e.preventDefault()}>
          {months.map(({value, offset ,holidays}) => {
            const active = offset === 0;
            const slot = offset - slide;
            const centered = Math.abs(slot) < 0.5;

            return (
              <S.CalendarWrapper
              key={value.toString()}
              $slot={slot}
              $moving={isAnimating || isDragging}
              aria-hidden={!active}
              inert={!active || isAnimating || isDragging}
              data-month={value.toString()}
              data-active={active}>
                <S.CalPreviewTitle
                $active={centered}
                $moving={isAnimating || isDragging}
                aria-hidden="true">
                  {value.year}년 {value.month}월
                </S.CalPreviewTitle>

                <S.CalHeader
                $active={centered}
                $moving={isAnimating || isDragging}>
                  <div>
                    <S.CalEyebrow>업무 캘린더</S.CalEyebrow>
                    <S.CalMonthTitle>
                      {value.year}년 {value.month}월
                    </S.CalMonthTitle>
                  </div>
                  <S.CalNavigation>
                    <S.CalTodayButton
                    type="button"
                    disabled={isAnimating || isDragging}
                    onClick={handleToday}>
                      오늘
                    </S.CalTodayButton>
                  </S.CalNavigation>
                </S.CalHeader>

                <CalendarMonthBody
                year={value.year}
                month={value.month}
                selectedDate={selectedDate}
                todayKey={today.toString()}
                holidays={holidays}
                scheduleCounts={scheduleCounts}
                onSelectDay={handleSelectDay}/>

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

        <S.CalSideArrowButton
        type="button"
        $side="next"
        aria-label="다음 달"
        disabled={isAnimating || isDragging}
        onClick={() => handleChangeMonth(1)}>
          <FiChevronRight aria-hidden="true"/>
        </S.CalSideArrowButton>
      </S.CalCarousel>
      <S.CalLiveMonth aria-live="polite" aria-atomic="true">
        {viewMonth.year}년 {viewMonth.month}월
      </S.CalLiveMonth>
    </S.CalTopMargin>
  );
};