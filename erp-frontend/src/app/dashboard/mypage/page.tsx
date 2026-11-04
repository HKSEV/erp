"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import api from "@/app/lib/api";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_RULE_MESSAGE,
  getPasswordError,
} from "@/app/lib/password";
import { clearSession } from "@/app/lib/auth";
import { searchAddress } from "@/app/lib/postcode";
import {
  PageContainer,
  PageHeader,
  Card,
  CardStack,
  DescriptionList,
  TextField,
  FormStack,
  FormActions,
  FieldWithButton,
  Button
} from "@/components/ui";
import { formatMobilePhone } from "@/app/lib/mobilePhone";
import useModal from "@/components/contexts/ModalContext";
import { ROLE_LABEL } from "@/app/types/Member";
import type { MemberProfile } from "@/app/types/Member";

// 마이페이지: 계정 정보(읽기 전용), 연락처·주소 수정, 비밀번호 변경
const TEL_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;

type Contact = Pick<MemberProfile, "tel" | "address" | "detailAddress">;
const pickContact = ({
  tel, address, detailAddress
}: MemberProfile): Contact => ({
  tel: tel ?? "",
  address: address ?? "",
  detailAddress: detailAddress ?? "",
});

function getApiError(error: unknown, fallback: string): string {
  if (isAxiosError<string | {message?: unknown}>(error)) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim())
      return data;

    if (data && typeof data === "object" && typeof data.message === "string")
      return data.message;
  };

  return fallback;
};

export default function MyPage() {
  const router = useRouter();
  const {openAlertModal} = useModal();

  // 연락처: 저장된 값(profile)과 입력 중인 값(contact)을 따로 두고, 다를 때만 저장 가능
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [contact, setContact] = useState<Contact>({
    tel: "", address: "", detailAddress: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadRetry, setLoadRetry] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const saveRef = useRef<AbortController | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  const saved: Contact = profile
    ? pickContact(profile)
    : {tel: "", address: "", detailAddress: ""};

  const isDirty = profile !== null
    && (Object.keys(contact) as (keyof Contact)[])
      .some((key) => contact[key].trim() !== saved[key].trim());

  const telError = contact.tel && !TEL_PATTERN.test(contact.tel.trim())
    ? "010-0000-0000 형식으로 입력해 주세요."
    : undefined;

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const {data} = await api.get<MemberProfile>("/api/members/me", {
          signal: controller.signal,
        });

        if (controller.signal.aborted)
          return;

        setProfile(data);
        setContact(pickContact(data));
      } catch (err: unknown) {
        if (controller.signal.aborted)
          return;

        if (isAxiosError(err) && (
          err.response?.status === 401 || err.response?.status === 403
        )) {
          clearSession();
          router.replace("/");
          return;
        };

        setLoadError(getApiError(err, "회원 정보를 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted)
          setIsLoading(false);
      };
    };

    void loadProfile();

    return () => controller.abort();
  }, [router, loadRetry]);

  useEffect(() => () => {
    saveRef.current?.abort();
  }, []);

  const handleAddressSearch = async () => {
    try {
      const address = await searchAddress();
      if (!address)
        return;
      setContact((prev) => ({...prev, address, detailAddress: ""}));
      document.getElementById("detail-address")?.focus();
    } catch {
      openAlertModal("주소 검색을 불러오지 못했습니다.", undefined, {variant: "error"});
    };
  };

  const handleSaveContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile || !isDirty || telError || isBusy
      || saveRef.current || requestRef.current)
      return;

    const controller = new AbortController();
    saveRef.current = controller;
    setIsSaving(true);

    try {
      const {data} = await api.patch<MemberProfile>(
        "/api/members/me",
        {
          tel: contact.tel.trim(),
          address: contact.address.trim(),
          detailAddress: contact.detailAddress.trim(),
        },
        {signal: controller.signal}
      );

      if (controller.signal.aborted)
        return;

      setProfile(data);
      setContact(pickContact(data));

      openAlertModal("연락처가 저장되었습니다.", undefined, {
        variant: "success",
      });
    } catch (err: unknown) {
      if (controller.signal.aborted)
        return;

      if (isAxiosError(err) && (
        err.response?.status === 401 || err.response?.status === 403
      )) {
        clearSession();
        router.replace("/");
        return;
      };

      openAlertModal(
        getApiError(err, "연락처 저장에 실패했습니다."),
        undefined,
        {variant: "error"}
      );
    } finally {
      if (!controller.signal.aborted) {
        saveRef.current = null;
        setIsSaving(false);
      };
    };
  };

  // 비밀번호: 입력하는 동안 바로 검사하고, 조건을 모두 만족해야 변경 버튼 활성화
  const [password, setPassword] = useState({
    current: "", next: "", confirm: "",
  });
  const [isChanging, setIsChanging] = useState(false);
  const isBusy = isSaving || isChanging;

  useEffect(() => () => {
    requestRef.current?.abort();
  }, []);

  const nextError = password.next
    ? getPasswordError(password.next)
      || (password.next === password.current
        ? "기존 비밀번호와 다른 비밀번호를 입력해 주세요."
        : undefined)
    : undefined;

  const confirmError = password.confirm && password.confirm !== password.next
    ? "새 비밀번호가 일치하지 않습니다."
    : undefined;

  const canChangePassword =
    Boolean(password.current && password.next && password.confirm)
    && !nextError
    && !confirmError
    && !isBusy;

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canChangePassword || requestRef.current || saveRef.current)
      return;

    const controller = new AbortController();
    requestRef.current = controller;
    setIsChanging(true);

    try {
      await api.post(
        "/api/members/change-password",
        {oldPassword: password.current, newPassword: password.next},
        {signal: controller.signal}
      );

      if (controller.signal.aborted)
        return;

      setPassword({current: "", next: "", confirm: ""});
      clearSession();

      openAlertModal("비밀번호가 변경되었습니다.", () => router.push("/"), {
        variant: "success",
        description: "보안을 위해 다시 로그인해 주세요.",
      });
    } catch (err: unknown) {
      if (controller.signal.aborted)
        return;

      const data = isAxiosError<string | {message?: string}>(err)
        ? err.response?.data
        : undefined;

      const message = typeof data === "string"
        ? data
        : data?.message || "비밀번호 변경에 실패했습니다.";

      openAlertModal(message, undefined, {variant: "error"});
    } finally {
      if (!controller.signal.aborted) {
        requestRef.current = null;
        setIsChanging(false);
      };
    };
  };

  if (!profile) {
    return (
      <PageContainer>
        <PageHeader title="마이페이지" description="내 계정 정보를 관리합니다."/>
        <CardStack style={{maxWidth: 720}}>
          <Card title="계정 정보">
            <p role={isLoading ? "status" : "alert"}>
              {isLoading
                ? "회원 정보를 불러오는 중입니다."
                : loadError || "회원 정보를 불러오지 못했습니다."}
            </p>
            {!isLoading && (
              <Button
              variant="secondary"
              onClick={() => {
                setIsLoading(true);
                setLoadError(null);
                setLoadRetry((prev) => prev + 1);
              }}>
                다시 불러오기
              </Button>
            )}
          </Card>
        </CardStack>
      </PageContainer>
    );
  };

  return (
    <PageContainer>
      <PageHeader
      title="마이페이지"
      description="이름·부서·직급·역할은 관리자가 관리합니다. 연락처와 비밀번호는 직접 변경할 수 있습니다."/>

      <CardStack style={{maxWidth: 720}}>
        <Card title="계정 정보">
          <DescriptionList items={[
            {label: "이름", value: profile.name},
            {label: "이메일", value: profile.email},
            {label: "부서", value: profile.department || "미등록"},
            {label: "직급", value: profile.position || "미등록"},
            {label: "역할", value: ROLE_LABEL[profile.role]},
            {label: "가입일", value: profile.createdAt || "미등록"},
          ]}/>
        </Card>

        <Card title="연락처">
          <form onSubmit={handleSaveContact}>
            <FormStack>
              <TextField
              id="tel"
              label="휴대폰 번호"
              type="tel"
              autoComplete="tel"
              placeholder="010-0000-0000"
              value={contact.tel}
              error={telError}
              onChange={(e) => setContact((prev) => ({
                ...prev,
                tel: formatMobilePhone(e.target.value),
              }))}/>
              <FieldWithButton>
                <TextField
                id="address"
                label="주소"
                readOnly
                placeholder="주소 검색을 눌러 주세요"
                value={contact.address}/>
                <Button variant="secondary" onClick={handleAddressSearch}>주소 검색</Button>
              </FieldWithButton>
              <TextField
              id="detail-address"
              label="상세 주소"
              autoComplete="address-line2"
              placeholder="동·호수 등"
              value={contact.detailAddress}
              onChange={(e) => setContact((prev) => ({...prev, detailAddress: e.target.value}))}/>
              <FormActions>
                <Button variant="secondary" disabled={!isDirty} onClick={() => setContact(saved)}>되돌리기</Button>
                <Button
                type="submit"
                disabled={!isDirty || Boolean(telError) || isBusy}>
                  {isSaving ? "저장 중..." : "변경사항 저장"}
                </Button>
              </FormActions>
            </FormStack>
          </form>
        </Card>

        <Card title="비밀번호 변경">
          <form onSubmit={handleChangePassword}>
            <FormStack>
              <TextField
              id="current-password"
              label="현재 비밀번호"
              type="password"
              autoComplete="current-password"
              value={password.current}
              onChange={(e) => setPassword((prev) => (
                {...prev, current: e.target.value}
              ))}
              disabled={isChanging}
              required/>
              <TextField
              id="new-password"
              label="새 비밀번호"
              type="password"
              autoComplete="new-password"
              value={password.next}
              error={nextError}
              hint={PASSWORD_RULE_MESSAGE}
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
              onChange={(e) => setPassword((prev) => (
                {...prev, next: e.target.value}
              ))}
              disabled={isChanging}
              required/>
              <TextField
              id="confirm-password"
              label="새 비밀번호 확인"
              type="password"
              autoComplete="new-password"
              value={password.confirm}
              error={confirmError}
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
              onChange={(e) => setPassword((prev) => (
                {...prev, confirm: e.target.value}
              ))}
              disabled={isChanging}
              required/>
              <FormActions>
                <Button type="submit" disabled={!canChangePassword}>
                  {isChanging ? "변경 중…" : "비밀번호 변경"}
                </Button>
              </FormActions>
            </FormStack>
          </form>
        </Card>
      </CardStack>
    </PageContainer>
  );
};
