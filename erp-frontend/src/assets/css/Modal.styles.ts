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
    transform: translateY(1.25rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const slideDown = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(1.25rem);
  }
`;

interface ModalProps {
  $isClosing?: boolean;
};

// 일정모달
export const ModalOverlay = styled.div<ModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  z-index: 99999;
  ${C.FlexCenter}
  animation: ${({$isClosing}) => ($isClosing ? fadeOut : fadeIn)} 0.3s ease-out forwards;
`;
export const ModalContainer = styled.div`
  background-color: #FFF;
  width: 400px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;
export const ModalBox = styled.div<ModalProps>`
  background-color: #1E293B;
  padding: 2rem;
  border-radius: 0.75rem;
  min-width: 18.75rem;
  max-width: 90%;
  gap: 1.5rem;
  ${C.FlexColumn}
  ${C.BoxShadow}
  animation: ${({$isClosing}) => ($isClosing ? slideDown : slideUp)} 0.3s ease-out forwards;
`;
export const ModalText = styled.p`
  font-size: 1.125rem;
  color: #FFF;
  text-align: center;
  margin: 0;
  line-height: 1.5;
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
  background-color: transparent;
  border: none;
  font-size: 2rem;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, color 0.2s ease;
  &:hover {
    color: #000;
    transform: rotate(90deg);
  }
`;
export const ModalBody = styled.div`
  
`;
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