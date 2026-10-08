"use client";

import { useState, useEffect } from "react";
import * as S from "@/assets/css/Style.styles";

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

export const AlertModal = (
  {isOpen, message, onClose}: AlertModalProps
) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen)
      setIsClosing(false);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen)
    return null;

  return (
    <S.ModalOverlay>
      <S.ModalBox>
        <S.ModalText>{message}</S.ModalText>
        <S.Button
        $variant="white"
        $size="medium"
        onClick={handleClose}>
          확인
        </S.Button>
      </S.ModalBox>
    </S.ModalOverlay>
  );
};
