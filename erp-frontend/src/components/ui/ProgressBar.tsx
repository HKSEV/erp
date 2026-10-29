"use client";

import styled from "styled-components";
import type { StatusTone } from "./StatusBadge";

interface ProgressBarProps {
  value: number;        // 0 ~ 100
  tone?: StatusTone | "accent";
  label?: string;       // 스크린리더용 이름 (예: "PRD-001 진행률")
};

// 진행률 막대 + 퍼센트 (생산 오더 진행률 등)
export default function ProgressBar({value, tone = "accent", label = "진행률"}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <Wrapper>
      <Percent>{percent}%</Percent>
      <Track role="progressbar" aria-label={label} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <Fill $percent={percent} $tone={tone}/>
      </Track>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.space.sm};
`;
const Percent = styled.span`
  min-width: 2.5rem;
  font-size: ${({theme}) => theme.font.size.xs};
  font-variant-numeric: tabular-nums;
  color: ${({theme}) => theme.colors.textMuted};
`;
const Track = styled.div`
  flex: 1;
  min-width: 80px; // 표 안에서 너무 좁아지지 않도록
  height: 8px;
  background-color: ${({theme}) => theme.colors.surfaceSubtle};
  border-radius: ${({theme}) => theme.radius.pill};
  overflow: hidden;
`;
const Fill = styled.div<{$percent: number; $tone: StatusTone | "accent"}>`
  width: ${({$percent}) => $percent}%;
  height: 100%;
  border-radius: inherit;
  background-color: ${({theme, $tone}) => ($tone === "accent" ? theme.colors.accent : theme.status[$tone].fg)};
  transition: width 0.3s ease;
`;
