"use client";

import styled from "styled-components";

interface CardProps {
  title?: string;
  actions?: React.ReactNode; // 머리글 오른쪽 (예: 검색창)
  noPadding?: boolean;       // 표처럼 본문을 꽉 채울 때
  children: React.ReactNode;
};

// 흰 바탕 카드: 머리글(제목 + 오른쪽 영역)과 본문
export default function Card({title, actions, noPadding = false, children}: CardProps) {
  return (
    <Wrapper>
      {(title || actions) && (
        <Header>
          {title && <Title>{title}</Title>}
          {actions}
        </Header>
      )}
      <Body $noPadding={noPadding}>{children}</Body>
    </Wrapper>
  );
};

// 카드 여러 장을 세로로 쌓기 (폼 화면은 style={{maxWidth}}로 폭을 좁혀서 사용)
export const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.space.xl};
`;

const Wrapper = styled.section`
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.radius.xl};
  box-shadow: ${({theme}) => theme.shadow.card};
  overflow: hidden;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({theme}) => theme.space.md};
  // 검색창이 있든 없든 모든 카드 머리글 높이를 같게 맞춤 (검색창 포함 높이 66.5px 기준)
  min-height: 68px;
  padding: ${({theme}) => theme.space.lg} ${({theme}) => theme.space.xl};
  border-bottom: 1px solid ${({theme}) => theme.colors.border};
  flex-wrap: wrap;
  // 머리글 너비를 기준으로 안쪽 요소(검색창 등)가 크기를 정하도록
  container-type: inline-size;
`;
const Title = styled.h2`
  margin: 0;
  font-size: ${({theme}) => theme.font.size.lg};
  font-weight: ${({theme}) => theme.font.weight.bold};
  color: ${({theme}) => theme.colors.textStrong};
`;
const Body = styled.div<{$noPadding: boolean}>`
  padding: ${({theme, $noPadding}) => ($noPadding ? "0" : theme.space.xl)};
`;
