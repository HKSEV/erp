"use client";

import { useEffect, useId, useRef } from "react";
import {
  FiCheck,
  FiInfo,
  FiAlertCircle,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import * as S from "@/assets/css/Style.styles";

export interface AlertModalOptions {
  variant?: S.AlertModalVariant;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

interface AlertModalProps extends AlertModalOptions {
  isOpen: boolean;
  isOn: boolean;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
};

export default function AlertModal(
  {
    isOpen,
    isOn,
    message,
    onClose,
    onConfirm,
    variant,
    description,
    confirmText = "확인",
    cancelText = "취소",
  }: AlertModalProps
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const id = useId();
  const resolvedVariant = variant ?? (isOn ? "confirm" : "info");
  const Icon = {
    success: FiCheck,
    info: FiInfo,
    error: FiAlertCircle,
    confirm: FiLogOut,
  } [resolvedVariant];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog)
      return;
    if (!dialog.open)
      dialog.showModal();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const initialButton = isOn
      ? cancelRef.current
      : confirmRef.current;
    initialButton?.focus();

    return () => {
      if (dialog.open)
        dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isOn, message]);

  const handleConfirm = () => {
    // 기존과 동일하게 닫은 뒤 콜백 실행
    onClose();
    onConfirm?.();
  };

  return (
    <S.AlertBox
    ref={dialogRef}
    role="alertdialog"
    aria-labelledby={`${id}-title`}
    aria-describedby={description ? `${id}-description` : undefined}
    onCancel={(e) => {
      e.preventDefault();
      onClose();
    }}>
      <S.CloseButton
      style={{position:"absolute", top:"0.75rem", right:"0.75rem"}}
      type="button"
      aria-label="모달 닫기"
      onClick={onClose}>
        <FiX aria-hidden="true"/>
      </S.CloseButton>

      <S.AlertIcon
      $variant={resolvedVariant}
      aria-hidden="true">
        <Icon/>
      </S.AlertIcon>

      <S.AlertText id={`${id}-title`}>{message}</S.AlertText>

      {description && (
        <S.AlertDescription id={`${id}-description`}>
          {description}
        </S.AlertDescription>
      )}
      <S.AlertButtonWrapper $double={isOn}>
        {isOn && (
          <S.ModalButton $isCancel
          ref={cancelRef}
          type="button"
          onClick={onClose}>
            {cancelText}
          </S.ModalButton>
        )}
        <S.ModalButton
        ref={confirmRef}
        type="button"
        onClick={handleConfirm}>
          {confirmText}
        </S.ModalButton>
      </S.AlertButtonWrapper>
    </S.AlertBox>
  );
};
