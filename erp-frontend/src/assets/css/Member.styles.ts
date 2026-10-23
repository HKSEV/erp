import styled from "styled-components";
import Link from "next/link";
import * as C from "./common/Common.styles";

// 로그인, 회원가입, 비밀번호 찾기 창
export const MemberContainer = styled.div`
  ${C.FlexCenter}
  width: 100%;
  min-height: 100dvh;
  padding: 3rem 1.25rem;
  background:
    radial-gradient(
      ellipse at 50% 35%,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0) 65%
    ),
    linear-gradient(
      135deg,
      #DEEFFF 0%,
      #C4E1FB 50%,
      #A8CBEE 100%
    );
  color: #172033;

  &,
  & * {
    box-sizing: border-box;
  }

  button,
  input {
    font: inherit;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;
export const MemberCard = styled.section`
  width: 100%;
  max-width: 800px;
  padding: 2.25rem 2rem 1.75rem;
  background-color: #FFF;
  border: 1px solid #EEF2F7;
  border-radius: 1.5rem;
  box-shadow:
    0 24px 64px rgba(59, 130, 246, 0.09),
    0 4px 16px rgba(15, 23, 42, 0.025);
  
  @media (max-width: 480px) {
    padding: 2rem 1.5rem 1.5rem;
    border-radius: 1.25rem;
  }
`;
export const MemberHeader = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;
export const MemberIcon = styled.div`
  ${C.FlexCenter}
  width: 3.25rem;
  height: 3.25rem;
  margin: 0 auto 1.25rem;
  color: #FFF;
  background: linear-gradient(135deg, #3498FF, #2463EB);
  border-radius: 0.9375rem;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.16);

  svg {
    width: 1.625rem;
    height: 1.625rem;
  }
`;
export const MemberTitle = styled.h1`
  margin: 0;
  font-size: 1.6875rem;
  font-weight: 750;
  line-height: 1.4;
  letter-spacing: -0.8px;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;
export const MemberDescription = styled.p`
  margin: 0.5rem 0 0;
  color: #7B8498;
  font-size: 0.875rem;
  line-height: 1.6;
  letter-spacing: -0.3px;
`;
export const MemberForm = styled.form`
  ${C.FlexColumn}
  gap: 1.25rem;
`;
export const MemberField = styled.div`
  ${C.FlexColumn}
  gap: 0.5rem;
`;
export const MemberFieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
export const MemberCol = styled.div`
  flex: 1;
`;
export const MemberInputLabel = styled.label`
  color: #253047;
  font-size: 0.875rem;
  font-weight: 650;
`;
export const MemberInputWrapper = styled.div<{$disabled?: boolean}>`
  ${C.FlexCenter}
  min-height: 3rem;
  padding: 0 0.875rem;
  gap: 0.75rem;
  background-color: ${({$disabled}) => (
    $disabled ? "#F0F3F9" : "#FFF"
  )};
  border: 0.0625rem solid #DCE1EB;
  border-radius: 0.625rem;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  > svg {
    width: 19px;
    height: 19px;
    flex-shrink: 0;
    color: #8590A5;
  }

  ${({$disabled}) => !$disabled && (`
    &:hover {
      border-color: #B7C2D4;
    }

    &:focus-within {
      border-color: #3278F6;
      box-shadow: 0 0 0 3px rgba(50, 120, 246, 0.1);
    }
  `)}
`;
export const MemberInput = styled.input`
  width: 100%;
  min-width: 0;
  min-height: 2.875rem;
  padding: 0.75rem 0;
  color: #253047;
  background-color: transparent;
  border: 0;
  outline: none;
  font-size: 0.875rem;
  line-height: 1.5;

  &::placeholder {
    color: #9aa3b5;
  }
`;
export const MemberPasswordToggle = styled.button`
  ${C.FlexCenter}
  width: 2rem;
  height: 2rem;
  padding: 0;
  flex-shrink: 0;
  color: #8590A5;
  background: transparent;
  border: 0;
  border-radius: 0.375rem;
  cursor: pointer;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    color: #3278F6;
    background: #F1F6FF;
  }

  &:focus-visible {
    outline: 2px solid #3278F6;
    outline-offset: 2px;
  }
`;
export const MemberOptionWrapper = styled.div`
  ${C.FlexBetween}
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.8125rem;
`;
export const MemberOptionLabel = styled.label`
  ${C.InlineFlexCenter}
  gap: 0.5rem;
  color: #536078;
  cursor: pointer;
  user-select: none;

  input {
    width: 1rem;
    height: 1rem;
    margin: 0;
    flex-shrink: 0;
    accent-color: #2563EB;
    cursor: pointer;
  }
`;
export const MemberGenderWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.625rem;
`;
export const MemberGenderOption = styled(MemberOptionLabel)<{
  $selected: boolean;
}>`
  min-height: 3rem;
  padding: 0.625rem 0.5rem;
  color: ${({$selected}) => (
    $selected ? "#2563EB" : "#7B8498"
  )};

  background-color: ${({$selected}) => (
    $selected ? "#EFF6FF" : "#FFF"
  )};

  border: 1px solid ${({$selected}) => (
    $selected ? "#3278F6" : "#DCE1EB"
  )};
  border-radius: 0.625rem;
  font-size: 0.875rem;
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: #3278f6;
  }

  &:focus-within {
    outline: 2px solid #3278f6;
    outline-offset: 2px;
  }
`;
export const MemberTextLink = styled(Link)`
  color: #3278F6;
  font-size: inherit;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: #1D4ED8;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &:focus-visible {
    outline: 2px solid #3278F6;
    outline-offset: 4px;
    border-radius: 2px;
  }
`;
export const MemberBackLink = styled(MemberTextLink)`
  ${C.InlineFlexCenter}
  gap: 0.5rem;
  font-size: 0.875rem;

  > svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
`;
export const MemberAddressRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.625rem;
`;
export const MemberButton = styled.button`
  ${C.ButtonBase}
  color: #FFF;
  background-color: #2563EB;
  border: 1px solid #2563EB;

  &:not(:disabled):hover {
    background-color: #1D4ED8;
    border-color: #1D4ED8;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.16);
  }

  &:not(:disabled):active {
    background-color: #1E40AF;
  }
`;
export const MemberSearchButton = styled.button`
  ${C.ButtonBase}
  width: auto;
  padding-inline: 1rem;
  color: #2563EB;
  border: 1px solid #3278F6;
  white-space: nowrap;

  &:not(:disabled):hover {
    background-color: #EFF6FF;
    border-color: #2563EB;
  }
`;
export const MemberDivider = styled.hr`
  ${C.FlexCenter}
  margin: 1.375rem 0;
  gap: 0.875rem;
  color: #939CAD;
  font-size: 0.75rem;

  &::before,
  &::after {
    content: "";
    height: 1px;
    flex: 1;
    background-color: #E5E9F1;
  }
`;
export const MemberSocialWrapper = styled.div`
  ${C.FlexColumn}
  gap: 0.625rem;
`;
export const MemberSocialButton = styled.button`
  ${C.ButtonBase}
  color: #253047;
  background-color: #FFF;
  border: 1px solid #DCE1EB;

  svg {
    width: 1.3125rem;
    height: 1.3125rem;
    flex-shrink: 0;
  }

  &:not(:disabled):hover {
    background-color: #F8FAFC;
    border-color: #BCC7D8;
  }
`;
export const InstagramIcon = styled.span`
  ${C.InlineFlexCenter}
  color: #DF287B;
`;
export const MemberFooter = styled.footer`
  ${C.FlexCenter}
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-top: 1px solid #F0F2F6;
  color: #8590A5;
  font-size: 0.75rem;
  line-height: 1.6;
`;
export const MemberHint = styled(MemberDescription)`
  ${C.FlexCenter}
  margin: 1rem 0 0;
  gap: 0.375rem;
  font-size: 0.75rem;
  text-align: center;

  > svg {
    width: 1rem;
    height: 1rem;
    margin-top: 0.1rem;
    flex-shrink: 0;
  }

  > span {
    min-width: 0;
  }
`;
