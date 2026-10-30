"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { FiPackage } from "react-icons/fi";
import api from "@/app/lib/api";
import type { ProductionOrder } from "@/app/types/ProductionOrder";
import useModal from "@/components/contexts/ModalContext";
import { TextField } from "@/components/ui";
import FormModal from "./FormModal";

interface ProductionOrderModalProps {
  onClose: () => void;
  onCreated: (order: ProductionOrder) => void;
}

export default function ProductionOrderModal({
  onClose,
  onCreated,
}: ProductionOrderModalProps) {
  const {openAlertModal} = useModal();
  const id = useId();
  const mountedRef = useRef(false);
  const submittingRef = useRef(false);
  const orderIdRef = useRef<string | null>(null);
  const alertRef = useRef(openAlertModal);

  const [form, setForm] = useState({
    productName: "",
    quantity: "1",
    dueDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 연속 클릭이나 Enter 입력에 의한 중복 요청 방지
    if (submittingRef.current)
      return;

    const productName = form.productName.trim();
    const quantity = Number(form.quantity);

    if (!productName || productName.length > 100) {
      setError("제품명은 1~100자로 입력해 주세요.");
      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 2147483647
    ) {
      setError("수량은 1 ~ 2,147,483,647 사이의 정수로 입력해 주세요.");
      return;
    };

    if (!form.dueDate) {
      setError("납기일을 선택해 주세요.");
      return;
    };

    submittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      // 재시도할 때도 같은 오더 번호를 사용합니다.
      orderIdRef.current ??= "PRD-" + crypto.randomUUID();

      const payload: ProductionOrder = {
        id: orderIdRef.current,
        productName,
        quantity,
        status: "planning",
        progress: 0,
        dueDate: form.dueDate,
      };

      const {data} = await api.post<ProductionOrder>(
        "/api/production/orders",
        payload
      );

      if (mountedRef.current) {
        onCreated(data);
        alertRef.current(
          "생산 오더 등록이 완료되었습니다.",
          onClose,
          {
            variant: "success",
            description:
              `제품명: ${data.productName}\n` +
              `수량: ${data.quantity.toLocaleString()}개\n` +
              `납기일: ${data.dueDate}`,
            confirmText: "확인",
          },
        );
      };
    } catch (err: unknown) {
      if (!mountedRef.current)
        return;

      let message = "오더를 등록하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.";

      if (isAxiosError<{message?: unknown}>(err)) {
        if (err.response?.status === 401)
          message = "로그인 정보를 확인할 수 없습니다. 다시 로그인해 주세요.";
        else {
          const detail = err.response?.data?.message;
          if (typeof detail === "string" && detail.trim())
            message = detail;
        };
      };

      setError(message);
    } finally {
      submittingRef.current = false;

      if (mountedRef.current)
        setIsSubmitting(false);
    };
  };

  return (
    <FormModal
    isOpen
    title="신규 생산 오더 등록"
    description="제품명, 수량, 납기일을 입력하세요. 생산대기 상태로 등록됩니다."
    icon={<FiPackage/>}
    isSubmitting={isSubmitting}
    error={error}
    onClose={onClose}
    onSubmit={handleSubmit}>
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

      <TextField
      id={id + "-dueDate"}
      name="dueDate"
      label="납기일"
      type="date"
      value={form.dueDate}
      onChange={(e) => updateField("dueDate", e.target.value)}
      required/>
    </FormModal>
  );
}