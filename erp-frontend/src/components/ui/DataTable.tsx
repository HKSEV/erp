"use client";

import styled from "styled-components";

export interface Column<T> {
  key: string;                          // 행 데이터의 필드 이름 (render가 없으면 이 값을 표시)
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode; // 셀 내용을 직접 그릴 때 (배지, 버튼 등)
  align?: "left" | "center" | "right";  // 숫자는 right
  width?: string;                       // 코드·숫자·배지·버튼 열은 "120px"처럼 고정, 이름 열은 비워서 남은 공간 사용
  // 셀 강조 규칙: code = 코드·번호(회색, 보통 굵기), primary = 행을 대표하는 이름(굵게)
  variant?: CellVariant;
};

export type CellVariant = "default" | "code" | "primary";

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  emptyText?: string;
};

// 데이터 표: 숫자 열은 align="right"로 오른쪽 정렬 + 자릿수 맞춤
export default function DataTable<T>({columns, rows, rowKey, emptyText = "데이터가 없습니다."}: DataTableProps<T>) {
  // 표 최소 너비 = 픽셀로 고정한 열의 합 + 너비를 정하지 않은 열마다 160px
  // 화면이 이보다 좁으면 내용이 잘리지 않고 표만 가로로 스크롤
  const minWidth = columns.reduce((sum, col) =>
    sum + (col.width?.endsWith("px") ? parseInt(col.width, 10) : 160), 0);

  return (
    <ScrollArea>
      <Table style={{minWidth}}>
        <thead>
          <tr>
            {columns.map((col) => (
              <Th key={col.key} scope="col" $align={col.align ?? "left"} style={{width: col.width}}>
                {col.header}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <EmptyCell colSpan={columns.length}>{emptyText}</EmptyCell>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <Td key={col.key} $align={col.align ?? "left"} $variant={col.variant ?? "default"}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </Td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
};

type Align = "left" | "center" | "right";

// 좁은 화면에서는 표만 가로로 스크롤
const ScrollArea = styled.div`
  width: 100%;
  overflow-x: auto;
`;
// table-layout: fixed → 열 너비를 머리글(width) 기준으로 고정해서,
// 검색으로 행이 줄거나 없어져도 레이아웃이 바뀌지 않음
// width를 지정하지 않은 열은 남은 공간을 나눠 가짐
const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: ${({theme}) => theme.font.size.sm};

  tbody tr { transition: background-color 0.15s ease; }
  tbody tr:hover { background-color: ${({theme}) => theme.colors.surfaceSubtle}; }
`;
const Th = styled.th<{$align: Align}>`
  padding: ${({theme}) => theme.space.md} ${({theme}) => theme.space.lg};
  text-align: ${({$align}) => $align};
  font-weight: ${({theme}) => theme.font.weight.medium};
  color: ${({theme}) => theme.colors.textMuted};
  background-color: ${({theme}) => theme.colors.surfaceSubtle};
  border-bottom: 1px solid ${({theme}) => theme.colors.border};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Td = styled.td<{$align: Align; $variant: CellVariant}>`
  height: 48px;
  padding: 0 ${({theme}) => theme.space.lg};
  text-align: ${({$align}) => $align};
  color: ${({theme, $variant}) =>
    $variant === "code" ? theme.colors.textMuted
    : $variant === "primary" ? theme.colors.textStrong
    : theme.colors.textBody};
  font-weight: ${({theme, $variant}) =>
    $variant === "primary" ? theme.font.weight.bold : theme.font.weight.regular};
  border-bottom: 1px solid ${({theme}) => theme.colors.border};
  // 숫자 열과 코드 열은 자릿수를 맞춰 세로로 비교하기 쉽게
  font-variant-numeric: ${({$align, $variant}) => ($align === "right" || $variant === "code" ? "tabular-nums" : "normal")};
  // 셀 안에서 줄바꿈하지 않고, 칸보다 긴 글자는 …로 줄임
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const EmptyCell = styled.td`
  padding: ${({theme}) => theme.space.xxl};
  text-align: center;
  color: ${({theme}) => theme.colors.textMuted};
`;
