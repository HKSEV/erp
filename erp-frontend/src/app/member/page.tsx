"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Script from "next/script";
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
  repeatPassword: string;
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
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    companyName: "",
    position: "",
    tel: "",
    address: "",
    detailAddress: "",
    gender: "male",
  });

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

    if (formData.password !== formData.repeatPassword) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해 주세요.");
      return;
    };

    try {
      const response = await axios.post("/api/members/register", formData);
      if (response.status === 200 || response.status === 201) {
        console.log("등록 성공: ", response.data);
        alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        router.push("/login");
      };
    } catch (err: any) {
      if (err.response && err.response.data) {
        console.error("에러: ", err.response);
        alert(err.response.data.message);
      } else {
        console.error("네트워크 에러: ", err.message);
        alert("로그인중 오류가 발생했습니다");
      };
    };
  };

  return (
    <S.MemberContainer>
      {/* Next.js Script 컴포넌트를 사용한 비동기 로드 */}
      <Script
      src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
      strategy="lazyOnload"/>
      <S.MemberCard>
        <S.MemberImageColumn/>
        <S.MemberFormColumn>
          <S.MemberTitle>
            Create an Account!
          </S.MemberTitle>

          <S.MemberForm onSubmit={handleSubmit}>
            <S.MemberRow>
              <S.MemberCol>
                <S.MemberInput
                type="text"
                placeholder="이름"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required/>
              </S.MemberCol>
              <S.MemberCol>
                <S.MemberInput
                type="text"
                placeholder="성"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required/>
              </S.MemberCol>
            </S.MemberRow>

            <S.MemberInput
            type="email"
            placeholder="이메일"
            name="email"
            value={formData.email}
            onChange={handleChange}/>

            <S.MemberRow>
              <S.MemberCol>
                <S.MemberInput
                type="password"
                placeholder="비밀번호"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required/>
              </S.MemberCol>
              <S.MemberCol>
                <S.MemberInput
                type="password"
                placeholder="비밀번호 확인"
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                required/>
              </S.MemberCol>
            </S.MemberRow>

            <S.MemberRadioGroup>
              <span>성별 :</span>
              <S.MemberRadioLabel>
                <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}/>
                남성
              </S.MemberRadioLabel>
              <S.MemberRadioLabel>
                <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}/>
                여성
              </S.MemberRadioLabel>
              <S.MemberRadioLabel>
                <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleChange}/>
                기타
              </S.MemberRadioLabel>
            </S.MemberRadioGroup>

            <S.MemberRow>
              <S.MemberCol>
                <S.MemberInput
                type="text"
                placeholder="회사명"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}/>
              </S.MemberCol>
              <S.MemberCol>
                <S.MemberInput
                type="text"
                placeholder="직급"
                name="position"
                value={formData.position}
                onChange={handleChange}/>
              </S.MemberCol>
              <S.MemberCol>
                <S.MemberInput
                type="text"
                placeholder="전화번호"
                name="tel"
                value={formData.tel}
                onChange={handleChange}/>
              </S.MemberCol>
            </S.MemberRow>

            <S.MemberAddressWrapper>
              <S.MemberInput
              type="text"
              placeholder="주소"
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly/>
              <S.Button
              $variant="grey"
              $size="medium"
              $width="auto"
              type="button"
              onClick={handleAddressSearch}>
                주소검색
              </S.Button>
            </S.MemberAddressWrapper>

            <S.MemberInput
            type="text"
            placeholder="상세주소"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleChange}
            disabled={formData.address === ""}/>

            <S.Button
            $variant="primary"
            $size="medium"
            $fullWidth
            type="submit">
              Register Account
            </S.Button>

            <S.MemberDivider/>

            <S.Button
            $variant="insta"
            $size="medium"
            $fullWidth
            onClick={handleInstargramLogin}>
              Register with Instargram
            </S.Button>

            <S.Button
            $variant="kakao"
            $size="medium"
            $fullWidth
            onClick={handleKakaoLogin}>
              Register with Kakao
            </S.Button>
          </S.MemberForm>

          <S.MemberDivider/>

          <S.MemberStyledLink href="/forgot">
            Forgot password?
          </S.MemberStyledLink>

          <S.MemberStyledLink href="/">
            Already have an account? Login!
          </S.MemberStyledLink>
        </S.MemberFormColumn>
      </S.MemberCard>
    </S.MemberContainer>
  );
};