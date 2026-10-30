"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/app/lib/api";
import { clearSession } from "@/app/lib/auth";
import { searchAddress } from "@/app/lib/postcode";
import { PageContainer, PageHeader, Card, CardStack, DescriptionList, TextField, FormStack, FormActions, FieldWithButton, Button } from "@/components/ui";
import useModal from "@/components/contexts/ModalContext";
import { ROLE_LABEL } from "@/app/types/Member";
import type { MemberProfile } from "@/app/types/Member";

// 마이페이지: 계정 정보(읽기 전용), 연락처·주소 수정, 비밀번호 변경
// 계정 정보·연락처는 백엔드 API(GET·PATCH /api/members/me) 준비 전까지 샘플 데이터로 동작
const SAMPLE_PROFILE: MemberProfile = {
  id: 1,
  name: "박민수",
  email: "park@erp.com",
  department: "영업팀",
  position: "사원",
  role: "ADMIN",
  active: true,
  createdAt: "2026-10-08",
  tel: "010-1234-5678",
  address: "서울특별시 강남구 테헤란로 123",
  detailAddress: "5층",
};

const TEL_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;

type Contact = Pick<MemberProfile, "tel" | "address" | "detailAddress">;
const pickContact = ({tel, address, detailAddress}: MemberProfile): Contact => ({tel, address, detailAddress});

export default function MyPage() {
  const router = useRouter();
  const {openAlertModal} = useModal();

  // 연락처: 저장된 값(profile)과 입력 중인 값(contact)을 따로 두고, 다를 때만 저장 가능
  const [profile, setProfile] = useState(SAMPLE_PROFILE);
  const [contact, setContact] = useState(() => pickContact(SAMPLE_PROFILE));
  const saved = pickContact(profile);
  const isDirty = (Object.keys(contact) as (keyof Contact)[]).some((key) => contact[key].trim() !== saved[key]);
  const telError = contact.tel && !TEL_PATTERN.test(contact.tel.trim()) ? "010-0000-0000 형식으로 입력해 주세요." : undefined;

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

  const handleSaveContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDirty || telError)
      return;
    // TODO: PATCH /api/members/me
    setProfile((prev) => ({
      ...prev,
      tel: contact.tel.trim(),
      address: contact.address,
      detailAddress: contact.detailAddress.trim(),
    }));
    openAlertModal("연락처가 저장되었습니다.", undefined, {variant: "success"});
  };

  // 비밀번호: 입력하는 동안 바로 검사하고, 조건을 모두 만족해야 변경 버튼 활성화
  const [password, setPassword] = useState({current: "", next: "", confirm: ""});
  const [isChanging, setIsChanging] = useState(false);
  const nextError = password.next && password.next === password.current ? "기존 비밀번호와 다른 비밀번호를 입력해 주세요." : undefined;
  const confirmError = password.confirm && password.confirm !== password.next ? "새 비밀번호가 일치하지 않습니다." : undefined;
  const canChangePassword = Boolean(password.current && password.next && password.confirm) && !nextError && !confirmError && !isChanging;

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canChangePassword)
      return;
    setIsChanging(true);
    try {
      await api.post("/api/members/change-password", {oldPassword: password.current, newPassword: password.next});
      // 기존 토큰은 바로 지우고, 확인을 누르면 로그인 화면으로 이동
      clearSession();
      openAlertModal("비밀번호가 변경되었습니다.", () => router.push("/"), {
        variant: "success",
        description: "보안을 위해 다시 로그인해 주세요.",
      });
    } catch (err) {
      // 400: 백엔드가 보낸 안내 문구(예: 기존 비밀번호 불일치), 그 밖의 오류는 공통 문구
      const message = axios.isAxiosError(err) && err.response?.status === 400 && typeof err.response.data === "string"
        ? err.response.data
        : "비밀번호 변경에 실패했습니다.";
      openAlertModal(message, undefined, {variant: "error"});
    } finally {
      setIsChanging(false);
    };
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
            {label: "부서", value: profile.department},
            {label: "직급", value: profile.position},
            {label: "역할", value: ROLE_LABEL[profile.role]},
            {label: "가입일", value: profile.createdAt},
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
              onChange={(e) => setContact((prev) => ({...prev, tel: e.target.value}))}/>
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
                <Button type="submit" disabled={!isDirty || Boolean(telError)}>변경사항 저장</Button>
              </FormActions>
            </FormStack>
          </form>
        </Card>

        <Card title="비밀번호 변경">
          <form onSubmit={handleChangePassword}>
            <FormStack>
              <TextField
              id="current-password"
              label="현재(또는 임시) 비밀번호"
              type="password"
              autoComplete="current-password"
              value={password.current}
              onChange={(e) => setPassword((prev) => ({...prev, current: e.target.value}))}/>
              <TextField
              id="new-password"
              label="새 비밀번호"
              type="password"
              autoComplete="new-password"
              value={password.next}
              error={nextError}
              hint="기존 비밀번호와 다른 비밀번호를 사용해 주세요."
              onChange={(e) => setPassword((prev) => ({...prev, next: e.target.value}))}/>
              <TextField
              id="confirm-password"
              label="새 비밀번호 확인"
              type="password"
              autoComplete="new-password"
              value={password.confirm}
              error={confirmError}
              onChange={(e) => setPassword((prev) => ({...prev, confirm: e.target.value}))}/>
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
