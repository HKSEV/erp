"use client";

import styled from "styled-components";
import { FiChevronDown } from "react-icons/fi";

export interface SelectOption {
  value: string;
  label: string;
};

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  size?: "sm" | "md";  // sm: 표 안에서 사용
};

// 드롭다운 선택창 (브라우저 기본 화살표 대신 같은 모양의 아이콘 사용)
export default function Select({options, size = "md", ...rest}: SelectProps) {
  return (
    <Wrapper>
      <StyledSelect $size={size} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </StyledSelect>
      <Arrow aria-hidden="true"/>
    </Wrapper>
  );
};

const Wrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
`;
const StyledSelect = styled.select<{$size: "sm" | "md"}>`
  width: 100%;
  appearance: none;
  padding: ${({$size}) => ($size === "sm" ? "4px 28px 4px 10px" : "8px 32px 8px 12px")};
  font-size: ${({theme, $size}) => ($size === "sm" ? theme.font.size.sm : theme.font.size.md)};
  color: ${({theme}) => theme.colors.textBody};
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme}) => theme.colors.borderStrong};
  border-radius: ${({theme}) => theme.radius.md};
  cursor: pointer;

  &:hover:not(:disabled) { border-color: ${({theme}) => theme.colors.textDisabled}; }
  &:focus {
    outline: none;
    border-color: ${({theme}) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({theme}) => theme.colors.accentSubtle};
  }
  &:disabled {
    color: ${({theme}) => theme.colors.textDisabled};
    background-color: ${({theme}) => theme.colors.surfaceSubtle};
    cursor: not-allowed;
  }
`;
const Arrow = styled(FiChevronDown)`
  position: absolute;
  right: 8px;
  width: 14px;
  height: 14px;
  color: ${({theme}) => theme.colors.textMuted};
  pointer-events: none;
`;
