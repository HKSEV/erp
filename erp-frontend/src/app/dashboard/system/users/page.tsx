"use client";

import { useState } from "react";
import { PageContainer, PageHeader, StatGrid, StatCard, Card, SearchBar, DataTable, StatusBadge, Button, Select } from "@/components/ui";
import type { Column } from "@/components/ui";
import useModal from "@/components/contexts/ModalContext";
import { ROLE_LABEL } from "@/app/types/Member";
import type { MemberAccount, UserRole } from "@/app/types/Member";

// 시스템관리 > 사용자 권한 관리
// 백엔드 API(/api/admin/members) 준비 전까지 샘플 데이터로 동작
const ROLE_OPTIONS = (Object.keys(ROLE_LABEL) as UserRole[]).map((role) => ({value: role, label: ROLE_LABEL[role]}));

// 로그인 정보에 사용자 id가 담기기 전까지 임시로 지정한 "내 계정"
const CURRENT_USER_ID = 1;

export default function Users() {
  const {openAlertModal} = useModal();
  const [members, setMembers] = useState<MemberAccount[]>([
    {id: 1, name: "박민수", email: "park@erp.com", department: "영업팀", position: "사원", role: "ADMIN", active: true, createdAt: "2026-10-08"},
    {id: 2, name: "정지원", email: "jung@erp.com", department: "디자인팀", position: "대리", role: "USER", active: false, createdAt: "2026-10-12"},
    {id: 3, name: "최유리", email: "choi@erp.com", department: "자재팀", position: "과장", role: "MANAGER", active: true, createdAt: "2026-10-20"},
  ]);

  // 검색어: 이름, 이메일, 부서에 포함되면 표시
  const [keyword, setKeyword] = useState("");
  const filteredMembers = members.filter((m) =>
    [m.name, m.email, m.department].some((field) => field.toLowerCase().includes(keyword.toLowerCase()))
  );

  const adminCount = members.filter((m) => m.role === "ADMIN" && m.active).length;
  const update = (id: number, changes: Partial<MemberAccount>) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? {...m, ...changes} : m)));

  // 마지막 관리자가 권한을 잃으면 아무도 이 화면에 들어올 수 없으므로 막음
  const isLastAdmin = (member: MemberAccount) => member.role === "ADMIN" && member.active && adminCount === 1;

  const changeRole = (member: MemberAccount, role: UserRole) => {
    if (isLastAdmin(member) && role !== "ADMIN") {
      openAlertModal("역할을 변경할 수 없습니다.", undefined, {
        variant: "error",
        description: "관리자는 최소 1명 있어야 합니다.",
      });
      return;
    }
    openAlertModal(
      `${member.name}님의 역할을 변경할까요?`,
      () => update(member.id, {role}),
      {
        variant: "confirm",
        description: `${ROLE_LABEL[member.role]} → ${ROLE_LABEL[role]}`,
        confirmText: "변경",
        cancelText: "취소",
      },
    );
  };

  const toggleActive = (member: MemberAccount) => {
    if (member.active && isLastAdmin(member)) {
      openAlertModal("계정을 정지할 수 없습니다.", undefined, {
        variant: "error",
        description: "관리자는 최소 1명 있어야 합니다.",
      });
      return;
    }
    openAlertModal(
      member.active ? `${member.name}님의 계정을 정지할까요?` : `${member.name}님의 계정 정지를 해제할까요?`,
      () => update(member.id, {active: !member.active}),
      {
        variant: "confirm",
        description: member.active ? "정지된 계정은 로그인할 수 없습니다." : "다시 로그인할 수 있게 됩니다.",
        confirmText: member.active ? "정지" : "해제",
        cancelText: "취소",
      },
    );
  };

  const columns: Column<MemberAccount>[] = [
    {key: "name", header: "이름", variant: "primary", width: "120px", render: (m) => (
      m.id === CURRENT_USER_ID ? `${m.name} (나)` : m.name
    )},
    {key: "email", header: "이메일"},
    {key: "department", header: "부서", width: "100px"},
    {key: "position", header: "직급", width: "80px"},
    {key: "role", header: "역할", align: "center", width: "120px", render: (m) => (
      // 자기 자신의 역할은 바꿀 수 없음
      <Select
      size="sm"
      aria-label={`${m.name} 역할`}
      options={ROLE_OPTIONS}
      value={m.role}
      disabled={m.id === CURRENT_USER_ID}
      onChange={(e) => changeRole(m, e.target.value as UserRole)}/>
    )},
    {key: "active", header: "상태", align: "center", width: "120px", render: (m) => (
      <StatusBadge tone={m.active ? "success" : "danger"}>{m.active ? "사용 중" : "정지"}</StatusBadge>
    )},
    {key: "createdAt", header: "가입일", align: "center", width: "120px"},
    {key: "actions", header: "관리", align: "center", width: "100px", render: (m) => (
      <Button
      size="sm"
      variant={m.active ? "danger" : "secondary"}
      disabled={m.id === CURRENT_USER_ID}
      onClick={() => toggleActive(m)}>
        {m.active ? "정지" : "해제"}
      </Button>
    )},
  ];

  return (
    <PageContainer>
      <PageHeader
      title="사용자 권한 관리"
      description="회원의 역할을 지정하고 계정 사용 여부를 관리합니다."/>

      <StatGrid>
        <StatCard label="전체 사용자" value={members.length} unit="명" tone="accent"/>
        <StatCard label="관리자" value={adminCount} unit="명"/>
        <StatCard label="정지된 계정" value={members.filter((m) => !m.active).length} unit="명" tone="danger"/>
      </StatGrid>

      <Card
      title="사용자 목록"
      actions={<SearchBar label="사용자 검색" placeholder="이름·이메일·부서 검색" onSearch={setKeyword}/>}
      noPadding>
        <DataTable
        columns={columns}
        rows={filteredMembers}
        rowKey={(m) => String(m.id)}
        emptyText={keyword ? `"${keyword}"에 해당하는 사용자가 없습니다.` : "등록된 사용자가 없습니다."}/>
      </Card>
    </PageContainer>
  );
};
