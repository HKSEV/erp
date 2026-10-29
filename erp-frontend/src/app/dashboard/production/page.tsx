"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import useModal from "@/components/contexts/ModalContext";
import { PageContainer, PageHeader, StatGrid, StatCard, Card, SearchBar, DataTable, StatusBadge, Button, ProgressBar } from "@/components/ui";
import type { Column, StatusTone } from "@/components/ui";

interface ProductionOrder {
  id: string;
  productName: string;
  quantity: number;
  status: "planning" | "progress" | "completed";
  progress: number;
  dueDate: string;
};

export default function Production() {
  const {openAlertModal} = useModal();
  const [orders, setOrders] = useState<ProductionOrder[]>([
    // {
    //   id: "PRD-2023-001",
    //   productName: "알루미늄 프레임 A형",
    //   quantity: 500,
    //   status: "progress",
    //   progress: 65,
    //   dueDate: "2023-11-20"
    // },
    // {
    //   id: "PRD-2023-002",
    //   productName: "공업용 모터 250W",
    //   quantity: 120,
    //   status: "planning",
    //   progress: 0,
    //   dueDate: "2023-11-25"
    // },
    // {
    //   id: "PRD-2023-003",
    //   productName: "제어용 메인보드 v2",
    //   quantity: 300,
    //   status: "completed",
    //   progress: 100,
    //   dueDate: "2023-11-15"
    // },
    // {
    //   id: "PRD-2023-004",
    //   productName: "스틸 하우징 케이스",
    //   quantity: 1000,
    //   status: "progress",
    //   progress: 30,
    //   dueDate: "2023-12-01"
    // },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/production/orders");
      if (response.status === 200)
        setOrders(response.data);
    } catch (err) {
      console.error("오더 목록을 불러오는 중 오류 발생: ", err);
    } finally {
      setIsLoading(false);
    };
  };

  // 화면이 처음 열릴 때 오더 목록 조회
  // 응답 전에 화면을 벗어나면(ignore) 상태를 바꾸지 않음
  useEffect(() => {
    let ignore = false;
    axios.get("/api/production/orders")
      .then((response) => {
        if (!ignore && response.status === 200)
          setOrders(response.data);
      })
      .catch((err) => console.error("오더 목록을 불러오는 중 오류 발생: ", err))
      .finally(() => {
        if (!ignore)
          setIsLoading(false);
      });
    return () => { ignore = true; };
  }, []);

  const getStatusBadge = (status: ProductionOrder["status"]): {tone: StatusTone; text: string} => {
    switch (status) {
      case "progress":
        return {tone: "info", text: "생산중"};
      case "completed":
        return {tone: "success", text: "생산완료"};
      case "planning":
      default:
        return {tone: "neutral", text: "생산대기"};
    };
  };

  const handleAddOrder = async () => {
    // 일단 테스트용 임시 데이터를 만듭니다 (나중에는 입력 폼 데이터로 교체)
    const newOrderData = {
      id: `PRD-2023-999`, // 테스트용 임시 ID
      productName: "테스트 신규 모터",
      quantity: 100,
      status: "planning",
      progress: 0,
      dueDate: "2023-12-31"
    };

    try {
      const response = await axios.post("/api/production/orders", newOrderData);
      if (response.status === 200) {
        openAlertModal("신규 오더가 성공적으로 DB에 저장되었습니다!");
        fetchData();
      };
    } catch (err) {
      console.error("등록 중 오류 발생: ", err);
      openAlertModal("등록에 실패했습니다.");
    };
  };

  // 검색어: 오더 번호 또는 제품명에 포함되면 표시
  const [keyword, setKeyword] = useState("");
  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(keyword.toLowerCase()) || order.productName.includes(keyword)
  );

  const columns: Column<ProductionOrder>[] = [
    {key: "id", header: "오더 번호", render: (order) => <strong>{order.id}</strong>},
    {key: "productName", header: "제품명"},
    {key: "quantity", header: "수량", align: "right", render: (order) => `${order.quantity.toLocaleString()} 개`},
    {key: "status", header: "상태", align: "center", render: (order) => {
      const badge = getStatusBadge(order.status);
      return <StatusBadge tone={badge.tone}>{badge.text}</StatusBadge>;
    }},
    {key: "progress", header: "진행률", width: "25%", render: (order) => (
      <ProgressBar
      value={order.progress}
      tone={order.status === "completed" ? "success" : "accent"}
      label={`${order.id} 진행률`}/>
    )},
    {key: "dueDate", header: "납기일", align: "center"},
    {key: "actions", header: "관리", align: "center", render: () => (
      <Button variant="secondary" size="sm">상세보기</Button>
    )},
  ];

  return (
    <PageContainer>
      <PageHeader
      title="생산관리"
      description="생산 오더의 진행 상태와 납기를 관리합니다."
      actions={<Button onClick={handleAddOrder}>+ 신규 오더 등록</Button>}/>

      <StatGrid>
        <StatCard label="진행중인 오더" value={2} unit="건" tone="accent"/>
        <StatCard label="생산 대기" value={1} unit="건"/>
        <StatCard label="이번 달 완료" value={1} unit="건" tone="success"/>
      </StatGrid>

      <Card
      title="생산 오더 목록"
      actions={<SearchBar label="생산 오더 검색" placeholder="오더 번호 또는 제품명 검색" onSearch={setKeyword}/>}
      noPadding>
        <DataTable
        columns={columns}
        rows={filteredOrders}
        rowKey={(order) => order.id}
        emptyText={
          isLoading ? "오더 목록을 불러오는 중입니다."
          : keyword ? `"${keyword}"에 해당하는 오더가 없습니다.`
          : "등록된 생산 오더가 없습니다."
        }/>
      </Card>
    </PageContainer>
  );
};
