"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { FiPackage, FiTrash2 } from "react-icons/fi";
import api from "@/app/lib/api";
import type { InventoryItem } from "@/app/types/InventoryItem";
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
  // 생산완료된 오더는 제품 재고에 반영되어 수정하지 않음
  const isLocked = order?.status === "completed";
  // 연결 기능 이전에 완료된 오더(품목 없음)는 재고에 반영되지 않았으므로 삭제 가능
  const canDelete = isEditing && (!isLocked || order.itemId === null);

  const mountedRef = useRef(false);
  const mutationRef = useRef(false);
  const alertRef = useRef(openAlertModal);

  const [form, setForm] = useState({
    itemId: order?.itemId ?? "",
    quantity: order?.quantity?.toString() ?? "1",
    status: order?.status ?? "planning",
    // 완료(100%) 오더를 생산중으로 되돌리면 0부터 다시 입력
    progress: order && order.progress < 100 ? order.progress.toString() : "0",
    dueDate: order?.dueDate ?? "",
  });
  const [action, setAction] = useState<"save"|"delete"|null>(null);
  const [error, setError] = useState<string | null>(null);
  const isSubmitting = action !== null;

  // 생산할 품목: 재고관리의 제품
  const [products, setProducts] = useState<InventoryItem[]>([]);
  // 잠긴 오더는 품목을 바꿀 수 없으므로 목록을 조회하지 않음
  const [productsLoading, setProductsLoading] = useState(!isLocked);

  useEffect(() => {
    if (isLocked)
      return;

    const controller = new AbortController();

    api.get<InventoryItem[]>("/api/inventory/items", {
      signal: controller.signal,
    }).then(({data}) => {
      if (!controller.signal.aborted)
        setProducts(data.filter((item) => item.category === "제품"));
    }).catch((err: unknown) => {
      if (!controller.signal.aborted)
        console.error("제품 목록을 불러오는 중 오류 발생:", err);
    }).finally(() => {
      if (!controller.signal.aborted)
        setProductsLoading(false);
    });

    return () => controller.abort();
  }, [isLocked]);

  const productOptions = [
    {
      value: "",
      label: productsLoading
        ? "제품 목록을 불러오는 중..."
        : products.length
          ? "제품 선택"
          : "등록된 제품이 없습니다",
      disabled: true,
    },
    // 잠긴 오더는 목록을 조회하지 않으므로 저장된 제품명을 그대로 표시
    ...(order?.itemId && !products.some((item) => item.id === order.itemId)
      ? [{value: order.itemId, label: order.productName + " (" + order.itemId + ")"}]
      : []),
    ...products.map((item) => ({
      value: item.id,
      label: item.name + " (" + item.id + ") · 현재고 " + item.stock.toLocaleString(),
    })),
  ];

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
    if (mutationRef.current || isLocked)
      return;

    const quantity = Number(form.quantity);

    if (!form.itemId) {
      showError(
        "입력 내용을 확인해 주세요.",
        "생산할 제품을 선택해 주세요.",
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

    const progress = Number(form.progress);

    if (
      isEditing &&
      form.status === "progress" &&
      (!Number.isInteger(progress) || progress < 0 || progress > 99)
    ) {
      showError(
        "입력 내용을 확인해 주세요.",
        "진행률은 0~99 사이의 정수로 입력해 주세요.",
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

    // 생산완료로 바꾸면 재고가 늘고 되돌릴 수 없으므로 한 번 더 확인
    const completing = isEditing && form.status === "completed";

    const save = () => void runMutation("save", async () => {
      const payload = {
        itemId: form.itemId,
        quantity,
        status: isEditing ? form.status : "planning",
        // 생산대기·생산완료는 서버가 0·100으로 정함
        progress: isEditing && form.status === "progress" ? progress : null,
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
            "\n제품명: " + data.productName +
            (completing
              ? "\n제품 재고에 " + data.quantity.toLocaleString() + "개가 반영되었습니다."
              : ""),
          confirmText: "확인",
        },
      );
    });

    if (!completing) {
      save();
      return;
    }

    const product = products.find((item) => item.id === form.itemId);

    alertRef.current(
      "생산완료로 저장하시겠습니까?",
      save,
      {
        variant: "confirm",
        description:
          (product?.name ?? "제품") + " 재고가 " + quantity.toLocaleString() + "개 늘어납니다."
          + "\n완료된 오더는 수정하거나 삭제할 수 없습니다.",
        confirmText: "완료 처리",
        cancelText: "취소",
      },
    );
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
      isLocked
        ? "생산완료된 오더는 제품 재고에 반영되어 수정할 수 없습니다."
        : order && !order.itemId
          ? "기존 제품명: " + order.productName + ". 생산할 제품을 선택한 뒤 저장해 주세요."
          : isEditing
            ? "오더 정보를 수정하거나 삭제할 수 있습니다. 생산완료로 바꾸면 제품 재고가 늘어납니다."
            : "생산할 제품, 수량, 납기일을 입력하세요. 생산대기 상태로 등록됩니다."
    }
    hideSubmit={isLocked}
    cancelText={isLocked ? "닫기" : "취소"}
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

      <S.ModalField>
        <S.ModalLabel htmlFor={id + "-itemId"}>
          생산할 제품
        </S.ModalLabel>

        <Select
        id={id + "-itemId"}
        value={form.itemId}
        disabled={isLocked}
        onChange={(e) => updateField("itemId", e.target.value)}
        options={productOptions}
        required
        autoFocus/>
      </S.ModalField>

      <TextField
      id={id + "-quantity"}
      name="quantity"
      label="수량"
      type="number"
      min={1}
      max={2147483647}
      step={1}
      value={form.quantity}
      readOnly={isLocked}
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
          disabled={isLocked}
          onChange={(e) => updateField("status", e.target.value)}
          options={[
            {value: "planning", label: "생산대기"},
            {value: "progress", label: "생산중"},
            {value: "completed", label: "생산완료"},
          ]}/>
        </S.ModalField>
      )}

      {isEditing && form.status === "progress" && (
        <TextField
        id={id + "-progress"}
        name="progress"
        label="진행률 (%)"
        type="number"
        min={0}
        max={99}
        step={1}
        value={form.progress}
        onChange={(e) => updateField("progress", e.target.value)}
        required/>
      )}

      <TextField
      id={id + "-dueDate"}
      name="dueDate"
      label="납기일"
      type="date"
      value={form.dueDate}
      readOnly={isLocked}
      onChange={(e) => updateField("dueDate", e.target.value)}
      required/>

      {canDelete && (
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