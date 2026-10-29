"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import { Temporal } from "@js-temporal/polyfill";
import {
  FiCalendar,
  FiChevronDown,
  FiEdit2,
  FiTrash2,
  FiX
} from "react-icons/fi";
import * as S from "@/assets/css/Style.styles";
import useModal from "../contexts/ModalContext";

export interface Schedule {
  id: string;
  year: number;
  month: number;
  date: number;
  content: string;
  status: "대기" | "진행" | "완료";
  createdAt: string;
};

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  selectedDate: number | null;
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
};

export default function ScheduleModal({
  isOpen, onClose, year, month, selectedDate, schedules, setSchedules
}: ScheduleModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [formContent, setFormContent] = useState("");
  const [formStatus, setFormStatus] = useState<Schedule["status"]>("대기");
  const [editingId, setEditingId] = useState<string | null>(null);
  const {openAlertModal} = useModal();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog)
      return;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open)
      dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || selectedDate === null)
    return null;

  const entries = schedules.filter((sch) => (
    sch.year === year && sch.month === month && sch.date === selectedDate
  ));
  const reset = () => {
    setFormContent("");
    setFormStatus("대기");
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const content = formContent.trim();
    if (!content || !setSchedules)
      return;
    if (editingId) {
      setSchedules((prev) => prev.map((sch) => (
        sch.id === editingId
          ? {...sch, content, status: formStatus}
          : sch
      )));
    } else {
      setSchedules((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          year,
          month,
          date: selectedDate,
          content,
          status: formStatus,
          createdAt: Temporal.Now.plainTimeISO().toString().split(".")[0],
        },
      ]);
    };
    reset();
  };

  // const handleEdit = (sch: Schedule) => {
  //   setFormContent(sch.content);
  //   setFormStatus(sch.status);
  //   setEditingId(sch.id);
  // };

  const handleDelete = (id: string) => {
    openAlertModal(
      "일정을 삭제하시겠습니까?",
      () => {
        setSchedules((prev) => prev.filter((sch) => sch.id !== id));
        if (editingId === id)
          reset();
      },
      {
        variant: "confirm",
        description: "삭제한 일정은 되돌릴 수 없습니다.",
        confirmText: "삭제",
        cancelText: "취소",
      },
    );
  };

  return (
    <S.ScheduleDialog
    ref={dialogRef}
    aria-labelledby={`${id}-title`}
    aria-describedby={`${id}-description`}
    onCancel={(e) => {
      e.preventDefault();
      onClose();
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
        onClose();
    }}>
      <S.ScheduleDialogHeader>
        <S.ScheduleDialogIcon aria-hidden="true">
          <FiCalendar />
        </S.ScheduleDialogIcon>
        <S.ScheduleHeading>
          <S.ScheduleDialogTitle id={`${id}-title`}>
            {`${year}년 ${month}월 ${selectedDate}일 업무 일정`}
          </S.ScheduleDialogTitle>
          <S.ScheduleDialogSubtitle id={`${id}-description`}>
            일정을 등록하고 진행 상태를 관리하세요.
          </S.ScheduleDialogSubtitle>
        </S.ScheduleHeading>
        <S.CloseButton
        type="button"
        aria-label="일정 모달 닫기"
        onClick={onClose}
        style={{flexShrink: 0}}>
          <FiX aria-hidden="true"/>
        </S.CloseButton>
      </S.ScheduleDialogHeader>
      <S.ScheduleDialogBody>
        <S.ScheduleForm onSubmit={handleSave}>
          {editingId && (
            <S.ScheduleEditing>
              선택한 일정을 수정하고 있습니다.
              <button type="button" onClick={reset}>
                수정 취소
              </button>
            </S.ScheduleEditing>
          )}
          <S.ScheduleField>
            <S.ScheduleLabel htmlFor={`${id}-status`}>진행 상태</S.ScheduleLabel>
            <S.ScheduleSelectWrapper $status={formStatus}>
              <S.ScheduleSelect
              id={`${id}-status`}
              value={formStatus}
              onChange={(e) => (
                setFormStatus(e.target.value as Schedule["status"])
              )}>
                <option value="대기">대기</option>
                <option value="진행">진행</option>
                <option value="완료">완료</option>
              </S.ScheduleSelect>
              <FiChevronDown aria-hidden="true"/>
            </S.ScheduleSelectWrapper>
          </S.ScheduleField>
          <S.ScheduleField>
            <S.ScheduleLabel htmlFor={`${id}-content`}>일정 내용</S.ScheduleLabel>
            <S.ScheduleTextarea
            id={`${id}-content`}
            rows={4}
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            placeholder="일정 내용을 입력해 주세요."
            required/>
          </S.ScheduleField>
          <S.ScheduleActions>
            <S.ModalButton
            type="button"
            $isCancel
            onClick={onClose}>
              닫기
            </S.ModalButton>
            <S.ModalButton
            type="submit"
            disabled={!formContent.trim()}>
              {editingId ? "수정" : "등록"}
            </S.ModalButton>
          </S.ScheduleActions>
        </S.ScheduleForm>

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
                    onClick={() => {
                      setFormContent(sch.content);
                      setFormStatus(sch.status);
                      setEditingId(sch.id);
                    }}>
                      <FiEdit2 aria-hidden="true" />
                    </S.ScheduleIconButton>
                    <S.ScheduleIconButton
                    type="button"
                    $danger
                    aria-label="일정 삭제"
                    title="일정 삭제"
                    onClick={() => handleDelete(sch.id)}>
                      <FiTrash2 aria-hidden="true"/>
                    </S.ScheduleIconButton>
                  </S.ScheduleEntryActions>
                </S.ScheduleEntry>
              ))}
            </S.ScheduleEntries>
          )}
        </S.ScheduleListSection>
      </S.ScheduleDialogBody>
    </S.ScheduleDialog>
  );
};
