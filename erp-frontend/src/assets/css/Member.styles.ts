import styled from "styled-components";
import Link from "next/link";

// 로그인, 회원가입, 비밀번호 찾기 창
export const MemberContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${(props: any) => (
    props.theme.colors.background || "#536692"
  )};
`;
export const MemberCard = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: #FFF;
  border-radius: 0.35rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  overflow: hidden;
`;
export const MemberImageColumn = styled.div`
  width: 41.66667%;
  background: url("");

  @media (max-width: 992px) {
    display: none;
  }
`;
export const MemberFormColumn = styled.div`
  width: 58.33333%;
  padding: 3rem;

  @media (max-width: 992px) {
    width: 100%;
  }
`;
export const MemberTitle = styled.h1`
  text-align: center;
  font-size: 1.5rem;
  color: #3A3B45;
  margin-bottom: 2.5rem;
  font-weight: 400;
`;
export const MemberForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const MemberRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
export const MemberCol = styled.div`
  flex: 1;
`;
export const MemberInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #D1D3E2;
  border-radius: 10rem;
  outline: none;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: #BAC8F3;
    box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
  }

  &[readonly] {
    background-color: #EAECF4;
  }
`;
export const MemberRadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
`;
export const MemberRadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: #6E707E;
  cursor: pointer;
  input { cursor: pointer; }
`;
export const MemberAddressWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;
export const MemberButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #4E73DF;
  color: white;
  border: none;
  border-radius: 10rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: #2E59D9;
  }
`;
export const MemberSearchButton = styled(MemberButton)`
  width: auto;
  min-width: 100px;
  background-color: #858796;

  &:hover {
    background-color: #717384;
  }
`;
export const MemberSocialButton = styled(MemberButton)<{$provider: "insta"|"kakao"}>`
  margin-bottom: 0.5rem;
  background-color: ${({$provider}) => (
    $provider === "insta" ? "#E1306C" : "#FEE500"
  )};
  color: ${({$provider}) => (
    $provider === "insta" ? "white" : "#000"
  )};

  &:hover {
    background-color: ${({$provider}) => (
      $provider === "insta" ? "#C40B5B" : "#E6CE00"
    )};
  }
`;
export const MemberDivider = styled.hr`
  margin: 1.5rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;
export const MemberStyledLink = styled(Link)`
  display: block;
  text-align: center;
  font-size: 0.875rem;
  color: #4E73DF;
  margin-bottom: 0.5rem;

  &:hover {
    text-decoration: underline;
    color: #224ABE;
  }
`;
export const MemberCheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;

  input, label {
    cursor: pointer;
  }
`;
export const MemberCheckboxLabel = styled.label`
  font-size: 0.8rem;
  color: #6E707E;
`;
export const MemberDescription = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #6E707E;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;