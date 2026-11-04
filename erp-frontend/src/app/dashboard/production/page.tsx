"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "@/app/lib/api";
import useCurrentMember from "@/app/lib/currentMember";
import type { ProductionOrder } from "@/app/types/ProductionOrder";
import useModal from "@/components/contexts/ModalContext";
import { PageContainer, PageHeader, StatGrid, StatCard, Card, SearchBar, DataTable, StatusBadge, Button, ProgressBar } from "@/components/ui";
import type { Column, StatusTone } from "@/components/ui";

export default function Production() {
  const {openProductionOrderModal} = useModal();
  const {canManageWork} = useCurrentMember();
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const deletedOrderIdsRef = useRef(new Set<string>());

  const currentYear = Number(new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).format(new Date()));

  // 상단 현황은 올해 등록한 오더의 현재 상태를 집계합니다.
  const yearOrders = orders.filter((order) =>
    order.createdAt?.startsWith(`${currentYear}-`)
  );

  const unknownDateCount = orders.filter(
    (order) => !order.createdAt
  ).length;

  const progressCount = yearOrders.filter((order) =>
    order.status === "progress"
  ).length;

  const planningCount = yearOrders.filter((order) =>
    order.status === "planning"
  ).length;

  const completedCount = yearOrders.filter((order) =>
    order.status === "completed"
  ).length;

  // 화면이 처음 열릴 때 오더 목록 조회
  // 응답 전에 화면을 벗어나면(ignore) 상태를 바꾸지 않음
  useEffect(() => {
    const controller = new AbortController();

    api.get<ProductionOrder[]>("/api/production/orders", {
      signal: controller.signal
    }).then(({data}) => {
      if (controller.signal.aborted)
        return;

      // 최초 조회가 늦게 끝나도 방금 등록한 오더를 유지합니다.
      setOrders((prev) => {
        const existingIds = new Set(
          prev.map((order) => order.id),
        );

        return [
          ...prev,
          ...data.filter((order) => (
            !existingIds.has(order.id) &&
            !deletedOrderIdsRef.current.has(order.id)
          )),
        ];
      });
    }).catch((err: unknown) => {
      if (!controller.signal.aborted)
        console.error("오더 목록을 불러오는 중 오류 발생:", err);
    }).finally(() => {
      if (!controller.signal.aborted)
        setIsLoading(false);
    });

    return () => controller.abort();
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

  const handleOrder = (order?: ProductionOrder) => {
    if (!canManageWork)
      return;

    openProductionOrderModal(
      order!,
      (savedOrder) => {
        setOrders((prev) => [
          savedOrder,
          ...prev.filter((order) => order.id !== savedOrder.id)
        ]);
      },
      (savedOrder) => {
        setOrders((prev) => prev.map((item) =>
          item.id === savedOrder.id ? savedOrder : item,
        ));
      },
      (orderId) => {
        deletedOrderIdsRef.current.add(orderId);
        setOrders((prev) =>
          prev.filter((item) => item.id !== orderId),
        );
      },
    );
  };

  // 검색어: 오더 번호 또는 제품명에 포함되면 표시
  const [keyword, setKeyword] = useState("");
  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(keyword.toLowerCase()) || order.productName.includes(keyword)
  );

  const columns: Column<ProductionOrder>[] = [
    {key: "id", header: "오더 번호", variant: "code", width: "140px"},
    {key: "productName", header: "제품명", variant: "primary"},
    {key: "quantity", header: "수량", align: "right", width: "90px", render: (order) => `${order.quantity.toLocaleString()} 개`},
    {key: "status", header: "상태", align: "center", width: "110px", render: (order) => {
      const badge = getStatusBadge(order.status);
      return <StatusBadge tone={badge.tone}>{badge.text}</StatusBadge>;
    }},
    {key: "progress", header: "진행률", width: "200px", render: (order) => (
      <ProgressBar
      value={order.progress}
      tone={order.status === "completed" ? "success" : "accent"}
      label={`${order.id} 진행률`}/>
    )},
    {key: "dueDate", header: "납기일", align: "center", width: "120px"},
    {
      key: "completedAt",
      header: "완료일",
      align: "center",
      width: "120px",
      render: (order) => (
        order.completedAt ? (
          <time
          dateTime={order.completedAt}
          title={
            order.completedAt.replace("T", " ").slice(0, 19)
            + " (한국 시간)"
          }>
            {order.completedAt.slice(0, 10)}
          </time>
        ) : ""
      ),
    },
    {key: "actions", header: "관리", align: "center", width: "110px", render: (order) => (
      <Button
      variant="secondary"
      size="sm"
      onClick={() => handleOrder(order)}>
        상세보기
      </Button>
    )},
  ];

  return (
    <PageContainer>
      <PageHeader
      title="생산관리"
      description={
        `생산 오더의 진행 상태와 납기를 관리합니다. 현황은 ${currentYear}년 등록 오더 기준입니다.`
        + (
          unknownDateCount
            ? ` 등록일 미확인 ${unknownDateCount}건은 연간 집계에서 제외됩니다.`
            : ""
        )
      }
      actions={canManageWork && (
        <Button onClick={() => handleOrder()}>+ 신규 오더 등록</Button>
      )}/>

      <StatGrid>
        <StatCard
        label={`${currentYear}년 진행중인 오더`}
        value={progressCount}
        unit="건"
        tone="accent"/>

        <StatCard
        label={`${currentYear}년 생산 대기`}
        value={planningCount}
        unit="건"/>

        <StatCard
        label={`${currentYear}년 생산완료`}
        value={completedCount}
        unit="건"
        tone="success"/>
      </StatGrid>

      <Card
      title="생산 오더 목록"
      actions={<SearchBar label="생산 오더 검색" placeholder="오더 번호·제품명 검색" onSearch={setKeyword}/>}
      noPadding>
        <DataTable
        columns={
          canManageWork
            ? columns
            : columns.filter((column) => column.key !== "actions")
        }
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
