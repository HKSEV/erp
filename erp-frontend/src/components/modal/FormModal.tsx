"use client";

import React, { useEffect, useId, useRef } from "react";
import { FiEdit3, FiX } from "react-icons/fi";
import { lockModalScroll } from "@/app/lib/modalScrollLock";
import * as S from "@/assets/css/Style.styles";

interface FormModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isSubmitting?: boolean;
  error?: string | null;
  submitText?: string;
  pendingText?: string;
  cancelText?: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  noValidate?: boolean;
}

export default function FormModal({
  isOpen,
  title,
  description,
  icon = <FiEdit3/>,
  children,
  isSubmitting = false,
  error = null,
  submitText = "등록",
  pendingText = "등록 중...",
  cancelText = "취소",
  onClose,
  onSubmit,
  noValidate = false,
}: FormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!isOpen || !dialog)
      return;

    if (!dialog.open)
      dialog.showModal();

    const unlockScroll = lockModalScroll();

    return () => {
      if (dialog.open)
        dialog.close();
      unlockScroll();
    };
  }, [isOpen]);

  const handleClose = () => {
    if (!isSubmitting)
      onClose();
  };

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDialogElement>,
  ) => {
    if (e.target !== e.currentTarget)
      return;

    const rect = e.currentTarget.getBoundingClientRect();

    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    )
      handleClose();
  };

  if (!isOpen)
    return null;

  return (
    <S.ModalDialog
      ref={dialogRef}
      aria-labelledby={id + "-title"}
      aria-describedby={description ? id + "-description" : undefined}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onClick={handleBackdropClick}
    >
      <S.ModalDialogHeader>
        <S.ModalDialogIcon aria-hidden="true">
          {icon}
        </S.ModalDialogIcon>

        <S.ModalHeading>
          <S.ModalDialogTitle id={id + "-title"}>
            {title}
          </S.ModalDialogTitle>

          {description && (
            <S.ModalDialogDescription id={id + "-description"}>
              {description}
            </S.ModalDialogDescription>
          )}
        </S.ModalHeading>

        <S.CloseButton
        type="button"
        aria-label={title + " 닫기"}
        disabled={isSubmitting}
        onClick={handleClose}>
          <FiX aria-hidden="true"/>
        </S.CloseButton>
      </S.ModalDialogHeader>

      <S.ModalDialogBody>
        <S.ModalForm
          noValidate={noValidate}
          aria-busy={isSubmitting}
          onSubmit={(e) => {
            e.preventDefault();
            if (!isSubmitting)
              onSubmit(e);
          }}
        >
          <S.ModalFields disabled={isSubmitting}>
            {children}
          </S.ModalFields>

          {error && (
            <S.ModalErrorMessage role="alert">
              {error}
            </S.ModalErrorMessage>
          )}

          <S.ModalActions>
            <S.ModalButton
            type="button"
            $isCancel
            disabled={isSubmitting}
            onClick={handleClose}>
              {cancelText}
            </S.ModalButton>

            <S.ModalButton
            type="submit"
            disabled={isSubmitting}>
              {isSubmitting ? pendingText : submitText}
            </S.ModalButton>
          </S.ModalActions>
        </S.ModalForm>
      </S.ModalDialogBody>
    </S.ModalDialog>
  );
};
