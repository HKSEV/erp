"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import { isAxiosError } from "axios";
import api from "@/app/lib/api";
import type { Schedule } from "@/app/types/Schedule";
import {
  FiCalendar,
  FiChevronDown,
  FiEdit2,
  FiTrash2,
  FiX
} from "react-icons/fi";
import * as S from "@/assets/css/Style.styles";
import useModal from "../contexts/ModalContext";
import { lockModalScroll } from "@/app/lib/modalScrollLock";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  selectedDate: number | null;
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
};

function getApiError(error: unknown, fallback: string): string {
  if (!isAxiosError<{message?: unknown}>(error))
    return fallback;

  if (error.response?.status === 401)
    return "로그인 정보를 확인할 수 없습니다. 다시 로그인해 주세요.";

  const message = error.response?.data?.message;

  return typeof message === "string" && message.trim()
    ? message
    : fallback;
}

export default function ScheduleModal({
  isOpen, onClose, year, month, selectedDate, schedules, setSchedules
}: ScheduleModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mountedRef = useRef(false);
  const mutationRef = useRef(false);
  const id = useId();

  const [formContent, setFormContent] = useState("");
  const [formStatus, setFormStatus] = useState<Schedule["status"]>("대기");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(isOpen);
  const [isMutating, setIsMutating] = useState(false);
  const isBusy = isLoading || isMutating;

  const {openAlertModal} = useModal();
  const alertRef = useRef(openAlertModal);

  // 알림 함수 변경 때문에 조회가 반복되지 않도록 보관합니다.
  useEffect(() => {
    alertRef.current = openAlertModal;
  }, [openAlertModal]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || selectedDate === null || !dialog)
      return;
    
    if (!dialog.open)
      dialog.showModal();

    const unlockScroll = lockModalScroll();

    return () => {
      if (dialog.open)
        dialog.close();
      unlockScroll();
    };
  }, [isOpen, selectedDate]);

  // 모달을 열면 해당 월의 DB 일정을 조회합니다.
  useEffect(() => {
    if (!isOpen || selectedDate === null)
      return;

    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);

      try {
        const {data} = await api.get<Schedule[]>("/api/schedules", {
          params: {year, month},
          signal: controller.signal,
        });

        if (controller.signal.aborted)
          return;

        setSchedules((prev) => [
          ...prev.filter(
            (item) => item.year !== year || item.month !== month
          ),
          ...data,
        ]);
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          alertRef.current(
            "일정 조회에 실패했습니다.",
            undefined,
            {
              variant: "error",
              description: getApiError(
                err,
                "모달을 다시 열어 목록을 확인해 주세요.",
              ),
            },
          );
        }
      } finally {
        if (!controller.signal.aborted)
          setIsLoading(false);
      };
    };

    void load();

    return () => controller.abort();
  }, [isOpen, year, month, selectedDate, setSchedules]);

  const reset = () => {
    setFormContent("");
    setFormStatus("대기");
    setEditingId(null);
  };

  const handleClose = () => {
    if (!mutationRef.current)
      onClose();
  };

  const handleEdit = (schedule: Schedule) => {
    if (isLoading || mutationRef.current)
      return;

    setFormContent(schedule.content);
    setFormStatus(schedule.status);
    setEditingId(schedule.id);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !isOpen ||
      selectedDate === null ||
      isLoading ||
      mutationRef.current
    )
      return;

    const content = formContent.trim();

    if (!content || content.length > 1000) {
      alertRef.current(
        "입력 내용을 확인해 주세요.",
        undefined,
        {
          variant: "error",
          description: "일정 내용은 1~1000자로 입력해 주세요.",
        },
      );
      return;
    };

    const targetId = editingId;
    mutationRef.current = true;
    setIsMutating(true);

    try {
      const response = targetId !== null
        ? await api.put<Schedule>(
            "/api/schedules/" + encodeURIComponent(targetId),
            {
              content,
              status: formStatus,
            },
          )
        : await api.post<Schedule>("/api/schedules", {
            year,
            month,
            date: selectedDate,
            content,
            status: formStatus,
          });

      if (!mountedRef.current)
        return;

      const saved = response.data;

      // 서버 응답으로 등록하거나 기존 항목을 교체합니다.
      setSchedules((prev) =>
        prev.some((item) => item.id === saved.id)
          ? prev.map((item) =>
              item.id === saved.id ? saved : item,
            )
          : [...prev, saved],
      );

      reset();
    } catch (err: unknown) {
      if (mountedRef.current) {
        alertRef.current(
          targetId !== null
            ? "일정 수정에 실패했습니다."
            : "일정 등록에 실패했습니다.",
          undefined,
          {
            variant: "error",
            description: getApiError(
              err,
              "처리 결과를 확인하지 못했습니다. 모달을 다시 열어 확인해 주세요.",
            ),
          },
        );
      }
    } finally {
      mutationRef.current = false;

      if (mountedRef.current)
        setIsMutating(false);
    };
  };

  const deleteSchedule = async (scheduleId: string) => {
    if (
      !mountedRef.current ||
      isLoading ||
      mutationRef.current
    )
      return;

    mutationRef.current = true;
    setIsMutating(true);

    try {
      await api.delete<void>(
        "/api/schedules/" + encodeURIComponent(scheduleId),
      );

      if (!mountedRef.current)
        return;

      // 서버 삭제 성공 후 화면에서도 제거합니다.
      setSchedules((prev) =>
        prev.filter((item) => item.id !== scheduleId),
      );

      if (editingId === scheduleId)
        reset();
    } catch (error: unknown) {
      if (mountedRef.current) {
        alertRef.current(
          "일정 삭제에 실패했습니다.",
          undefined,
          {
            variant: "error",
            description: getApiError(
              error,
              "처리 결과를 확인하지 못했습니다. 모달을 다시 열어 확인해 주세요.",
            ),
          },
        );
      }
    } finally {
      mutationRef.current = false;

      if (mountedRef.current)
        setIsMutating(false);
    };
  };

  const handleDelete = (scheduleId: string) => {
    if (isLoading || mutationRef.current)
      return;

    alertRef.current(
      "일정을 삭제하시겠습니까?",
      () => {
        void deleteSchedule(scheduleId);
      },
      {
        variant: "confirm",
        description: "삭제한 일정은 되돌릴 수 없습니다.",
        confirmText: "삭제",
        cancelText: "취소",
      },
    );
  };

  if (!isOpen || selectedDate === null)
    return null;

  const entries = schedules.filter(
    (item) =>
      item.year === year &&
      item.month === month &&
      item.date === selectedDate,
  );

  return (
    <S.ModalDialog
    ref={dialogRef}
    aria-labelledby={`${id}-title`}
    aria-describedby={`${id}-description`}
    onCancel={(e) => {
      e.preventDefault();
      handleClose();
    }}
    onClick={(e) => {
      if (e.target !== e.currentTarget) return;
      const rect = e.currentTarget.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        handleClose();
    }}>
      <S.ModalDialogHeader>
        <S.ModalDialogIcon aria-hidden="true">
          <FiCalendar/>
        </S.ModalDialogIcon>
        <S.ModalHeading>
          <S.ModalDialogTitle id={`${id}-title`}>
            {`${year}년 ${month}월 ${selectedDate}일 업무 일정`}
          </S.ModalDialogTitle>
          <S.ModalDialogDescription id={`${id}-description`}>
            일정을 등록하고 진행 상태를 관리하세요.
          </S.ModalDialogDescription>
        </S.ModalHeading>
        <S.CloseButton
        type="button"
        aria-label="일정 모달 닫기"
        onClick={handleClose}
        disabled={isMutating}
        style={{flexShrink: 0}}>
          <FiX aria-hidden="true"/>
        </S.CloseButton>
      </S.ModalDialogHeader>
      <S.ModalDialogBody>
        <S.ModalForm
        aria-busy={isBusy}
        onSubmit={handleSave}>
          {editingId && (
            <S.ScheduleEditing>
              선택한 일정을 수정하고 있습니다.
              <button
              type="button"
              disabled={isBusy}
              onClick={reset}>
                수정 취소
              </button>
            </S.ScheduleEditing>
          )}
          <S.ModalField>
            <S.ModalLabel htmlFor={`${id}-status`}>
              진행 상태
            </S.ModalLabel>
            <S.ScheduleSelectWrapper $status={formStatus}>
              <S.ScheduleSelect
              id={`${id}-status`}
              value={formStatus}
              disabled={isBusy}
              onChange={(e) => (
                setFormStatus(e.target.value as Schedule["status"])
              )}>
                <option value="대기">대기</option>
                <option value="진행">진행</option>
                <option value="완료">완료</option>
              </S.ScheduleSelect>
              <FiChevronDown aria-hidden="true"/>
            </S.ScheduleSelectWrapper>
          </S.ModalField>
          <S.ModalField>
            <S.ModalLabel htmlFor={`${id}-content`}>
              일정 내용
            </S.ModalLabel>
            <S.ScheduleTextarea
            id={`${id}-content`}
            rows={4}
            maxLength={1000}
            value={formContent}
            disabled={isBusy}
            onChange={(e) => setFormContent(e.target.value)}
            placeholder="일정 내용을 입력해 주세요."
            required/>
          </S.ModalField>
          <S.ModalActions>
            <S.ModalButton
            type="button"
            $isCancel
            onClick={handleClose}
            disabled={isMutating}>
              닫기
            </S.ModalButton>
            <S.ModalButton
            type="submit"
            disabled={isBusy || !formContent.trim()}>
              {editingId ? "수정" : "등록"}
            </S.ModalButton>
          </S.ModalActions>
        </S.ModalForm>

        <S.ScheduleListSection aria-labelledby={`${id}-list`}>
          <S.ScheduleListHeading>
            <h3 id={`${id}-list`}>등록된 일정</h3>
            <span aria-live="polite">{entries.length}건</span>
          </S.ScheduleListHeading>
          {entries.length === 0 ? (
            <S.ScheduleEmpty>
              <FiCalendar aria-hidden="true"/>
              <p>등록된 일정이 없습니다.</p>
              <span>위에서 새 일정을 추가해 보세요.</span>
            </S.ScheduleEmpty>
          ) : (
            <S.ScheduleEntries>
              {entries.map((sch) => (
                <S.ScheduleEntry key={sch.id}>
                  <S.ScheduleEntryHeader>
                    <S.ScheduleStatusBadge $status={sch.status}>
                      {sch.status}
                    </S.ScheduleStatusBadge>
                    <time>{sch.createdAt} 작성</time>
                  </S.ScheduleEntryHeader>
                  <S.ScheduleContent>{sch.content}</S.ScheduleContent>
                  <S.ScheduleEntryActions>
                    <S.ScheduleIconButton
                    type="button"
                    aria-label="일정 수정"
                    title="일정 수정"
                    disabled={isBusy}
                    onClick={() => handleEdit(sch)}>
                      <FiEdit2 aria-hidden="true"/>
                    </S.ScheduleIconButton>
                    <S.ScheduleIconButton
                    type="button"
                    $danger
                    aria-label="일정 삭제"
                    title="일정 삭제"
                    disabled={isBusy}
                    onClick={() => handleDelete(sch.id)}>
                      <FiTrash2 aria-hidden="true"/>
                    </S.ScheduleIconButton>
                  </S.ScheduleEntryActions>
                </S.ScheduleEntry>
              ))}
            </S.ScheduleEntries>
          )}
        </S.ScheduleListSection>
      </S.ModalDialogBody>
    </S.ModalDialog>
  );
};
