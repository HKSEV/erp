"use client";

import React, { useState } from "react";
import { PageContainer, PageHeader, StatGrid, StatCard, Card, SearchBar, DataTable, StatusBadge, Button } from "@/components/ui";
import type { Column, StatusTone } from "@/components/ui";
import type { Department, Position } from "@/app/types/Organization";

interface Employee {
  id: string;
  name: string;
  department: Department;
  position: Position;
  status: "active" | "leave" | "resigned";
  joinDate: string;
};

export default function Hr() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "EMP-001",
      name: "김철수",
      department: "개발팀",
      position: "부장",
      status: "active",
      joinDate: "2020-03-02"
    },
    {
      id: "EMP-002",
      name: "이영희",
      department: "인사팀",
      position: "과장",
      status: "active",
      joinDate: "2019-11-15"
    },
    {
      id: "EMP-003",
      name: "박민수",
      department: "영업팀",
      position: "사원",
      status: "leave",
      joinDate: "2022-07-01"
    },
    {
      id: "EMP-004",
      name: "정지원",
      department: "디자인팀",
      position: "대리",
      status: "active",
      joinDate: "2021-05-20"
    },
  ]);

  // 검색어: 사번, 이름, 부서에 포함되면 표시
  const [keyword, setKeyword] = useState("");
  const filteredEmployees = employees.filter((emp) =>
    [emp.id, emp.name, emp.department].some((field) => field.toLowerCase().includes(keyword.toLowerCase()))
  );

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
    {key: "actions", header: "관리", align: "center", width: "90px", render: () => (
      <Button variant="secondary" size="sm">수정</Button>
    )},
  ];

  return (
    <PageContainer>
      <PageHeader
      title="인사관리"
      description="임직원 정보와 재직 상태를 관리합니다."
      actions={<Button>+ 신규 직원 등록</Button>}/>

      <StatGrid>
        <StatCard label="총 임직원 수" value={employees.length} unit="명" tone="accent"/>
        <StatCard label="이번 달 신규 입사" value={0} unit="명"/>
        <StatCard label="현재 휴직자" value={employees.filter((emp) => emp.status === "leave").length} unit="명" tone="warning"/>
      </StatGrid>

      <Card
      title="임직원 목록"
      actions={<SearchBar label="임직원 검색" placeholder="사번·이름·부서 검색" onSearch={setKeyword}/>}
      noPadding>
        <DataTable
        columns={columns}
        rows={filteredEmployees}
        rowKey={(emp) => emp.id}
        emptyText={keyword ? `"${keyword}"에 해당하는 임직원이 없습니다.` : "등록된 임직원이 없습니다."}/>
      </Card>
    </PageContainer>
  );
};
