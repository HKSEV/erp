"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { FiPackage, FiTrash2 } from "react-icons/fi";
import api from "@/app/lib/api";
import type { ProductionOrder } from "@/app/types/ProductionOrder";
import useModal from "@/components/contexts/ModalContext";
import { Button, Select, TextField } from "@/components/ui";
import * as S from "@/assets/css/Style.styles";
import FormModal from "./FormModal";

interface ProductionOrderModalProps {
  order?: ProductionOrder;
  onClose: () => void;
  onCreated?: (order: ProductionOrder) => void;
  onUpdated?: (order: ProductionOrder) => void;
  onDeleted?: (orderId: string) => void;
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

export default function ProductionOrderModal({
  order,
  onClose,
  onCreated,
  onUpdated,
  onDeleted,
}: ProductionOrderModalProps) {
  const {openAlertModal} = useModal();
  const id = useId();
  const isEditing = order !== undefined;

  const mountedRef = useRef(false);
  const mutationRef = useRef(false);
  const submittingRef = useRef(false);
  const orderIdRef = useRef<string | null>(null);
  const alertRef = useRef(openAlertModal);

  const [form, setForm] = useState({
    productName: order?.productName ?? "",
    quantity: order?.quantity?.toString() ?? "1",
    status: order?.status ?? "planning",
    dueDate: order?.dueDate ?? "",
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
          "생산 오더 " + verb + "에 실패했습니다.",
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

    const productName = form.productName.trim();
    const quantity = Number(form.quantity);

    if (!productName || productName.length > 100) {
      showError(
        "입력 내용을 확인해 주세요.",
        "제품명은 1~100자로 입력해 주세요.",
      );
      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 2147483647
    ) {
      showError(
        "입력 내용을 확인해 주세요.",
        "수량은 1~2,147,483,647 사이의 정수로 입력해 주세요.",
      );
      return;
    };

    if (!form.dueDate) {
      showError(
        "입력 내용을 확인해 주세요.",
        "납기일을 선택해 주세요.",
      );
      return;
    };

    void runMutation("save", async () => {
      const payload = {
        productName,
        quantity,
        status: isEditing ? form.status : "planning",
        dueDate: form.dueDate,
      };

      const {data} = order
        ? await api.put<ProductionOrder>(
            "/api/production/orders/" + encodeURIComponent(order.id),
            payload,
          )
        : await api.post<ProductionOrder>(
            "/api/production/orders",
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
        "생산 오더 " + (isEditing ? "수정" : "등록") + "이 완료되었습니다.",
        undefined,
        {
          variant: "success",
          description:
            "오더 번호: " + data.id +
            "\n제품명: " + data.productName,
          confirmText: "확인",
        },
      );
    });
  };

  const handleDelete = () => {
    if (!order || mutationRef.current)
      return;

    alertRef.current(
      "생산 오더를 삭제하시겠습니까?",
      () => {
        void runMutation("delete", async () => {
          await api.delete(
            "/api/production/orders/" + encodeURIComponent(order.id),
          );

          if (!mountedRef.current)
            return;

          onDeleted?.(order.id);
          onClose();

          alertRef.current(
            "생산 오더가 삭제되었습니다.",
            undefined,
            {
              variant: "success",
              description: order.id,
            },
          );
        });
      },
      {
        variant: "confirm",
        description:
          order.id + "\n삭제한 오더는 되돌릴 수 없습니다.",
        confirmText: "삭제",
        cancelText: "취소",
      },
    );
  };

  return (
    <FormModal
    isOpen
    noValidate
    title={isEditing ? "생산 오더 상세보기" : "신규 생산 오더 등록"}
    description={
      isEditing
        ? "오더 정보를 수정하거나 삭제할 수 있습니다."
        : "제품명, 수량, 납기일을 입력하세요. 생산대기 상태로 등록됩니다."
    }
    icon={<FiPackage/>}
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
      {order && (
        <TextField
        id={id + "-orderId"}
        name="orderId"
        label="오더 번호"
        value={order.id}
        readOnly/>
      )}

      <TextField
      id={id + "-productName"}
      name="productName"
      label="제품명"
      placeholder="예: 공업용 모터 250W"
      value={form.productName}
      onChange={(e) => updateField("productName", e.target.value)}
      maxLength={100}
      required
      autoFocus/>

      <TextField
      id={id + "-quantity"}
      name="quantity"
      label="수량"
      type="number"
      min={1}
      max={2147483647}
      step={1}
      value={form.quantity}
      onChange={(e) => updateField("quantity", e.target.value)}
      required/>

      {isEditing && (
        <S.ModalField>
          <S.ModalLabel htmlFor={id + "-status"}>
            상태
          </S.ModalLabel>

          <Select
          id={id + "-status"}
          value={form.status}
          onChange={(e) => updateField("status", e.target.value)}
          options={[
            {value: "planning", label: "생산대기"},
            {value: "progress", label: "생산중"},
            {value: "completed", label: "생산완료"},
          ]}/>
        </S.ModalField>
      )}

      <TextField
      id={id + "-dueDate"}
      name="dueDate"
      label="납기일"
      type="date"
      value={form.dueDate}
      onChange={(e) => updateField("dueDate", e.target.value)}
      required/>

      {isEditing && (
        <Button
        variant="danger"
        disabled={isSubmitting}
        onClick={handleDelete}>
          <FiTrash2 aria-hidden="true"/>
          {action === "delete" ? "삭제 중..." : "오더 삭제"}
        </Button>
      )}
    </FormModal>
  );
}