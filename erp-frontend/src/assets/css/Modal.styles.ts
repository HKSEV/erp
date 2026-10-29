import styled, { keyframes } from "styled-components";
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
// 일정 상태 → 공통 상태 색 (다른 화면의 StatusBadge와 같은 색)
const STATUS_TONE = {
  대기: "warning",
  진행: "info",
  완료: "success",
} as const;

// alert
export const AlertBox = styled.dialog<ModalProps>`
  width: calc(100% - 2rem);
  max-width: 25rem;
  max-height: calc(100dvh - 2rem);
  min-width: 18.75rem;
  margin: auto;
  padding: 2rem 1.75rem 1.75rem;
  color: ${({theme}) => theme.colors.textStrong};
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: 1.25rem;
  outline: none;
  box-shadow: ${({theme}) => theme.shadow.modal};
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
    background: ${({theme}) => theme.colors.backdrop};
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
  color: ${({theme}) => theme.colors.textStrong};
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
  color: ${({theme, $variant}) => (
    $variant === "error" ? theme.colors.dangerHover : theme.colors.accent
  )};

  background-color: ${({theme, $variant}) => (
    $variant === "error" ? theme.status.danger.bg : theme.colors.accentSubtle
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
  color: ${({theme}) => theme.colors.textMuted};
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
  color: ${({theme, $isCancel}) => ($isCancel ? theme.colors.textSecondary : theme.colors.onAccent)};
  background-color: ${({theme, $isCancel}) => (
    $isCancel ? theme.colors.bg : theme.colors.accent
  )};
  border: 1px solid ${({theme, $isCancel}) => (
    $isCancel ? theme.colors.borderStrong : theme.colors.accent
  )};
  min-height: 2.75rem;
  padding: 0.625rem 1rem;
  gap: 0.5rem;

  &:not(:disabled):hover {
    background-color: ${({theme, $isCancel}) => (
      $isCancel ? theme.colors.surfaceSubtle : theme.colors.accentHover
    )};
    border-color: ${({theme, $isCancel}) => (
      $isCancel ? theme.colors.borderStrong : theme.colors.accentHover
    )};
    box-shadow: ${({theme, $isCancel}) => (
      $isCancel ? "none" : theme.shadow.accent
    )};
  }

  &:not(:disabled):active {
    background-color: ${({theme, $isCancel}) => (
      $isCancel ? theme.colors.border : theme.colors.accentText
    )};
  }

  &:disabled {
    cursor: default;
  }
`;
export const CloseButton = styled.button`
  ${C.FlexCenter}
  width: 2rem;
  height: 2rem;
  padding: 0;
  flex-shrink: 0;
  color: ${({theme}) => theme.colors.textMuted};
  background: transparent;
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  &:hover {
    color: ${({theme}) => theme.colors.accent};
    background: ${({theme}) => theme.colors.accentSubtle};
  }

  &:focus-visible {
    outline: 2px solid ${({theme}) => theme.colors.accent};
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
  border-bottom: 1px solid ${({theme}) => theme.colors.border};

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;
export const ScheduleDialogIcon = styled.div`
  ${C.FlexCenter}
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  background: ${({theme}) => theme.colors.accentSubtle};
  color: ${({theme}) => theme.colors.accent};
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
  color: ${({theme}) => theme.colors.textStrong};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;
export const ScheduleDialogSubtitle = styled.p`
  margin: 0.25rem 0 0;
  color: ${({theme}) => theme.colors.textMuted};
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
  color: ${({theme}) => theme.colors.textBody};
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
    background: ${({theme, $status}) => theme.status[STATUS_TONE[$status]].dot};
    pointer-events: none;
  }

  > svg {
    position: absolute;
    right: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({theme}) => theme.colors.textDisabled};
    pointer-events: none;
  }
`;
export const ScheduleSelect = styled.select`
  width: 100%;
  padding: 0.625rem 2.25rem;
  border: 1px solid ${({theme}) => theme.colors.borderStrong};
  border-radius: 0.625rem;
  outline: none;
  background-color: ${({theme}) => theme.colors.surface};
  color: ${({theme}) => theme.colors.textStrong};
  font-family: inherit;
  font-size: 0.875rem;
  min-height: 2.75rem;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::placeholder {
    color: ${({theme}) => theme.colors.textDisabled};
  }

  &:hover {
    border-color: ${({theme}) => theme.colors.textDisabled};
  }

  &:focus {
    border-color: ${({theme}) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({theme}) => theme.colors.accentSubtle};
  }
`;
export const ScheduleTextarea = styled.textarea`
  width: 100%;
  min-height: 7rem;
  padding: 0.75rem 0.875rem;
  resize: vertical;
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme}) => theme.colors.borderStrong};
  border-radius: 0.625rem;
  color: ${({theme}) => theme.colors.textStrong};
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.6;
  outline: none;

  &::placeholder {
    color: ${({theme}) => theme.colors.textDisabled};
  }

  &:hover {
    border-color: ${({theme}) => theme.colors.textDisabled};
  }

  &:focus {
    border-color: ${({theme}) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({theme}) => theme.colors.accentSubtle};
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
  background: ${({theme}) => theme.colors.accentSubtle};
  border-radius: 0.5rem;
  color: ${({theme}) => theme.colors.accent};
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
  border-top: 1px solid ${({theme}) => theme.colors.border};
`;
export const ScheduleListHeading = styled.div`
  ${C.FlexBetween}
  gap: 0.5rem;
  margin-bottom: 0.875rem;

  > h3 {
    margin: 0;
    color: ${({theme}) => theme.colors.textBody};
    font-size: 0.875rem;
    font-weight: 650;
  }

  > span {
    color: ${({theme}) => theme.colors.textDisabled};
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
    color: ${({theme}) => theme.colors.textDisabled};
  }

  > p {
    margin: 0;
    color: ${({theme}) => theme.colors.textMuted};
    font-size: 0.8125rem;
  }

  > span {
    color: ${({theme}) => theme.colors.textDisabled};
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
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: 0.625rem;
  background: ${({theme}) => theme.colors.bg};
`;
export const ScheduleEntryHeader = styled.div`
  ${C.FlexBetween}
  gap: 0.5rem;
  margin-bottom: 0.625rem;

  > time {
    color: ${({theme}) => theme.colors.textDisabled};
    font-size: 0.6875rem;
  }
`;
export const ScheduleStatusBadge = styled.span<{$status: Status}>`
  padding: 0.1875rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${({theme, $status}) => theme.status[STATUS_TONE[$status]].fg};
  background: ${({theme, $status}) => theme.status[STATUS_TONE[$status]].bg};
`;
export const ScheduleContent = styled.p`
  margin: 0;
  color: ${({theme}) => theme.colors.textBody};
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
  color: ${({theme, $danger}) => ($danger ? theme.colors.danger : theme.colors.textMuted)};

  &:hover {
    color: ${({theme, $danger}) => ($danger ? theme.colors.dangerHover : theme.colors.accent)};
    background: ${({theme, $danger}) => ($danger ? theme.status.danger.bg : theme.colors.accentSubtle)};
  }

  svg {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;
