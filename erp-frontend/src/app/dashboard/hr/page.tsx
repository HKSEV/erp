"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "@/app/lib/api";
import useCurrentMember from "@/app/lib/currentMember";
import type { Employee } from "@/app/types/Employee";
import useModal from "@/components/contexts/ModalContext";
import { PageContainer, PageHeader, StatGrid, StatCard, Card, SearchBar, DataTable, StatusBadge, Button } from "@/components/ui";
import type { Column, StatusTone } from "@/components/ui";

export default function Hr() {
  const {openEmployeeModal} = useModal();
  const {canManageWork} = useCurrentMember();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const deletedEmployeeIdsRef = useRef(new Set<string>());

  // 화면이 처음 열릴 때 직원 목록 조회
  // 응답 전에 화면을 벗어나면(abort) 상태를 바꾸지 않음
  useEffect(() => {
    const controller = new AbortController();

    api.get<Employee[]>("/api/hr/employees", {
      signal: controller.signal
    }).then(({data}) => {
      if (controller.signal.aborted)
        return;

      // 최초 조회가 늦게 끝나도 방금 등록한 직원을 유지합니다.
      setEmployees((prev) => {
        const existingIds = new Set(
          prev.map((emp) => emp.id),
        );

        return [
          ...prev,
          ...data.filter((emp) => (
            !existingIds.has(emp.id) &&
            !deletedEmployeeIdsRef.current.has(emp.id)
          )),
        ];
      });
    }).catch((err: unknown) => {
      if (!controller.signal.aborted)
        console.error("직원 목록을 불러오는 중 오류 발생:", err);
    }).finally(() => {
      if (!controller.signal.aborted)
        setIsLoading(false);
    });

    return () => controller.abort();
  }, []);

  const handleEmployee = (employee?: Employee) => {
    if (!canManageWork)
      return;

    openEmployeeModal(
      employee,
      (savedEmployee) => {
        setEmployees((prev) => [
          savedEmployee,
          ...prev.filter((emp) => emp.id !== savedEmployee.id)
        ]);
      },
      (savedEmployee) => {
        setEmployees((prev) => prev.map((emp) =>
          emp.id === savedEmployee.id ? savedEmployee : emp,
        ));
      },
      (employeeId) => {
        deletedEmployeeIdsRef.current.add(employeeId);
        setEmployees((prev) =>
          prev.filter((emp) => emp.id !== employeeId),
        );
      },
    );
  };

  // 검색어: 사번, 이름, 부서에 포함되면 표시
  const [keyword, setKeyword] = useState("");
  const filteredEmployees = employees.filter((emp) =>
    [emp.id, emp.name, emp.department].some((field) => field.toLowerCase().includes(keyword.toLowerCase()))
  );

  // 이번 달 신규 입사: 입사일(YYYY-MM-DD)이 이번 달(YYYY-MM)로 시작
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const STATUS: Record<Employee["status"], {tone: StatusTone; text: string}> = {
    active: {tone: "success", text: "재직중"},
    leave: {tone: "warning", text: "휴직"},
    resigned: {tone: "danger", text: "퇴사"},
  };

  const columns: Column<Employee>[] = [
    {key: "id", header: "사번", variant: "code", width: "100px"},
    // 긴 글자 열이 없어 모두 고정 너비로 두고, 남는 공간은 열마다 비율대로 나눔
    {key: "name", header: "이름", variant: "primary", width: "120px"},
    {key: "department", header: "부서", width: "110px"},
    {key: "position", header: "직급", width: "90px"},
    {key: "status", header: "상태", align: "center", width: "110px", render: (emp) => (
      <StatusBadge tone={STATUS[emp.status].tone}>{STATUS[emp.status].text}</StatusBadge>
    )},
    {key: "joinDate", header: "입사일", align: "center", width: "120px"},
    {key: "actions", header: "관리", align: "center", width: "110px", render: (emp) => (
      <Button
      variant="secondary"
      size="sm"
      onClick={() => handleEmployee(emp)}>
        상세보기
      </Button>
    )},
  ];

  return (
    <PageContainer>
      <PageHeader
      title="인사관리"
      description="임직원 정보와 재직 상태를 관리합니다."
      actions={canManageWork && (
        <Button onClick={() => handleEmployee()}>+ 신규 직원 등록</Button>
      )}/>

      <StatGrid>
        <StatCard label="총 임직원 수" value={employees.filter((emp) => emp.status !== "resigned").length} unit="명" tone="accent"/>
        <StatCard label="이번 달 신규 입사" value={employees.filter((emp) => emp.joinDate.startsWith(thisMonth)).length} unit="명"/>
        <StatCard label="현재 휴직자" value={employees.filter((emp) => emp.status === "leave").length} unit="명" tone="warning"/>
      </StatGrid>

      <Card
      title="임직원 목록"
      actions={<SearchBar label="임직원 검색" placeholder="사번·이름·부서 검색" onSearch={setKeyword}/>}
      noPadding>
        <DataTable
        columns={
          canManageWork
            ? columns
            : columns.filter((column) => column.key !== "actions")
        }
        rows={filteredEmployees}
        rowKey={(emp) => emp.id}
        emptyText={
          isLoading ? "직원 목록을 불러오는 중입니다."
          : keyword ? `"${keyword}"에 해당하는 임직원이 없습니다.`
          : "등록된 임직원이 없습니다."
        }/>
      </Card>
    </PageContainer>
  );
};
