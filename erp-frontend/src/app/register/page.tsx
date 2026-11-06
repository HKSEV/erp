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
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import api from "@/app/lib/api";
import useGoogleLogin from "@/app/lib/useGoogleLogin";
import { startKakaoLogin } from "@/app/lib/kakao";
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
  const formRef = useRef<HTMLFormElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const {startGoogle, isGoogleStarting} = useGoogleLogin();

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

  const readFormValues = (): FormData => {
    if (!formRef.current)
      return formData;

    const values = new window.FormData(formRef.current);
    const read = (name: keyof FormData) =>
      String(values.get(name) ?? "");

    return {
      firstName: read("firstName"),
      lastName: read("lastName"),
      email: read("email"),
      password: read("password"),
      passwordConfirm: read("passwordConfirm"),
      tel: formatMobilePhone(read("tel")),
      address: read("address"),
      detailAddress: read("detailAddress"),
      gender: read("gender"),
    };
  };

  const getFocusedTextInput = () => {
    const active = document.activeElement;

    return active instanceof HTMLInputElement
      && formRef.current?.contains(active)
      && active.type !== "radio"
      && active.type !== "checkbox"
      ? active
      : null;
  };

  const handleWheelCapture = (
    e: React.WheelEvent<HTMLDivElement>
  ) => {
    if (e.deltaX || e.deltaY)
      getFocusedTextInput()?.blur();
  };

  const handleButtonPointerDown = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (e.pointerType !== "mouse" || e.button !== 0)
      return;

    const button = e.target instanceof Element
      ? e.target.closest("button")
      : null;

    if (button && !button.disabled && getFocusedTextInput())
      e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestRef.current || isGoogleStarting)
      return;

    const currentValues = readFormValues();
    setFormData(currentValues);

    const passwordError = getPasswordError(currentValues.password);

    if (passwordError) {
      openAlertModal(passwordError, undefined, {variant: "error"});
      return;
    };

    const {passwordConfirm, ...payload} = currentValues;

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

  const handleGoogleRegister = () => {
    if (requestRef.current)
      return;

    const {firstName, lastName} = readFormValues();

    void startGoogle({
      rememberMe: false,
      signup: true,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
  };

  const handleKakaoRegister = () => {
    if (requestRef.current || isGoogleStarting)
      return;
    
    const {firstName, lastName} = readFormValues();

    try {
      startKakaoLogin({
        rememberMe: false,
        signup: true,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    } catch (err: unknown) {
      openAlertModal(
        err instanceof Error
          ? err.message
          : "카카오 가입에 실패했습니다.",
        undefined,
        {variant: "error"}
      );
    }
  };

  return (
    <S.MemberContainer
    onWheelCapture={handleWheelCapture}
    onPointerDownCapture={handleButtonPointerDown}>
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
            정보를 입력하고 계정을 만들어 보세요.
            <br/>
            Google·카카오 회원가입은 이름과 성만 입력한 뒤
            {" "}해당 서비스의 가입 버튼을 눌러 주세요.
            <br/>
            선택한 서비스의 인증된 이메일이 필요하며,
            {" "}이메일 제공에 동의해야 가입할 수 있습니다.
          </S.MemberDescription>
        </S.MemberHeader>

        <S.MemberForm ref={formRef} onSubmit={handleSubmit}>
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
          disabled={isLoading || isGoogleStarting}>
            {isLoading ? "가입 처리 중..." : "회원가입"}
          </S.MemberButton>
        </S.MemberForm>

        <S.MemberDivider/>

        <S.MemberSocialWrapper>
          <S.GoogleSocialButton
          type="button"
          onClick={handleGoogleRegister}
          disabled={isLoading || isGoogleStarting}>
            <FcGoogle aria-hidden="true"/>
            Google로 가입하기
          </S.GoogleSocialButton>
          <S.KakaoSocialButton
          type="button"
          onClick={handleKakaoRegister}
          disabled={isLoading || isGoogleStarting}>
            <RiKakaoTalkFill aria-hidden="true"/>
            Kakao로 가입하기
          </S.KakaoSocialButton>
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