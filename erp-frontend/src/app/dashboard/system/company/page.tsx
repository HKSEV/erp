"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import api from "@/app/lib/api";
import useCurrentMember from "@/app/lib/currentMember";
import type { Company } from "@/app/types/Company";
import { PageContainer, PageHeader, Card, TextField, FormStack, FormActions, Button } from "@/components/ui";
import useModal from "@/components/contexts/ModalContext";

// 시스템관리 > 회사 기본 정보 (GET·PUT /api/company)
const EMPTY_COMPANY: Company = {name: "", businessNumber: "", email: ""};
const BUSINESS_NUMBER_PATTERN = /^\d{3}-\d{2}-\d{5}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 숫자만 입력해도 000-00-00000 형식으로 하이픈을 넣음
const formatBusinessNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3)
    return digits;
  if (digits.length <= 5)
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

export default function CompanySettings() {
  const {openAlertModal} = useModal();
  const {isAdmin, isLoading: isMemberLoading} = useCurrentMember();
  // 수정은 관리자만 (일반 회원은 읽기 전용, 실제 차단은 백엔드 403)
  const isReadOnly = !isMemberLoading && !isAdmin;

  // 저장된 값(saved)과 입력 중인 값(form)을 따로 두고, 다를 때만 저장 가능
  const [saved, setSaved] = useState(EMPTY_COMPANY);
  const [form, setForm] = useState(EMPTY_COMPANY);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 화면이 처음 열릴 때 회사 정보 조회
  // 응답 전에 화면을 벗어나면(abort) 상태를 바꾸지 않음
  useEffect(() => {
    const controller = new AbortController();

    api.get<Company>("/api/company", {
      signal: controller.signal
    }).then(({data}) => {
      if (controller.signal.aborted)
        return;
      const company = {name: data.name, businessNumber: data.businessNumber, email: data.email};
      setSaved(company);
      setForm(company);
    }).catch((err: unknown) => {
      if (controller.signal.aborted)
        return;
      console.error("회사 정보를 불러오는 중 오류 발생:", err);
      openAlertModal("회사 정보를 불러오지 못했습니다.", undefined, {variant: "error"});
    }).finally(() => {
      if (!controller.signal.aborted)
        setIsLoading(false);
    });

    return () => controller.abort();
  }, [openAlertModal]);

  const isDirty = (Object.keys(form) as (keyof Company)[]).some((key) => form[key].trim() !== saved[key]);
  const nameError = form.name.trim().length > 100 ? "회사명은 100자 이내로 입력해 주세요." : undefined;
  const businessNumberError = form.businessNumber && !BUSINESS_NUMBER_PATTERN.test(form.businessNumber)
    ? "숫자 10자리를 입력해 주세요." : undefined;
  const emailError = form.email && !EMAIL_PATTERN.test(form.email.trim())
    ? "올바른 이메일 형식으로 입력해 주세요." : undefined;
  const isFilled = Boolean(form.name.trim() && form.businessNumber && form.email.trim());
  const canSave = isAdmin && isDirty && isFilled && !nameError && !businessNumberError && !emailError && !isSaving && !isLoading;

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave)
      return;
    setIsSaving(true);
    try {
      const {data} = await api.put<Company>("/api/company", {
        name: form.name.trim(),
        businessNumber: form.businessNumber,
        email: form.email.trim(),
      });
      const company = {name: data.name, businessNumber: data.businessNumber, email: data.email};
      setSaved(company);
      setForm(company);
      openAlertModal("회사 정보가 저장되었습니다.", undefined, {variant: "success"});
    } catch (err) {
      // 400·403: 백엔드가 보낸 안내 문구(예: 사업자 등록번호 형식, 관리자 전용), 그 밖의 오류는 공통 문구
      const status = isAxiosError(err) ? err.response?.status : undefined;
      const message = isAxiosError<{message?: unknown}>(err) && (status === 400 || status === 403) && typeof err.response?.data?.message === "string"
        ? err.response.data.message
        : "회사 정보 저장에 실패했습니다.";
      openAlertModal(message, undefined, {variant: "error"});
    } finally {
      setIsSaving(false);
    };
  };

  return (
    <PageContainer>
      <PageHeader
      title="회사 기본 정보"
      description={isReadOnly ? "회사 정보는 관리자만 수정할 수 있습니다." : "시스템에 표시되는 회사 정보를 관리합니다."}/>

      <div style={{maxWidth: 640}}>
        <Card title="기본 정보">
          <form onSubmit={handleSave} noValidate>
            <FormStack>
              <TextField
              id="company-name"
              label="회사명"
              type="text"
              placeholder={isLoading ? "불러오는 중…" : "회사명을 입력하세요"}
              maxLength={100}
              value={form.name}
              error={nameError}
              disabled={isLoading}
              readOnly={isReadOnly}
              onChange={(e) => setForm((prev) => ({...prev, name: e.target.value}))}/>
              <TextField
              id="business-number"
              label="사업자 등록번호"
              type="text"
              inputMode="numeric"
              placeholder="000-00-00000"
              value={form.businessNumber}
              error={businessNumberError}
              hint={isReadOnly ? undefined : "- 없이 숫자만 입력해도 됩니다."}
              disabled={isLoading}
              readOnly={isReadOnly}
              onChange={(e) => setForm((prev) => ({...prev, businessNumber: formatBusinessNumber(e.target.value)}))}/>
              <TextField
              id="company-email"
              label="대표 이메일"
              type="email"
              autoComplete="email"
              placeholder="example@company.com"
              maxLength={100}
              value={form.email}
              error={emailError}
              disabled={isLoading}
              readOnly={isReadOnly}
              onChange={(e) => setForm((prev) => ({...prev, email: e.target.value}))}/>
              {!isReadOnly && (
                <FormActions>
                  <Button variant="secondary" disabled={!isDirty || isSaving} onClick={() => setForm(saved)}>되돌리기</Button>
                  <Button type="submit" disabled={!canSave}>
                    {isSaving ? "저장 중…" : "변경사항 저장"}
                  </Button>
                </FormActions>
              )}
            </FormStack>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
};
