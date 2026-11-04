"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import api from "@/app/lib/api";
import useCurrentMember from "@/app/lib/currentMember";
import { PageContainer, PageHeader, StatGrid, StatCard, Card, SearchBar, DataTable, StatusBadge, Button, Select } from "@/components/ui";
import type { Column } from "@/components/ui";
import useModal from "@/components/contexts/ModalContext";
import { ROLE_LABEL } from "@/app/types/Member";
import type { MemberAccount, UserRole } from "@/app/types/Member";
import type { Employee } from "@/app/types/Employee";

// 시스템관리 > 사용자 권한 관리 (관리자 전용, /api/admin/members)
const ROLE_OPTIONS = (Object.keys(ROLE_LABEL) as UserRole[]).map((role) => ({value: role, label: ROLE_LABEL[role]}));

// 백엔드가 보낸 안내 문구(예: 관리자는 최소 1명), 없으면 공통 문구
function getApiError(error: unknown, fallback: string): string {
  if (isAxiosError<{message?: unknown}>(error)) {
    if (error.response?.status === 401)
      return "로그인 정보를 확인할 수 없습니다. 다시 로그인해 주세요.";

    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim())
      return message;
  };

  return fallback;
};

export default function Users() {
  const {openAlertModal} = useModal();
  const {member: me} = useCurrentMember();
  const [members, setMembers] = useState<MemberAccount[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [employeeLoadError, setEmployeeLoadError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);

  // 화면이 처음 열릴 때 사용자 목록 조회
  // 응답 전에 화면을 벗어나면(abort) 상태를 바꾸지 않음
  useEffect(() => {
    const controller = new AbortController();
    const options = {signal: controller.signal};

    api.get<MemberAccount[]>("/api/admin/members", options)
      .then(({data}) => {
        if (!controller.signal.aborted)
          setMembers(data);
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted)
          setLoadError(getApiError(err, "사용자 목록을 불러오지 못했습니다."));
      })
      .finally(() => {
        if (!controller.signal.aborted)
          setIsLoading(false);
      });

    api.get<Employee[]>("/api/hr/employees", options)
      .then(({data}) => {
        if (!controller.signal.aborted)
          setEmployees(data);
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted)
          setEmployeeLoadError(getApiError(err, "직원 목록을 불러오지 못했습니다."));
      })
      .finally(() => {
        if (!controller.signal.aborted)
          setIsEmployeeLoading(false);
      });

    return () => controller.abort();
  }, []);

  const linkedIds = new Set(members.map((member) => member.employeeId));
  const availableEmployees = employees.filter((employee) =>
    employee.status !== "resigned" && !linkedIds.has(employee.id)
  );

  const employeeOptions = [
    {
      value: "",
      label: availableEmployees.length ? "직원 선택" : "연결 가능한 직원 없음",
      disabled: true,
    },
    ...availableEmployees.map((employee) => ({
      value: employee.id,
      label: `${employee.name} (${employee.id}) · ${employee.department} ${employee.position}`,
    })),
  ];

  // 검색어: 이름, 이메일, 부서에 포함되면 표시
  const [keyword, setKeyword] = useState("");
  const filteredMembers = members.filter((m) =>
    [m.name, m.email, m.department ?? ""].some((field) => field.toLowerCase().includes(keyword.toLowerCase()))
  );

  const adminCount = members.filter((m) => m.role === "ADMIN" && m.active).length;
  const isMe = (member: MemberAccount) => member.id === me?.id;

  // 마지막 관리자가 권한을 잃으면 아무도 이 화면에 들어올 수 없으므로 막음 (서버에서도 한 번 더 검사)
  const isLastAdmin = (member: MemberAccount) => member.role === "ADMIN" && member.active && adminCount === 1;

  // 변경 요청: 성공하면 서버가 돌려준 값으로 목록의 해당 행을 바꿈
  const requestUpdate = async (member: MemberAccount, action: "role" | "active" | "employee", body: object, failTitle: string) => {
    setPendingId(member.id);
    try {
      const {data} = await api.patch<MemberAccount>(`/api/admin/members/${member.id}/${action}`, body);
      setMembers((prev) => prev.map((m) => (m.id === data.id ? data : m)));
    } catch (err) {
      openAlertModal(failTitle, undefined, {
        variant: "error",
        description: getApiError(err, "잠시 후 다시 시도해 주세요."),
      });
    } finally {
      setPendingId(null);
    };
  };

  const linkEmployee = (member: MemberAccount, employeeId: string) => {
    const employee = availableEmployees.find((item) => item.id === employeeId);

    if (!employee || member.employeeId || pendingId !== null)
      return;

    openAlertModal(
      `${member.name}님의 계정을 직원과 연결할까요?`,
      () => void requestUpdate(
        member,
        "employee",
        {employeeId},
        "직원과 계정을 연결하지 못했습니다.",
      ),
      {
        variant: "confirm",
        description: `${member.email}\n${employee.name} (${employee.id}) · ${employee.department} ${employee.position}`,
        confirmText: "연결",
        cancelText: "취소",
      },
    );
  };

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
      () => void requestUpdate(member, "role", {role}, "역할을 변경하지 못했습니다."),
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
      () => void requestUpdate(
        member,
        "active",
        {active: !member.active},
        member.active ? "계정을 정지하지 못했습니다." : "계정 정지를 해제하지 못했습니다.",
      ),
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
      isMe(m) ? `${m.name} (나)` : m.name
    )},
    {key: "email", header: "이메일"},
    {key: "employeeId", header: "연결 직원", width: "260px", render: (m) => (
      isEmployeeLoading ? "직원 조회 중..." : employeeLoadError ? employeeLoadError :
      m.employeeId ? `${m.employeeName ?? ""} (${m.employeeId})` : (
        <Select
        size="sm"
        aria-label={`${m.name} 연결 직원`}
        options={employeeOptions}
        value=""
        disabled={pendingId !== null || availableEmployees.length === 0}
        onChange={(e) => linkEmployee(m, e.target.value)}/>
      )
    )},
    {key: "department", header: "부서", align: "center", width: "120px", render: (m) => m.department ?? "미연결"},
    {key: "position", header: "직급", align: "center", width: "100px", render: (m) => m.position ?? "미연결"},
    {key: "role", header: "역할", align: "center", width: "120px", render: (m) => (
      // 자기 자신의 역할은 바꿀 수 없음
      <Select
      size="sm"
      aria-label={`${m.name} 역할`}
      options={ROLE_OPTIONS}
      value={m.role}
      disabled={isMe(m) || pendingId === m.id}
      onChange={(e) => changeRole(m, e.target.value as UserRole)}/>
    )},
    {key: "active", header: "상태", align: "center", width: "120px", render: (m) => (
      <StatusBadge
      tone={m.active ? "success" : "danger"}>
        {m.employeeStatus === "resigned" ? "퇴사 정지" : m.active ? "사용 중" : "정지"}
      </StatusBadge>
    )},
    {key: "createdAt", header: "가입일", align: "center", width: "120px"},
    {key: "actions", header: "관리", align: "center", width: "100px", render: (m) => (
      <Button
      size="sm"
      variant={m.active ? "danger" : "secondary"}
      disabled={isMe(m) || pendingId === m.id || m.employeeStatus === "resigned"}
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
        emptyText={
          isLoading ? "사용자 목록을 불러오는 중입니다."
          : loadError ? loadError
          : keyword ? `"${keyword}"에 해당하는 사용자가 없습니다.`
          : "등록된 사용자가 없습니다."
        }/>
      </Card>
    </PageContainer>
  );
};
