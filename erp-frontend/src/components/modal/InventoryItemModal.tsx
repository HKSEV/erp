"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { FiBox, FiTrash2 } from "react-icons/fi";
import api from "@/app/lib/api";
import { INVENTORY_CATEGORIES } from "@/app/types/InventoryItem";
import type { InventoryItem } from "@/app/types/InventoryItem";
import useModal from "@/components/contexts/ModalContext";
import { Button, Select, TextField } from "@/components/ui";
import * as S from "@/assets/css/Style.styles";
import FormModal from "./FormModal";
import StockMovementPanel from "./StockMovementPanel";

interface InventoryItemModalProps {
  item?: InventoryItem;
  onClose: () => void;
  onCreated?: (item: InventoryItem) => void;
  onUpdated?: (item: InventoryItem) => void;
  onDeleted?: (itemId: string) => void;
}

const MAX_QUANTITY = 2147483647;
const MAX_PRICE = 999999999999;

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

export default function InventoryItemModal({
  item,
  onClose,
  onCreated,
  onUpdated,
  onDeleted,
}: InventoryItemModalProps) {
  const {openAlertModal} = useModal();
  const id = useId();
  const isEditing = item !== undefined;

  const mountedRef = useRef(false);
  const mutationRef = useRef(false);
  const alertRef = useRef(openAlertModal);

  const [form, setForm] = useState({
    name: item?.name ?? "",
    category: item?.category ?? INVENTORY_CATEGORIES[0],
    stock: item?.stock?.toString() ?? "0",
    safetyStock: item?.safetyStock?.toString() ?? "0",
    unitPrice: item?.unitPrice?.toString() ?? "0",
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
          "품목 " + verb + "에 실패했습니다.",
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
    const stock = Number(form.stock);
    const safetyStock = Number(form.safetyStock);
    const unitPrice = Number(form.unitPrice);

    if (!name || name.length > 100) {
      showError(
        "입력 내용을 확인해 주세요.",
        "품목명은 1~100자로 입력해 주세요.",
      );
      return;
    };

    // 현재고는 등록할 때만 입력 (이후에는 입출고로만 변경)
    if (
      (!isEditing && (!Number.isInteger(stock) || stock < 0 || stock > MAX_QUANTITY)) ||
      !Number.isInteger(safetyStock) || safetyStock < 0 || safetyStock > MAX_QUANTITY
    ) {
      showError(
        "입력 내용을 확인해 주세요.",
        "현재고와 적정재고는 0~2,147,483,647 사이의 정수로 입력해 주세요.",
      );
      return;
    };

    if (!Number.isInteger(unitPrice) || unitPrice < 0 || unitPrice > MAX_PRICE) {
      showError(
        "입력 내용을 확인해 주세요.",
        "단가는 0~999,999,999,999원 사이의 정수로 입력해 주세요.",
      );
      return;
    };

    void runMutation("save", async () => {
      const payload = {
        name,
        category: form.category,
        ...(isEditing ? {} : {stock}),
        safetyStock,
        unitPrice,
      };

      const {data} = item
        ? await api.put<InventoryItem>(
            "/api/inventory/items/" + encodeURIComponent(item.id),
            payload,
          )
        : await api.post<InventoryItem>(
            "/api/inventory/items",
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
        "품목 " + (isEditing ? "수정" : "등록") + "이 완료되었습니다.",
        undefined,
        {
          variant: "success",
          description:
            "품목 코드: " + data.id +
            "\n품목명: " + data.name,
          confirmText: "확인",
        },
      );
    });
  };

  const handleDelete = () => {
    if (!item || mutationRef.current)
      return;

    alertRef.current(
      "품목을 삭제하시겠습니까?",
      () => {
        void runMutation("delete", async () => {
          await api.delete(
            "/api/inventory/items/" + encodeURIComponent(item.id),
          );

          if (!mountedRef.current)
            return;

          onDeleted?.(item.id);
          onClose();

          alertRef.current(
            "품목이 삭제되었습니다.",
            undefined,
            {
              variant: "success",
              description: item.id,
            },
          );
        });
      },
      {
        variant: "confirm",
        description:
          item.id + "\n삭제한 품목은 되돌릴 수 없습니다.",
        confirmText: "삭제",
        cancelText: "취소",
      },
    );
  };

  return (
    <FormModal
    isOpen
    noValidate
    title={isEditing ? "품목 상세보기" : "신규 품목 등록"}
    description={
      isEditing
        ? "품목 정보를 수정하거나 삭제할 수 있습니다."
        : "품목명, 분류, 재고, 단가를 입력하세요. 재고 상태는 자동으로 계산됩니다. 생산 오더에는 분류가 제품인 품목만 선택할 수 있습니다."
    }
    icon={<FiBox/>}
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
      {item && (
        <TextField
        id={id + "-itemId"}
        name="itemId"
        label="품목 코드"
        value={item.id}
        readOnly/>
      )}

      <TextField
      id={id + "-name"}
      name="name"
      label="품목명"
      placeholder="예: 알루미늄 프레임 A형"
      value={form.name}
      onChange={(e) => updateField("name", e.target.value)}
      maxLength={100}
      required
      autoFocus/>

      <S.ModalField>
        <S.ModalLabel htmlFor={id + "-category"}>
          분류
        </S.ModalLabel>

        <Select
        id={id + "-category"}
        value={form.category}
        onChange={(e) => updateField("category", e.target.value)}
        options={INVENTORY_CATEGORIES.map((category) => ({value: category, label: category}))}/>
      </S.ModalField>

      <TextField
      id={id + "-stock"}
      name="stock"
      label="현재고"
      type="number"
      min={0}
      max={MAX_QUANTITY}
      step={1}
      hint={
        isEditing
          ? "현재고는 아래 입출고 등록으로만 바뀝니다."
          : "등록할 때 입력한 수량은 기초 재고로 기록되고, 이후에는 입출고로만 바꿀 수 있습니다."
      }
      value={form.stock}
      readOnly={isEditing}
      onChange={(e) => updateField("stock", e.target.value)}
      required/>

      <TextField
      id={id + "-safetyStock"}
      name="safetyStock"
      label="적정재고"
      type="number"
      min={0}
      max={MAX_QUANTITY}
      step={1}
      hint="현재고가 적정재고보다 적으면 '재고부족', 0이면 '품절'로 표시됩니다."
      value={form.safetyStock}
      onChange={(e) => updateField("safetyStock", e.target.value)}
      required/>

      <TextField
      id={id + "-unitPrice"}
      name="unitPrice"
      label="단가 (원)"
      type="number"
      min={0}
      max={MAX_PRICE}
      step={1}
      value={form.unitPrice}
      onChange={(e) => updateField("unitPrice", e.target.value)}
      required/>

      {item && (
        <StockMovementPanel
        itemId={item.id}
        disabled={isSubmitting}
        onChanged={(changed) => {
          setForm((prev) => ({...prev, stock: changed.stock.toString()}));
          onUpdated?.(changed);
        }}
        onError={(title, message, err) =>
          showError(title, err ? getApiError(err) : message)
        }/>
      )}

      {isEditing && (
        <Button
        variant="danger"
        disabled={isSubmitting}
        onClick={handleDelete}>
          <FiTrash2 aria-hidden="true"/>
          {action === "delete" ? "삭제 중..." : "품목 삭제"}
        </Button>
      )}
    </FormModal>
  );
}
