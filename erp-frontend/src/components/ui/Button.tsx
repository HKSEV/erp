"use client";

import styled, { css } from "styled-components";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

// 업무 화면용 버튼 (기존 S.Button은 로그인·회원가입 화면에서 사용 중이라 별도로 둠)
// type 기본값을 "button"으로 해서 폼 안에서 실수로 제출되지 않게 함
export default function Button({variant = "primary", size = "md", type = "button", ...rest}: ButtonProps) {
  return <StyledButton type={type} $variant={variant} $size={size} {...rest}/>;
};

const StyledButton = styled.button<{$variant: ButtonVariant; $size: ButtonSize}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({theme}) => theme.space.xs};
  border-radius: ${({theme}) => theme.radius.md};
  font-weight: ${({theme}) => theme.font.weight.medium};
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  ${({theme, $size}) => $size === "sm"
    ? css`padding: 4px 10px; font-size: ${theme.font.size.xs};`
    : css`padding: 8px 16px; font-size: ${theme.font.size.md};`}

  ${({theme, $variant}) => {
    switch ($variant) {
      case "secondary":
        return css`
          background-color: ${theme.colors.surface};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.borderStrong};
          &:hover:not(:disabled) { background-color: ${theme.colors.surfaceSubtle}; }
        `;
      case "danger":
        return css`
          background-color: ${theme.colors.surface};
          color: ${theme.status.danger.fg};
          border: 1px solid ${theme.status.danger.bg};
          &:hover:not(:disabled) { background-color: ${theme.status.danger.bg}; }
        `;
      case "ghost":
        return css`
          background-color: transparent;
          color: ${theme.colors.textSecondary};
          border: 1px solid transparent;
          &:hover:not(:disabled) { background-color: ${theme.colors.surfaceSubtle}; }
        `;
      default:
        return css`
          background-color: ${theme.colors.accent};
          color: ${theme.colors.onAccent};
          border: 1px solid ${theme.colors.accent};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.accentHover};
            border-color: ${theme.colors.accentHover};
          }
        `;
    };
  }}

  &:focus-visible {
    outline: 2px solid ${({theme}) => theme.colors.accent};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
