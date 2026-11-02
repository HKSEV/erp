"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { FiTrash2, FiUser } from "react-icons/fi";
import api from "@/app/lib/api";
import { DEPARTMENTS, POSITIONS } from "@/app/types/Organization";
import type { Employee } from "@/app/types/Employee";
import useModal from "@/components/contexts/ModalContext";
import { Button, Select, TextField } from "@/components/ui";
import * as S from "@/assets/css/Style.styles";
import FormModal from "./FormModal";

interface EmployeeModalProps {
  employee?: Employee;
  onClose: () => void;
  onCreated?: (employee: Employee) => void;
  onUpdated?: (employee: Employee) => void;
  onDeleted?: (employeeId: string) => void;
}

function getApiError(error: unknown): string {
  if (isAxiosError<{message?: unknown}>(error)) {
    if (error.response?.status === 401)
      return "로그인 정보를 확인할 수 없습니다. 다시 로그인해 주세요.";

    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim())
      return message;

    if (!error.response)
      return "처리 결과를 확인하지 못했습니다. 목록을 확인한 뒤 다시 시도해 주세요.";
  };

  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export default function EmployeeModal({
  employee,
  onClose,
  onCreated,
  onUpdated,
  onDeleted,
}: EmployeeModalProps) {
  const {openAlertModal} = useModal();
  const id = useId();
  const isEditing = employee !== undefined;

  const mountedRef = useRef(false);
  const mutationRef = useRef(false);
  const alertRef = useRef(openAlertModal);

  const [form, setForm] = useState({
    name: employee?.name ?? "",
    department: employee?.department ?? DEPARTMENTS[0],
    position: employee?.position ?? POSITIONS[0],
    status: employee?.status ?? "active",
    joinDate: employee?.joinDate ?? "",
  });
  const [action, setAction] = useState<"save"|"delete"|null>(null);
  const [error, setError] = useState<string | null>(null);
  const isSubmitting = action !== null;

  useEffect(() => {
    alertRef.current = openAlertModal;
  }, [openAlertModal]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const updateField = (
    name: keyof typeof form,
    value: string,
  ) => {
    setForm((prev) => ({...prev, [name]: value}));
    setError(null);
  };

  const showError = (title: string, message: string) => {
    setError(message);
    alertRef.current(title, undefined, {
      variant: "error",
      description: message,
      confirmText: "확인",
    });
  };

  const runMutation = async (
    kind: "save" | "delete", work: () => Promise<void>
  ) => {
    if (!mountedRef.current || mutationRef.current)
      return;

    mutationRef.current = true;
    setAction(kind);
    setError(null);

    try {
      await work();
    } catch (err: unknown) {
      if (mountedRef.current) {
        const verb = kind === "delete"
          ? "삭제"
          : isEditing ? "수정" : "등록";

        showError(
          "직원 정보 " + verb + "에 실패했습니다.",
          getApiError(err),
        );
      }
    } finally {
      mutationRef.current = false;

      if (mountedRef.current)
        setAction(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 연속 클릭이나 Enter 입력에 의한 중복 요청 방지
    if (mutationRef.current)
      return;

    const name = form.name.trim();

    if (!name || name.length > 50) {
      showError(
        "입력 내용을 확인해 주세요.",
        "이름은 1~50자로 입력해 주세요.",
      );
      return;
    };

    if (!form.joinDate) {
      showError(
        "입력 내용을 확인해 주세요.",
        "입사일을 선택해 주세요.",
      );
      return;
    };

    void runMutation("save", async () => {
      const payload = {
        name,
        department: form.department,
        position: form.position,
        status: isEditing ? form.status : "active",
        joinDate: form.joinDate,
      };

      const {data} = employee
        ? await api.put<Employee>(
            "/api/hr/employees/" + encodeURIComponent(employee.id),
            payload,
          )
        : await api.post<Employee>(
            "/api/hr/employees",
            payload,
          );

      if (!mountedRef.current)
        return;

      if (isEditing)
        onUpdated?.(data);
      else
        onCreated?.(data);

      onClose();

      alertRef.current(
        "직원 정보 " + (isEditing ? "수정" : "등록") + "이 완료되었습니다.",
        undefined,
        {
          variant: "success",
          description:
            "사번: " + data.id +
            "\n이름: " + data.name,
          confirmText: "확인",
        },
      );
    });
  };

  const handleDelete = () => {
    if (!employee || mutationRef.current)
      return;

    alertRef.current(
      "직원 정보를 삭제하시겠습니까?",
      () => {
        void runMutation("delete", async () => {
          await api.delete(
            "/api/hr/employees/" + encodeURIComponent(employee.id),
          );

          if (!mountedRef.current)
            return;

          onDeleted?.(employee.id);
          onClose();

          alertRef.current(
            "직원 정보가 삭제되었습니다.",
            undefined,
            {
              variant: "success",
              description: employee.id,
            },
          );
        });
      },
      {
        variant: "confirm",
        description:
          employee.id + "\n퇴사 처리는 삭제 대신 재직 상태를 '퇴사'로 바꿔 주세요.\n삭제한 정보는 되돌릴 수 없습니다.",
        confirmText: "삭제",
        cancelText: "취소",
      },
    );
  };

  return (
    <FormModal
    isOpen
    noValidate
    title={isEditing ? "직원 상세보기" : "신규 직원 등록"}
    description={
      isEditing
        ? "직원 정보를 수정하거나 삭제할 수 있습니다."
        : "이름, 부서, 직급, 입사일을 입력하세요. 재직중 상태로 등록됩니다."
    }
    icon={<FiUser/>}
    isSubmitting={isSubmitting}
    error={error}
    submitText={isEditing ? "수정" : "등록"}
    pendingText={
      action === "delete"
        ? "삭제 중..."
        : isEditing ? "수정 중..." : "등록 중..."
    }
    onClose={onClose}
    onSubmit={handleSubmit}>
      {employee && (
        <TextField
        id={id + "-employeeId"}
        name="employeeId"
        label="사번"
        value={employee.id}
        readOnly/>
      )}

      <TextField
      id={id + "-name"}
      name="name"
      label="이름"
      placeholder="예: 홍길동"
      value={form.name}
      onChange={(e) => updateField("name", e.target.value)}
      maxLength={50}
      required
      autoFocus/>

      <S.ModalField>
        <S.ModalLabel htmlFor={id + "-department"}>
          부서
        </S.ModalLabel>

        <Select
        id={id + "-department"}
        value={form.department}
        onChange={(e) => updateField("department", e.target.value)}
        options={DEPARTMENTS.map((department) => ({value: department, label: department}))}/>
      </S.ModalField>

      <S.ModalField>
        <S.ModalLabel htmlFor={id + "-position"}>
          직급
        </S.ModalLabel>

        <Select
        id={id + "-position"}
        value={form.position}
        onChange={(e) => updateField("position", e.target.value)}
        options={POSITIONS.map((position) => ({value: position, label: position}))}/>
      </S.ModalField>

      {isEditing && (
        <S.ModalField>
          <S.ModalLabel htmlFor={id + "-status"}>
            재직 상태
          </S.ModalLabel>

          <Select
          id={id + "-status"}
          value={form.status}
          onChange={(e) => updateField("status", e.target.value)}
          options={[
            {value: "active", label: "재직중"},
            {value: "leave", label: "휴직"},
            {value: "resigned", label: "퇴사"},
          ]}/>
        </S.ModalField>
      )}

      <TextField
      id={id + "-joinDate"}
      name="joinDate"
      label="입사일"
      type="date"
      value={form.joinDate}
      onChange={(e) => updateField("joinDate", e.target.value)}
      required/>

      {isEditing && (
        <Button
        variant="danger"
        disabled={isSubmitting}
        onClick={handleDelete}>
          <FiTrash2 aria-hidden="true"/>
          {action === "delete" ? "삭제 중..." : "직원 정보 삭제"}
        </Button>
      )}
    </FormModal>
  );
}
