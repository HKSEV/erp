"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  FiUserPlus,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiBriefcase,
  FiPhone,
  FiInstagram,
} from "react-icons/fi";
import { FaRegBuilding } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import * as S from "@/assets/css/Style.styles";
import { setLogin } from "@/store/authSlice";

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
  companyName: string;
  position: string;
  tel: string;
  address: string;
  detailAddress: string;
  gender: string;
};

declare global {
  interface Window {
    daum: any;
  }
};

export default function Member() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    companyName: "",
    position: "",
    tel: "",
    address: "",
    detailAddress: "",
    gender: "male",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const genderOptions = [
    { value: "male", label: "남성" },
    { value: "female", label: "여성" },
    { value: "other", label: "기타" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleAddressSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.daum || !window.daum.Postcode)
      return;

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        let fullAddress = data.address
        let extraAddress = "";
        
        // 도로명 주소(R)
        if (data.addressType === "R") {
          if (data.bname !== "")
            extraAddress += data.bname;
          if (data.buildingName !== "")
            extraAddress += extraAddress !== ""
            ? `, ${data.buildingName}` : data.buildingName;
          
          fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        };

        setFormData((prev) => ({
          ...prev, address: fullAddress, detailAddress: ""
        }));
      }
    }).open(); // 팝업창 실행
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)

    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해 주세요.");
      return;
    };

    try {
      const response = await axios.post("/api/members/register", formData);
      if (response.status === 200 || response.status === 201) {
        console.log("등록 성공: ", response.data);
        alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        // 만약 백엔드에서 가입과 동시에 토큰을 내려준다면 바로 전역 상태에 저장
        const token = response.data.token;
        if (token) {
          dispatch(setLogin({token}));
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          router.push("/");
        } else {
          router.push("/");
        };
      };
    } catch (err: any) {
      if (err.response && err.response.data) {
        console.error("에러: ", err.response);
        alert(err.response.data.message);
      } else {
        console.error("네트워크 에러: ", err.message);
        alert("로그인중 오류가 발생했습니다");
      };
    } finally {
      setIsLoading(false);
    };
  };

  return (
    <S.MemberContainer>
      {/* Next.js Script 컴포넌트를 사용한 비동기 로드 */}
      <Script
      src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
      strategy="lazyOnload"/>
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

          <S.MemberFieldRow>
            <S.MemberField>
              <S.MemberInputLabel htmlFor="companyName">
                회사명
              </S.MemberInputLabel>
              <S.MemberInputWrapper>
                <FaRegBuilding aria-hidden="true"/>
                <S.MemberInput
                id="companyName"
                name="companyName"
                type="text"
                placeholder="회사명"
                autoComplete="organization"
                value={formData.companyName}
                onChange={handleChange}/>
              </S.MemberInputWrapper>
            </S.MemberField>
            <S.MemberField>
              <S.MemberInputLabel htmlFor="position">
                직급
              </S.MemberInputLabel>
              <S.MemberInputWrapper>
                <FiBriefcase aria-hidden="true"/>
                <S.MemberInput
                id="position"
                name="position"
                type="text"
                placeholder="직급"
                autoComplete="organization-title"
                value={formData.position}
                onChange={handleChange}/>
              </S.MemberInputWrapper>
            </S.MemberField>
          </S.MemberFieldRow>

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