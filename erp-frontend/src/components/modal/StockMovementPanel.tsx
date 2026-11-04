"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import api from "@/app/lib/api";
import type { InventoryItem } from "@/app/types/InventoryItem";
import { STOCK_MOVEMENT_LABEL } from "@/app/types/StockMovement";
import type { StockMovement, StockMovementResult } from "@/app/types/StockMovement";
import { Button, Select, TextField } from "@/components/ui";
import * as S from "@/assets/css/Style.styles";

interface StockMovementPanelProps {
  itemId: string;
  disabled?: boolean;   // 품목 저장·삭제 중에는 입출고도 막음
  onChanged: (item: InventoryItem) => void;
  onError: (title: string, message: string, error: unknown) => void;
}

const MAX_QUANTITY = 2147483647;

// 품목 상세보기 안의 입고·출고 등록과 이력 (현재고는 여기서만 바뀜)
export default function StockMovementPanel({
  itemId,
  disabled = false,
  onChanged,
  onError,
}: StockMovementPanelProps) {
  const id = useId();
  const mountedRef = useRef(false);
  const pendingRef = useRef(false);

  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState({type: "IN", quantity: "", memo: ""});
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 상세보기를 열 때 이력 조회
  useEffect(() => {
    const controller = new AbortController();

    api.get<StockMovement[]>(
      "/api/inventory/items/" + encodeURIComponent(itemId) + "/movements",
      {signal: controller.signal},
    ).then(({data}) => {
      if (!controller.signal.aborted)
        setMovements(data);
    }).catch((err: unknown) => {
      if (controller.signal.aborted)
        return;
      console.error("입출고 이력을 불러오는 중 오류 발생:", err);
      setLoadError(true);
    }).finally(() => {
      if (!controller.signal.aborted)
        setIsLoading(false);
    });

    return () => controller.abort();
  }, [itemId]);

  const register = async () => {
    if (pendingRef.current || disabled)
      return;

    const quantity = Number(form.quantity);
    const verb = form.type === "IN" ? "입고" : "출고";

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      onError(
        "입력 내용을 확인해 주세요.",
        "수량은 1~2,147,483,647 사이의 정수로 입력해 주세요.",
        null,
      );
      return;
    }

    if (form.memo.trim().length > 200) {
      onError(
        "입력 내용을 확인해 주세요.",
        "메모는 200자 이내로 입력해 주세요.",
        null,
      );
      return;
    }

    pendingRef.current = true;
    setIsPending(true);

    try {
      const {data} = await api.post<StockMovementResult>(
        "/api/inventory/items/" + encodeURIComponent(itemId) + "/movements",
        {type: form.type, quantity, memo: form.memo.trim() || null},
      );

      if (!mountedRef.current)
        return;

      setMovements((prev) => [data.movement, ...prev]);
      setForm((prev) => ({...prev, quantity: "", memo: ""}));
      onChanged(data.item);
    } catch (err: unknown) {
      if (mountedRef.current)
        onError(verb + " 등록에 실패했습니다.", "", err);
    } finally {
      pendingRef.current = false;
      if (mountedRef.current)
        setIsPending(false);
    }
  };

  // 품목 저장 폼 안에 있으므로 Enter는 품목 저장 대신 입출고 등록으로 처리
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing)
      return;
    e.preventDefault();
    void register();
  };

  const isDisabled = disabled || isPending;

  return (
    <Panel aria-labelledby={id + "-title"}>
      <PanelTitle id={id + "-title"}>입출고</PanelTitle>

      <MovementForm>
        <S.ModalField>
          <S.ModalLabel htmlFor={id + "-type"}>구분</S.ModalLabel>
          <Select
          id={id + "-type"}
          value={form.type}
          disabled={isDisabled}
          onChange={(e) => setForm((prev) => ({...prev, type: e.target.value}))}
          options={[
            {value: "IN", label: "입고 (+)"},
            {value: "OUT", label: "출고 (-)"},
          ]}/>
        </S.ModalField>

        <TextField
        id={id + "-quantity"}
        label="수량"
        type="number"
        min={1}
        max={MAX_QUANTITY}
        step={1}
        value={form.quantity}
        disabled={isDisabled}
        onKeyDown={handleEnter}
        onChange={(e) => setForm((prev) => ({...prev, quantity: e.target.value}))}/>

        <MemoField>
          <TextField
          id={id + "-memo"}
          label="메모 (선택)"
          placeholder="예: 거래처 입고, 불량 폐기"
          maxLength={200}
          value={form.memo}
          disabled={isDisabled}
          onKeyDown={handleEnter}
          onChange={(e) => setForm((prev) => ({...prev, memo: e.target.value}))}/>
        </MemoField>

        <Button
        variant="secondary"
        disabled={isDisabled}
        onClick={() => void register()}>
          {isPending ? "등록 중..." : (form.type === "IN" ? "입고" : "출고") + " 등록"}
        </Button>
      </MovementForm>

      <HistoryTitle>최근 이력</HistoryTitle>
      {isLoading ? (
        <Empty role="status">이력을 불러오는 중입니다.</Empty>
      ) : loadError ? (
        <Empty role="alert">이력을 불러오지 못했습니다.</Empty>
      ) : movements.length === 0 ? (
        <Empty>입출고 이력이 없습니다.</Empty>
      ) : (
        <HistoryScroll>
          <HistoryTable>
            <thead>
              <tr>
                <th scope="col">일시</th>
                <th scope="col">구분</th>
                <th scope="col">수량</th>
                <th scope="col">처리 후</th>
                <th scope="col">처리자</th>
                <th scope="col">내용</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id}>
                  <td>{m.createdAt.slice(5, 16)}</td>
                  <td>{STOCK_MOVEMENT_LABEL[m.type]}</td>
                  <Quantity $decrease={m.type === "OUT"}>
                    {(m.type === "OUT" ? "-" : "+") + m.quantity.toLocaleString()}
                  </Quantity>
                  <td>{m.stockAfter.toLocaleString()}</td>
                  <td>{m.memberName ?? "-"}</td>
                  <td>{[m.orderId, m.memo].filter(Boolean).join(" · ") || "-"}</td>
                </tr>
              ))}
            </tbody>
          </HistoryTable>
        </HistoryScroll>
      )}
    </Panel>
  );
}

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.space.md};
  padding-top: ${({theme}) => theme.space.lg};
  border-top: 1px solid ${({theme}) => theme.colors.border};
`;
const PanelTitle = styled.h3`
  margin: 0;
  color: ${({theme}) => theme.colors.textStrong};
  font-size: ${({theme}) => theme.font.size.lg};
  font-weight: ${({theme}) => theme.font.weight.bold};
`;
const MovementForm = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({theme}) => theme.space.md};
  align-items: end;

  > button {
    grid-column: 1 / -1;
  }
`;
const MemoField = styled.div`
  grid-column: 1 / -1;
`;
const HistoryTitle = styled.h4`
  margin: 0;
  color: ${({theme}) => theme.colors.textSecondary};
  font-size: ${({theme}) => theme.font.size.md};
  font-weight: ${({theme}) => theme.font.weight.medium};
`;
const Empty = styled.p`
  margin: 0;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.font.size.sm};
`;
const HistoryScroll = styled.div`
  max-height: 240px;
  overflow: auto;
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.radius.md};
`;
const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({theme}) => theme.font.size.xs};
  white-space: nowrap;

  th, td {
    padding: ${({theme}) => theme.space.xs} ${({theme}) => theme.space.sm};
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
    text-align: left;
  }
  th {
    position: sticky;
    top: 0;
    background-color: ${({theme}) => theme.colors.surfaceSubtle};
    color: ${({theme}) => theme.colors.textMuted};
    font-weight: ${({theme}) => theme.font.weight.medium};
  }
  td {
    color: ${({theme}) => theme.colors.textBody};
  }
  tbody tr:last-child td {
    border-bottom: 0;
  }
`;
const Quantity = styled.td<{$decrease: boolean}>`
  && {
    color: ${({theme, $decrease}) => $decrease ? theme.status.danger.fg : theme.status.success.fg};
    font-weight: ${({theme}) => theme.font.weight.medium};
  }
`;
