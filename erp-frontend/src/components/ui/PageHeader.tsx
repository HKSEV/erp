"use client";

import styled from "styled-components";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode; // 오른쪽 버튼 영역 (예: 등록 버튼)
};

// 페이지 제목 + 오른쪽 주요 버튼
export default function PageHeader({title, description, actions}: PageHeaderProps) {
  return (
    <Wrapper>
      <div>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
      </div>
      {actions && <Actions>{actions}</Actions>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({theme}) => theme.space.lg};
  margin-bottom: ${({theme}) => theme.space.xl};
  flex-wrap: wrap;
`;
const Title = styled.h1`
  margin: 0;
  font-size: ${({theme}) => theme.font.size.xxl};
  font-weight: ${({theme}) => theme.font.weight.bold};
  color: ${({theme}) => theme.colors.textStrong};
`;
const Description = styled.p`
  margin: ${({theme}) => theme.space.xs} 0 0;
  font-size: ${({theme}) => theme.font.size.md};
  color: ${({theme}) => theme.colors.textMuted};
`;
const Actions = styled.div`
  display: flex;
  gap: ${({theme}) => theme.space.sm};
`;
