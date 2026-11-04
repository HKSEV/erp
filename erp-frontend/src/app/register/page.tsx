"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  FiUserPlus,
  FiMail,
  FiLock,
  FiInfo,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiInstagram,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import api from "@/app/lib/api";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_RULE_MESSAGE,
  getPasswordError,
} from "@/app/lib/password";
import { searchAddress } from "@/app/lib/postcode";
import { formatMobilePhone } from "@/app/lib/mobilePhone";
import useModal from "@/components/contexts/ModalContext";
import * as S from "@/assets/css/Style.styles";

const handleInstargramLogin = () => {

};

const handleKakaoLogin = () => {

};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  tel: string;
  address: string;
  detailAddress: string;
  gender: string;
};

export default function Member() {
  const {openAlertModal} = useModal();
  const router = useRouter();
  const requestRef = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    tel: "",
    address: "",
    detailAddress: "",
    gender: "male",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const genderOptions = [
    {value: "male", label: "남성"},
    {value: "female", label: "여성"},
    {value: "other", label: "기타"},
  ];

  useEffect(() => () => {
    requestRef.current?.abort();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const nextValue = name === "tel" ? formatMobilePhone(value) : value;
    setFormData((prev) => ({...prev, [name]: nextValue}));
  };

  const handleAddressSearch = async () => {
    try {
      const address = await searchAddress();

      if (!address)
        return;

      setFormData((prev) => ({...prev, address, detailAddress: ""}));
      document.getElementById("detailAddress")?.focus();
    } catch {
      openAlertModal("주소 검색을 불러오지 못했습니다.", undefined, {
        variant: "error",
      });
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestRef.current)
      return;

    const passwordError = getPasswordError(formData.password);

    if (passwordError) {
      openAlertModal(passwordError, undefined, {variant: "error"});
      return;
    };

    const {passwordConfirm, ...payload} = formData;

    if (payload.password !== passwordConfirm) {
      openAlertModal("비밀번호가 일치하지 않습니다.", undefined, {
        variant: "error",
      });
      return;
    };

    const controller = new AbortController();
    requestRef.current = controller;
    setIsLoading(true);

    try {
      await api.post<string>(
        "/api/members/register",
        {...payload, email: payload.email.trim()},
        {signal: controller.signal}
      );

      if (controller.signal.aborted)
        return;

      openAlertModal(
        "회원가입이 완료되었습니다.",
        () => router.push("/"),
        {
          variant: "success",
          description: "등록한 계정으로 로그인해 주세요.",
        }
      );
    } catch (err: unknown) {
      if (controller.signal.aborted)
        return;

      const data = isAxiosError<string | {message?: string}>(err)
        ? err.response?.data
        : undefined;

      const message = typeof data === "string"
        ? data
        : data?.message || "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.";

      openAlertModal(message, undefined, {variant: "error"});
    } finally {
      if (!controller.signal.aborted) {
        requestRef.current = null;
        setIsLoading(false);
      };
    };
  };

  return (
    <S.MemberContainer>
      {/* Next.js Script 컴포넌트를 사용한 비동기 로드 */}
      {/* <Script
      src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
      strategy="lazyOnload"/> */}
      <S.MemberCard aria-labelledby="register-title">
        <S.MemberHeader>
          <S.MemberIcon aria-hidden="true">
            <FiUserPlus/>
          </S.MemberIcon>
          <S.MemberTitle id="register-title">
            Create an Account!
          </S.MemberTitle>
          <S.MemberDescription>
            정보를 입력하고 계정을 만들어 보세요
          </S.MemberDescription>
        </S.MemberHeader>

        <S.MemberForm onSubmit={handleSubmit}>
          <S.MemberFieldRow>
            <S.MemberField>
              <S.MemberInputLabel htmlFor="firstName">
                이름
              </S.MemberInputLabel>
              <S.MemberInputWrapper>
                <S.MemberInput
                id="firstName"
                name="firstName"
                type="text"
                placeholder="이름"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                required/>
              </S.MemberInputWrapper>
            </S.MemberField>
            <S.MemberField>
              <S.MemberInputLabel htmlFor="lastName">
                성
              </S.MemberInputLabel>
              <S.MemberInputWrapper>
                <S.MemberInput
                id="lastName"
                name="lastName"
                type="text"
                placeholder="성"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                required/>
              </S.MemberInputWrapper>
            </S.MemberField>
          </S.MemberFieldRow>

          <S.MemberField>
            <S.MemberInputLabel htmlFor="email">
              이메일
            </S.MemberInputLabel>
            <S.MemberInputWrapper>
              <FiMail aria-hidden="true"/>
              <S.MemberInput
              id="email"
              name="email"
              type="email"
              placeholder="이메일"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required/>
            </S.MemberInputWrapper>
          </S.MemberField>

          <S.MemberFieldRow>
            <S.MemberField>
              <S.MemberInputLabel htmlFor="password">
                비밀번호
              </S.MemberInputLabel>
              <S.MemberInputWrapper>
                <FiLock aria-hidden="true"/>
                <S.MemberInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                aria-describedby="register-password-hint"
                disabled={isLoading}
                required/>
                <S.MemberPasswordToggle
                type="button"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                aria-pressed={showPassword}
                aria-controls="password"
                onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <FiEyeOff aria-hidden="true"/>
                  ) : (
                    <FiEye aria-hidden="true"/>
                  )}
                </S.MemberPasswordToggle>
              </S.MemberInputWrapper>
            </S.MemberField>
            <S.MemberField>
              <S.MemberInputLabel htmlFor="passwordConfirm">
                비밀번호 확인
              </S.MemberInputLabel>
              <S.MemberInputWrapper>
                <FiLock aria-hidden="true"/>
                <S.MemberInput
                id="passwordConfirm"
                name="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="비밀번호 확인"
                autoComplete="new-password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                aria-describedby="register-password-hint"
                disabled={isLoading}
                required/>
                <S.MemberPasswordToggle
                type="button"
                aria-label={showPasswordConfirm
                  ? "확인 비밀번호 숨기기"
                  : "확인 비밀번호 보기"}
                aria-pressed={showPasswordConfirm}
                aria-controls="passwordConfirm"
                onClick={() =>setShowPasswordConfirm((prev) => !prev)}>
                  {showPasswordConfirm ? (
                    <FiEyeOff aria-hidden="true"/>
                  ) : (
                    <FiEye aria-hidden="true"/>
                  )}
                </S.MemberPasswordToggle>
              </S.MemberInputWrapper>
            </S.MemberField>
          </S.MemberFieldRow>

          <S.MemberHint
          id="register-password-hint"
          style={{margin: "0 auto"}}>
            <FiInfo aria-hidden="true"/>
            <span>{PASSWORD_RULE_MESSAGE}</span>
          </S.MemberHint>

          <S.MemberField>
            <S.MemberInputLabel as="span" id="gender-label">
              성별
            </S.MemberInputLabel>
            <S.MemberGenderWrapper
            role="radiogroup"
            aria-labelledby="gender-label">
              {genderOptions.map((option) => (
                <S.MemberGenderOption
                key={option.value}
                $selected={formData.gender === option.value}>
                  <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={formData.gender === option.value}
                  onChange={handleChange}/>
                  {option.label}
                </S.MemberGenderOption>
              ))}
            </S.MemberGenderWrapper>
          </S.MemberField>

          <S.MemberField>
            <S.MemberInputLabel htmlFor="tel">
              전화번호
            </S.MemberInputLabel>
            <S.MemberInputWrapper>
              <FiPhone aria-hidden="true"/>
              <S.MemberInput
              id="tel"
              name="tel"
              type="tel"
              placeholder="010-0000-0000"
              autoComplete="tel"
              value={formData.tel}
              onChange={handleChange}/>
            </S.MemberInputWrapper>
          </S.MemberField>

          <S.MemberField>
            <S.MemberInputLabel htmlFor="address">
              주소
            </S.MemberInputLabel>
            <S.MemberAddressRow>
              <S.MemberInputWrapper>
                <S.MemberInput
                id="address"
                name="address"
                type="text"
                placeholder="주소를 검색해 주세요"
                value={formData.address}
                onChange={handleChange}
                readOnly/>
              </S.MemberInputWrapper>
              <S.MemberSearchButton
              type="button"
              onClick={handleAddressSearch}
              disabled={isLoading}>
                주소 검색
              </S.MemberSearchButton>
            </S.MemberAddressRow>
          </S.MemberField>

          <S.MemberField>
            <S.MemberInputLabel htmlFor="detailAddress">
              상세주소
            </S.MemberInputLabel>
            <S.MemberInputWrapper $disabled={formData.address === ""}>
              <S.MemberInput
              id="detailAddress"
              name="detailAddress"
              type="text"
              placeholder="상세주소를 입력해 주세요"
              value={formData.detailAddress}
              onChange={handleChange}
              disabled={formData.address === ""}/>
            </S.MemberInputWrapper>
          </S.MemberField>

          <S.MemberButton
          type="submit"
          disabled={isLoading}>
            {isLoading ? "가입 처리 중..." : "회원가입"}
          </S.MemberButton>
        </S.MemberForm>

        <S.MemberDivider/>

        <S.MemberSocialWrapper>
          <S.MemberSocialButton
          type="button"
          onClick={handleKakaoLogin}
          disabled={isLoading}>
            <FcGoogle aria-hidden="true"/>
            Google로 가입하기
          </S.MemberSocialButton>
          <S.MemberSocialButton
          type="button"
          onClick={handleInstargramLogin}
          disabled={isLoading}>
            <S.InstagramIcon aria-hidden="true">
              <FiInstagram/>
            </S.InstagramIcon>
            Instagram으로 가입하기
          </S.MemberSocialButton>
        </S.MemberSocialWrapper>

        <S.MemberFooter style={{flexDirection: "column"}}>
          <span>
            이미 계정이 있으신가요?{" "}
            <S.MemberTextLink href="/">로그인</S.MemberTextLink>
          </span>
          <S.MemberTextLink href="/forgot">
            비밀번호 찾기
          </S.MemberTextLink>
        </S.MemberFooter>
      </S.MemberCard>
    </S.MemberContainer>
  );
};