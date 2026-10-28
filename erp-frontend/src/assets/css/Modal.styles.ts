import styled, { css, keyframes } from "styled-components";
import * as C from "./common/Common.styles";

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

type Status = "대기" | "진행" | "완료";
const colors = {
  대기: { text: "#B7791F", background: "#FFF7E6", dot: "#F5AD24" },
  진행: { text: "#2563EB", background: "#EFF6FF", dot: "#3B82F6" },
  완료: { text: "#059669", background: "#ECFDF5", dot: "#10B981" },
};

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

// 공통
export const ModalButton = styled.button<{$isCancel?: boolean}>`
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

// schedule
export const ScheduleDialog = styled(AlertBox)`
  max-width: 34rem;
  min-width: 0;
  padding: 0;
  text-align: left;

  @media (max-width: 480px) {
    padding: 0;
  }
`;
export const ScheduleDialogHeader = styled.header`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.5rem;
  border-bottom: 1px solid #EEF2F7;

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;
export const ScheduleDialogIcon = styled.div`
  ${C.FlexCenter}
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  background: #EAF2FF;
  color: #2563EB;
  border-radius: 0.75rem;

  svg {
    width: 1.375rem;
    height: 1.375rem;
  }
`;
export const ScheduleHeading = styled.div`
  flex: 1;
  min-width: 0;
`;
export const ScheduleDialogTitle = styled.h2`
  margin: 0;
  color: #172033;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;
export const ScheduleDialogSubtitle = styled.p`
  margin: 0.25rem 0 0;
  color: #7B8498;
  font-size: 0.75rem;
  line-height: 1.6;
`;
export const ScheduleDialogBody = styled.div`
  padding: 1.5rem;
  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;
export const ScheduleForm = styled.form`
  ${C.FlexColumn}
  gap: 1rem;
`;
export const ScheduleField = styled.div`
  ${C.FlexColumn}
  gap: 0.5rem;
`;
export const ScheduleLabel = styled.label`
  color: #334155;
  font-size: 0.875rem;
  font-weight: 600;
`;
export const ScheduleSelectWrapper = styled.div<{$status: Status}>`
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: ${({$status}) => colors[$status].dot};
    pointer-events: none;
  }

  > svg {
    position: absolute;
    right: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94A3B8;
    pointer-events: none;
  }
`;
export const ScheduleSelect = styled.select`
  width: 100%;
  padding: 0.625rem 2.25rem;
  border: 1px solid #DCE1EB;
  border-radius: 0.625rem;
  outline: none;
  background-color: #FFF;
  color: #1E293B;
  font-family: inherit;
  font-size: 0.875rem;
  min-height: 2.75rem;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::placeholder {
    color: #94A3B8;
  }

  &:hover {
    border-color: #94A3B8;
  }

  &:focus {
    border-color: #4E73DF;
    box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.15);
  }
`;
export const ScheduleTextarea = styled.textarea`
  width: 100%;
  min-height: 7rem;
  padding: 0.75rem 0.875rem;
  resize: vertical;
  background-color: #FFF;
  border: 1px solid #DCE1EB;
  border-radius: 0.625rem;
  color: #253047;
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.6;
  outline: none;

  &::placeholder {
    color: #9AA3B5;
  }

  &:hover {
    border-color: #B7C2D4;
  }

  &:focus {
    border-color: #3278F6;
    box-shadow: 0 0 0 3px rgba(50, 120, 246, 0.1);
  }
`;
export const ScheduleActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
`;
export const ScheduleEditing = styled.div`
  ${C.FlexBetween}
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: #EFF6FF;
  border-radius: 0.5rem;
  color: #2563EB;
  font-size: 0.75rem;

  > button {
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
  }
`;
export const ScheduleListSection = styled.section`
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #EEF2F7;
`;
export const ScheduleListHeading = styled.div`
  ${C.FlexBetween}
  gap: 0.5rem;
  margin-bottom: 0.875rem;

  > h3 {
    margin: 0;
    color: #334155;
    font-size: 0.875rem;
    font-weight: 650;
  }

  > span {
    color: #94A3b8;
    font-size: 0.75rem;
  }
`;
export const ScheduleEmpty = styled.div`
  ${C.FlexColumn}
  align-items: center;
  gap: 0.375rem;
  padding: 1.25rem 0.5rem;
  text-align: center;

  > svg {
    width: 2rem;
    height: 2rem;
    margin-bottom: 0.375rem;
    color: #a5b2c9;
  }

  > p {
    margin: 0;
    color: #7B8498;
    font-size: 0.8125rem;
  }

  > span {
    color: #94A3b8;
    font-size: 0.75rem;
  }
`;
export const ScheduleEntries = styled.ul`
  ${C.FlexColumn}
  gap: 0.75rem;
  max-height: 16rem;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
`;
export const ScheduleEntry = styled.li`
  padding: 0.875rem;
  border: 1px solid #E8EDF5;
  border-radius: 0.625rem;
  background: #FBFCFE;
`;
export const ScheduleEntryHeader = styled.div`
  ${C.FlexBetween}
  gap: 0.5rem;
  margin-bottom: 0.625rem;

  > time {
    color: #94A3B8;
    font-size: 0.6875rem;
  }
`;
export const ScheduleStatusBadge = styled.span<{$status: Status}>`
  padding: 0.1875rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${({$status}) => colors[$status].text};
  background: ${({$status}) => colors[$status].background};
`;
export const ScheduleContent = styled.p`
  margin: 0;
  color: #334155;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;
export const ScheduleEntryActions = styled.div`
  ${C.FlexRight}
  gap: 0.375rem;
  margin-top: 0.5rem;
`;
export const ScheduleIconButton = styled(CloseButton)<{$danger?: boolean}>`
  width: 1.875rem;
  height: 1.875rem;
  color: ${({$danger}) => ($danger ? "#D96B75" : "#7B8498")};

  &:hover {
    color: ${({$danger}) => ($danger ? "#DC2626" : "#2563EB")};
    background: ${({$danger}) => ($danger ? "#FEF2F2" : "#EFF6FF")};
  }

  svg {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;
