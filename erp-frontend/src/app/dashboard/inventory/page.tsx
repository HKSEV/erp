"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "@/app/lib/api";
import type { InventoryItem } from "@/app/types/InventoryItem";
import useModal from "@/components/contexts/ModalContext";
import { PageContainer, PageHeader, StatGrid, StatCard, Card, SearchBar, DataTable, StatusBadge, Button } from "@/components/ui";
import type { Column, StatusTone } from "@/components/ui";

export default function Inventory() {
  const {openInventoryItemModal} = useModal();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const deletedItemIdsRef = useRef(new Set<string>());

  // 화면이 처음 열릴 때 품목 목록 조회
  // 응답 전에 화면을 벗어나면(abort) 상태를 바꾸지 않음
  useEffect(() => {
    const controller = new AbortController();

    api.get<InventoryItem[]>("/api/inventory/items", {
      signal: controller.signal
    }).then(({data}) => {
      if (controller.signal.aborted)
        return;

      // 최초 조회가 늦게 끝나도 방금 등록한 품목을 유지합니다.
      setItems((prev) => {
        const existingIds = new Set(
          prev.map((item) => item.id),
        );

        return [
          ...prev,
          ...data.filter((item) => (
            !existingIds.has(item.id) &&
            !deletedItemIdsRef.current.has(item.id)
          )),
        ];
      });
    }).catch((err: unknown) => {
      if (!controller.signal.aborted)
        console.error("품목 목록을 불러오는 중 오류 발생:", err);
    }).finally(() => {
      if (!controller.signal.aborted)
        setIsLoading(false);
    });

    return () => controller.abort();
  }, []);

  const handleItem = (item?: InventoryItem) => {
    openInventoryItemModal(
      item,
      (savedItem) => {
        setItems((prev) => [
          savedItem,
          ...prev.filter((item) => item.id !== savedItem.id)
        ]);
      },
      (savedItem) => {
        setItems((prev) => prev.map((item) =>
          item.id === savedItem.id ? savedItem : item,
        ));
      },
      (itemId) => {
        deletedItemIdsRef.current.add(itemId);
        setItems((prev) =>
          prev.filter((item) => item.id !== itemId),
        );
      },
    );
  };

  // 검색어: 품목 코드 또는 품목명에 포함되면 표시
  const [keyword, setKeyword] = useState("");
  const filteredItems = items.filter((item) =>
    item.id.toLowerCase().includes(keyword.toLowerCase()) || item.name.includes(keyword)
  );

  const STATUS: Record<InventoryItem["status"], {tone: StatusTone; text: string}> = {
    normal: {tone: "success", text: "정상"},
    low: {tone: "warning", text: "재고부족"},
    out: {tone: "danger", text: "품절"},
  };

  const columns: Column<InventoryItem>[] = [
    {key: "id", header: "품목 코드", variant: "code", width: "110px"},
    {key: "name", header: "품목명", variant: "primary"},
    {key: "category", header: "분류", width: "90px"},
    {key: "stock", header: "현재고", align: "right", width: "90px", render: (item) => item.stock.toLocaleString()},
    {key: "safetyStock", header: "적정재고", align: "right", width: "90px", render: (item) => item.safetyStock.toLocaleString()},
    {key: "unitPrice", header: "단가 (원)", align: "right", width: "110px", render: (item) => item.unitPrice.toLocaleString()},
    {key: "status", header: "상태", align: "center", width: "120px", render: (item) => (
      <StatusBadge tone={STATUS[item.status].tone}>{STATUS[item.status].text}</StatusBadge>
    )},
    {key: "actions", header: "관리", align: "center", width: "110px", render: (item) => (
      <Button
      variant="secondary"
      size="sm"
      onClick={() => handleItem(item)}>
        상세보기
      </Button>
    )},
  ];

  return (
    <PageContainer>
      <PageHeader
      title="재고관리"
      description="품목별 현재고와 재고 상태를 확인하고 관리합니다."
      actions={
      <Button onClick={() => handleItem()}>+ 신규 품목 등록</Button>
      }/>

      <StatGrid>
        <StatCard label="총 등록 품목" value={items.length} unit="개" tone="accent"/>
        <StatCard label="재고 부족 / 품절" value={items.filter((item) => item.status !== "normal").length} unit="건" tone="danger"/>
        <StatCard
        label="총 재고 자산"
        value={`₩ ${items.reduce((acc, curr) => acc + (curr.stock * curr.unitPrice), 0).toLocaleString()}`}
        tone="success"/>
      </StatGrid>

      <Card
      title="현재고 현황"
      actions={<SearchBar label="품목 검색" placeholder="품목명·코드 검색" onSearch={setKeyword}/>}
      noPadding>
        <DataTable
        columns={columns}
        rows={filteredItems}
        rowKey={(item) => item.id}
        emptyText={
          isLoading ? "품목 목록을 불러오는 중입니다."
          : keyword ? `"${keyword}"에 해당하는 품목이 없습니다.`
          : "등록된 품목이 없습니다."
        }/>
      </Card>
    </PageContainer>
  );
};
