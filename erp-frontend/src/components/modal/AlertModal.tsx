"use client";

import * as S from "@/assets/css/Style.styles";

interface AlertModalProps {
  isOpen: boolean;
  isOn: boolean;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
};

export default function AlertModal(
  {isOpen, isOn, message, onClose, onConfirm}: AlertModalProps
) {
  if (!isOpen)
    return null;

  const handleConfirm = () => {
    onClose();
    onConfirm?.();
  };

  return (
    <S.ModalOverlay>
      <S.ModalBox>
        <S.ModalText>{message}</S.ModalText>
        <S.ButtonGroup>
          {isOn && (
            <S.Button
            $variant="grey"
            $size="medium"
            onClick={onClose}>
              취소
            </S.Button>
          )}
          <S.Button
          $variant="primary"
          $size="medium"
          onClick={handleConfirm}>
            확인
          </S.Button>
        </S.ButtonGroup>
      </S.ModalBox>
    </S.ModalOverlay>
  );
};
