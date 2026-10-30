"use client";

import styled from "styled-components";

export interface DescriptionItem {
  label: string;
  value: React.ReactNode;
};

// 읽기 전용 정보: "라벨 / 값"을 두 줄씩 나란히 표시 (좁은 화면에서는 한 줄씩)
export default function DescriptionList({items}: {items: DescriptionItem[]}) {
  return (
    <List>
      {items.map((item) => (
        <Item key={item.label}>
          <Term>{item.label}</Term>
          <Detail>{item.value}</Detail>
        </Item>
      ))}
    </List>
  );
};

const List = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({theme}) => theme.space.lg} ${({theme}) => theme.space.xl};
  margin: 0;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.space.xs};
  min-width: 0;
`;
const Term = styled.dt`
  font-size: ${({theme}) => theme.font.size.sm};
  color: ${({theme}) => theme.colors.textMuted};
`;
const Detail = styled.dd`
  margin: 0;
  font-size: ${({theme}) => theme.font.size.md};
  color: ${({theme}) => theme.colors.textStrong};
  overflow-wrap: anywhere;
`;
