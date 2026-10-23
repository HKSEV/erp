import styled, { css, keyframes } from "styled-components";
import * as C from "./common/Common.styles";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;
const slideDown = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
`;

export type AlertModalVariant =
  | "info"
  | "success"
  | "error"
  | "confirm";

interface ModalProps {
  $isClosing?: boolean;
};

// layout
export const ModalOverlay = styled.div<ModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  z-index: 99999;
  ${C.FlexCenter}
  animation: ${({$isClosing}) => (
    $isClosing ? fadeOut : fadeIn
  )} 0.3s ease-out forwards;
`;
export const ModalContainer = styled.div`
  background-color: #FFF;
  width: 400px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
export const ModalTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
`;
export const CloseButton = styled.button`
  ${C.FlexCenter}
  width: 2rem;
  height: 2rem;
  padding: 0;
  flex-shrink: 0;
  color: #8590A5;
  background: transparent;
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  &:hover {
    color: #3278F6;
    background: #F1F6FF;
  }

  &:focus-visible {
    outline: 2px solid #3278F6;
    outline-offset: 2px;
  }
`;
export const ModalBody = styled.div`
  
`;

// schedule
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1rem;
`;
export const Select = styled.select`
  padding: 8px;
  border: 1px solid #D1D3E2;
  border-radius: 4px;
  outline: none;
  font-size: 0.9rem;
`;
export const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #D1D3E2;
  border-radius: 4px;
  outline: none;
  resize: none;
  height: 80px;
`;
export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;

  & > button {
    width: auto !important;
    min-width: 80px;
    padding: 8px 16px !important;
    flex: none;
  }
`;
export const ScheduleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
  max-height: 150px;
  overflow-y: auto;
  border-top: 1px solid #EEE;
`;
export const ScheduleItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  border-bottom: 1px solid #EEE;
  gap: 8px;
`;
export const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
`;
export const Badge = styled.span<{$status: "대기" | "진행" | "완료"}>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  color: #FFF;
  background-color: ${({$status}) => (
    $status === "완료" ? "#10B981" :
    $status === "진행" ? "#3B82F6" : "#F59E0B"
  )};
`;
export const SmallButton = styled.button`
  width: 100px;
  background-color: transparent;
  border: 1px solid #D1D3E2;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.75rem;
  cursor: pointer;
`;
export const ScheduleDot = styled.div`
  width: 6px;
  height: 6px;
  background-color: #3B82F6;
  border-radius: 50%;
  margin-top: 4px;
`;
// 커스텀 셀렉트 박스 컨테이너
export const CustomSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;
export const SelectTrigger = styled.div`
  padding: 10px 12px;
  border: 1px solid #D1D3E2;
  border-radius: 6px;
  background-color: #FFF;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  &:hover { border-color: #BAC8F3; }

  span {
    font-size: 0.7rem;
    color: #94A3B8;
  }
`;
// 드롭다운 리스트 영역
export const SelectList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin: 4px 0 0 0;
  padding: 0;
  list-style: none;
  background-color: #FFF;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow: hidden;
`;
// 드롭다운 개별 항목
interface SelectItemProps {
  $isSelected?: boolean;
};
export const SelectItem = styled.li<SelectItemProps>`
  padding: 10px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  color: ${({$isSelected}) => ($isSelected ? "#4E73DF" : "#475569")};
  background-color: ${({$isSelected}) => (
    $isSelected ? "#F8F9FC" : "transparent"
  )};
  font-weight: ${({$isSelected}) => ($isSelected ? "bold" : "normal")};
  &:hover { background-color: #F1F5F9; }
`;

// alert
export const AlertBox = styled.dialog<ModalProps>`
  width: calc(100% - 2rem);
  max-width: 25rem;
  max-height: calc(100dvh - 2rem);
  min-width: 18.75rem;
  margin: auto;
  padding: 2rem 1.75rem 1.75rem;
  color: #172033;
  background-color: #FFF;
  border: 1px solid #EEF2F7;
  border-radius: 1.25rem;
  outline: none;
  box-shadow:
    0 24px 64px rgba(15, 23, 42, 0.16),
    0 8px 24px rgba(15, 23, 42, 0.06);
  overflow-y: auto;
  overscroll-behavior: contain;
  font-family: inherit;
  font-size: 1rem;
  text-align: center;

  &,
  & * {
    box-sizing: border-box;
  }

  button {
    font-family: inherit;
  }

  &[open] {
    animation: ${({$isClosing}) => (
      $isClosing ? slideDown : slideUp
    )} 0.18s ease-out both;
  }

  &::backdrop {
    background: rgba(15, 23, 42, 0.32);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  @media (max-width: 480px) {
    padding: 1.75rem 1.25rem 1.25rem;
  }

  @media (prefers-reduced-motion: reduce) {
    &[open] {
      animation: none;
    }
  }
`;
export const AlertText = styled.h2`
  margin: 0;
  color: #172033;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.5px;
  overflow-wrap: anywhere;

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;
export const AlertIcon = styled.div<{$variant: AlertModalVariant}>`
  ${C.FlexCenter}
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 1.25rem;
  color: ${({$variant}) => (
    $variant === "error" ? "#DC2626" : "#2563EB"
  )};

  background-color: ${({$variant}) => (
    $variant === "error" ? "#FEF2F2" : "#EAF2FF"
  )};
  border-radius: 1rem;

  svg {
    width: 1.75rem;
    height: 1.75rem;
    stroke-width: 2.5;
  }
`;
export const AlertDescription = styled.p`
  margin: 0.5rem 0 0;
  color: #7B8498;
  font-size: 0.875rem;
  line-height: 1.6;
  letter-spacing: -0.3px;
  white-space: pre-line;
  overflow-wrap: anywhere;
`;
export const AlertButtonWrapper = styled.div<{$double: boolean}>`
  margin-top: 1.75rem;
  display: grid;
  grid-template-columns: ${({$double}) => (
    $double ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)"
  )};
  gap: 0.75rem;
`;
export const AlertButton = styled.button<{$isCancel?: boolean}>`
  ${C.ButtonBase}
  color: ${({$isCancel}) => ($isCancel ? "#536078" : "#FFF")};
  background-color: ${({$isCancel}) => (
    $isCancel ? "#F8FAFC" : "#2563EB"
  )};
  border: 1px solid ${({$isCancel}) => (
    $isCancel ? "#DCE1EB" : "#2563EB"
  )};
  min-height: 2.75rem;
  padding: 0.625rem 1rem;
  gap: 0.5rem;

  &:not(:disabled):hover {
    background-color: ${({$isCancel}) => (
      $isCancel ? "#EEF2F7" : "#1D4ED8"
    )};
    border-color: ${({$isCancel}) => (
      $isCancel ? "#CBD5E1" : "#1D4ED8"
    )};
    box-shadow: ${({$isCancel}) => (
      $isCancel ? "none" : "0 4px 12px rgba(37, 99, 235, 0.16)"
    )};
  }

  &:not(:disabled):active {
    background-color:  ${({$isCancel}) => (
      $isCancel ? "#E2E8F0" : "#1E40AF"
    )};
  }
`;