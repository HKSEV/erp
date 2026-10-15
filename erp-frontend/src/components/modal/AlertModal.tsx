"use client";

import { useState, useEffect } from "react";
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
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen)
      setIsClosing(false);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    onClose();
  };

  if (!isOpen)
    return null;

  return (
    <S.ModalOverlay $isClosing={isClosing}>
      <S.ModalBox $isClosing={isClosing}>
        <S.ModalText>{message}</S.ModalText>
        {isOn && (
          <S.Button
          $variant="danger"
          $size="medium"
          onClick={handleClose}>
            취소
          </S.Button>
        )}
        <S.Button
        $variant="white"
        $size="medium"
        onClick={onConfirm ? () => {
          handleClose();
          onConfirm();
        } : handleClose}>
          확인
        </S.Button>
      </S.ModalBox>
    </S.ModalOverlay>
  );
};
