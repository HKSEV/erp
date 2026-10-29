"use client";

// 개인정보처리방침·사용자 매뉴얼 같은 문서형 페이지 공통 스타일
// 서버 컴포넌트(app/(info)/layout.tsx)에서 쓰기 때문에 "use client" 필요
import styled from "styled-components";
import Link from "next/link";

export const InfoWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({theme}) => theme.colors.bg};
`;
export const InfoTopBar = styled.header`
  display: flex;
  align-items: center;
  height: 4rem;
  padding: 0 1.5rem;
  background-color: ${({theme}) => theme.colors.dark};
  box-shadow: ${({theme}) => theme.shadow.header};
`;
export const InfoLogo = styled(Link)`
  color: ${({theme}) => theme.colors.onDark};
  font-size: 1.25rem;
  font-weight: ${({theme}) => theme.font.weight.bold};
  text-decoration: none;
`;
// 본문: 읽기 좋은 폭으로 가운데 정렬, 기본 태그(h1, h2, p, ul, table)에 문서 스타일 적용
export const InfoContent = styled.main`
  max-width: 760px;
  margin: 0 auto;
  padding: ${({theme}) => theme.space.xxl} ${({theme}) => theme.space.lg} 4rem;
  color: ${({theme}) => theme.colors.textBody};
  line-height: 1.7;

  h1 {
    margin: 0 0 ${({theme}) => theme.space.sm};
    font-size: ${({theme}) => theme.font.size.xxl};
    font-weight: ${({theme}) => theme.font.weight.medium};
    color: ${({theme}) => theme.colors.textStrong};
  }
  h2 {
    margin: ${({theme}) => theme.space.xxl} 0 ${({theme}) => theme.space.sm};
    font-size: ${({theme}) => theme.font.size.lg};
    font-weight: ${({theme}) => theme.font.weight.medium};
    color: ${({theme}) => theme.colors.textStrong};
  }
  p, li {
    font-size: ${({theme}) => theme.font.size.md};
  }
  // :where()로 우선순위를 낮춰서 InfoMeta처럼 여백을 직접 지정한 문단은 그 값을 유지
  :where(p) {
    margin-bottom: ${({theme}) => theme.space.lg};
  }
  ul, ol {
    margin: 0;
    padding-left: 1.25rem;
  }
  ul li { list-style: disc; }
  ol li { list-style: decimal; }
  a {
    color: ${({theme}) => theme.colors.accent};
    text-decoration: underline;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: ${({theme}) => theme.font.size.sm};
  }
  th, td {
    padding: ${({theme}) => theme.space.sm} ${({theme}) => theme.space.md};
    border: 1px solid ${({theme}) => theme.colors.border};
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: ${({theme}) => theme.colors.surfaceSubtle};
    color: ${({theme}) => theme.colors.textStrong};
    white-space: nowrap;
  }
`;
export const InfoMeta = styled.p`
  margin: 0 0 ${({theme}) => theme.space.xl};
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.font.size.sm};
`;
