"use client";

import React, { useState } from "react";
import { PageContainer, PageHeader, StatGrid, StatCard, Card, SearchBar, DataTable, StatusBadge, Button } from "@/components/ui";
import type { Column, StatusTone } from "@/components/ui";

interface InventoryItem {
  id:string;
  name: string;
  category: string;
  stock: number;
  unitPrice: number;
  status: "normal" | "low" | "out";
};

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "INV-1001",
      name: "알루미늄 프레임 A형",
      category: "원자재",
      stock: 1250,
      unitPrice: 15000,
      status: "normal"
    },
    {
      id: "INV-1002",
      name: "공업용 모터 250W",
      category: "부품",
      stock: 12,
      unitPrice: 85000,
      status: "low"
    },
    {
      id: "INV-1003",
      name: "제어용 메인보드 v2",
      category: "부품",
      stock: 0,
      unitPrice: 120000,
      status: "out"
    },
    {
      id: "INV-1004",
      name: "포장용 종이박스 (대)",
      category: "포장재",
      stock: 5000,
      unitPrice: 800,
      status: "normal"
    },
    {
      id: "INV-1005",
      name: "스틸 볼트 M8",
      category: "소모품",
      stock: 45,
      unitPrice: 150,
      status: "low"
    },
  ]);

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
    {key: "unitPrice", header: "단가 (원)", align: "right", width: "110px", render: (item) => item.unitPrice.toLocaleString()},
    {key: "status", header: "상태", align: "center", width: "120px", render: (item) => (
      <StatusBadge tone={STATUS[item.status].tone}>{STATUS[item.status].text}</StatusBadge>
    )},
    {key: "actions", header: "관리", align: "center", width: "150px", render: () => (
      <>
        <Button variant="secondary" size="sm">수정</Button>{" "}
        <Button variant="danger" size="sm">삭제</Button>
      </>
    )},
  ];

  return (
    <PageContainer>
      <PageHeader
      title="재고관리"
      description="품목별 현재고와 재고 상태를 확인하고 관리합니다."
      actions={<Button>+ 신규 품목 등록</Button>}/>

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
      actions={<SearchBar label="품목 검색" placeholder="품목명 또는 코드 검색" onSearch={setKeyword}/>}
      noPadding>
        <DataTable
        columns={columns}
        rows={filteredItems}
        rowKey={(item) => item.id}
        emptyText={keyword ? `"${keyword}"에 해당하는 품목이 없습니다.` : "등록된 품목이 없습니다."}/>
      </Card>
    </PageContainer>
  );
};
