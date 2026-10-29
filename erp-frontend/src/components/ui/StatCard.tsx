"use client";

import styled from "styled-components";

export type StatTone = "default" | "accent" | "success" | "warning" | "danger";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;      // 숫자 뒤 단위 (예: 개, 건, 명)
  tone?: StatTone;    // 숫자 색
};

// 요약 카드: 라벨 + 큰 숫자 (라벨·단위가 숫자에 묻히지 않도록 크기 차이를 줄임)
export default function StatCard({label, value, unit, tone = "default"}: StatCardProps) {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Value $tone={tone}>
        {value}
        {unit && <Unit>{unit}</Unit>}
      </Value>
    </Wrapper>
  );
};

// 요약 카드 여러 개를 나란히 (좁은 화면에서는 한 줄에 하나)
export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({theme}) => theme.space.lg};
  margin-bottom: ${({theme}) => theme.space.xl};
`;

const Wrapper = styled.div`
  padding: ${({theme}) => theme.space.xl};
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.radius.xl};
  box-shadow: ${({theme}) => theme.shadow.card};
`;
const Label = styled.p`
  margin: 0 0 ${({theme}) => theme.space.sm};
  font-size: ${({theme}) => theme.font.size.lg};
  color: ${({theme}) => theme.colors.textSecondary};
`;
const Value = styled.p<{$tone: StatTone}>`
  margin: 0;
  font-size: ${({theme}) => theme.font.size.xxxl};
  font-weight: ${({theme}) => theme.font.weight.bold};
  font-variant-numeric: tabular-nums;
  color: ${({theme, $tone}) => {
    switch ($tone) {
      case "accent": return theme.colors.accent;
      case "success": return theme.status.success.fg;
      case "warning": return theme.status.warning.fg;
      case "danger": return theme.status.danger.fg;
      default: return theme.colors.textStrong;
    };
  }};
`;
const Unit = styled.span`
  margin-left: ${({theme}) => theme.space.xs};
  font-size: ${({theme}) => theme.font.size.xl};
  font-weight: ${({theme}) => theme.font.weight.medium};
  color: ${({theme}) => theme.colors.textSecondary};
`;
