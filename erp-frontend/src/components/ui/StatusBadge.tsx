"use client";

import styled from "styled-components";
import type { AppTheme } from "@/assets/css/Theme";

export type StatusTone = keyof AppTheme["status"]; // success | warning | danger | info | neutral

interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
};

// 상태 표시: 색과 글자를 함께 표시 (정상·부족·품절, 재직·휴직·퇴사 등)
export default function StatusBadge({tone, children}: StatusBadgeProps) {
  return <Badge $tone={tone}>{children}</Badge>;
};

const Badge = styled.span<{$tone: StatusTone}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: ${({theme}) => theme.radius.pill};
  font-size: ${({theme}) => theme.font.size.xs};
  font-weight: ${({theme}) => theme.font.weight.medium};
  white-space: nowrap;
  color: ${({theme, $tone}) => theme.status[$tone].fg};
  background-color: ${({theme, $tone}) => theme.status[$tone].bg};

  // 색을 구분하기 어려운 사용자도 알아볼 수 있도록 점 표시
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
  }
`;
