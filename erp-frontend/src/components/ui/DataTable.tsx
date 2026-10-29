"use client";

import styled from "styled-components";

export interface Column<T> {
  key: string;                          // 행 데이터의 필드 이름 (render가 없으면 이 값을 표시)
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode; // 셀 내용을 직접 그릴 때 (배지, 버튼 등)
  align?: "left" | "center" | "right";  // 숫자는 right
  width?: string;
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
  return (
    <ScrollArea>
      <Table>
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
const Table = styled.table`
  width: 100%;
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
  // 셀 안에서 줄바꿈하지 않고, 표가 넓으면 ScrollArea가 가로 스크롤
  white-space: nowrap;
`;
const EmptyCell = styled.td`
  padding: ${({theme}) => theme.space.xxl};
  text-align: center;
  color: ${({theme}) => theme.colors.textMuted};
`;
