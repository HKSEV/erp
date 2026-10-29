import styled, { css } from "styled-components";
import Link from "next/link";
import * as C from "./common/Common.styles";

// 로그인, 회원가입, 비밀번호 찾기 창
// 배경·아이콘 그라데이션은 로그인 화면 전용 장식이라 토큰으로 빼지 않음
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
  color: ${({theme}) => theme.colors.textStrong};

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
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: 1.5rem;
  box-shadow: ${({theme}) => theme.shadow.authCard};
  
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
  color: ${({theme}) => theme.colors.onAccent};
  background: linear-gradient(135deg, #3498FF, #2463EB);
  border-radius: 0.9375rem;
  box-shadow: ${({theme}) => theme.shadow.accent};

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
  color: ${({theme}) => theme.colors.textMuted};
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
  color: ${({theme}) => theme.colors.textBody};
  font-size: 0.875rem;
  font-weight: 650;
`;
export const MemberInputWrapper = styled.div<{$disabled?: boolean}>`
  ${C.FlexCenter}
  min-height: 3rem;
  padding: 0 0.875rem;
  gap: 0.75rem;
  background-color: ${({theme, $disabled}) => (
    $disabled ? theme.colors.surfaceSubtle : theme.colors.surface
  )};
  border: 0.0625rem solid ${({theme}) => theme.colors.borderStrong};
  border-radius: 0.625rem;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  > svg {
    width: 19px;
    height: 19px;
    flex-shrink: 0;
    color: ${({theme}) => theme.colors.textMuted};
  }

  ${({$disabled}) => !$disabled && css`
    &:hover {
      border-color: ${({theme}) => theme.colors.textDisabled};
    }

    &:focus-within {
      border-color: ${({theme}) => theme.colors.accent};
      box-shadow: 0 0 0 3px ${({theme}) => theme.colors.accentSubtle};
    }
  `}
`;
export const MemberInput = styled.input`
  width: 100%;
  min-width: 0;
  min-height: 2.875rem;
  padding: 0.75rem 0;
  color: ${({theme}) => theme.colors.textStrong};
  background-color: transparent;
  border: 0;
  outline: none;
  font-size: 0.875rem;
  line-height: 1.5;

  &::placeholder {
    color: ${({theme}) => theme.colors.textDisabled};
  }
`;
export const MemberPasswordToggle = styled.button`
  ${C.FlexCenter}
  width: 2rem;
  height: 2rem;
  padding: 0;
  flex-shrink: 0;
  color: ${({theme}) => theme.colors.textMuted};
  background: transparent;
  border: 0;
  border-radius: 0.375rem;
  cursor: pointer;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    color: ${({theme}) => theme.colors.accent};
    background: ${({theme}) => theme.colors.accentSubtle};
  }

  &:focus-visible {
    outline: 2px solid ${({theme}) => theme.colors.accent};
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
  color: ${({theme}) => theme.colors.textSecondary};
  cursor: pointer;
  user-select: none;

  input {
    width: 1rem;
    height: 1rem;
    margin: 0;
    flex-shrink: 0;
    accent-color: ${({theme}) => theme.colors.accent};
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
  color: ${({theme, $selected}) => (
    $selected ? theme.colors.accent : theme.colors.textMuted
  )};

  background-color: ${({theme, $selected}) => (
    $selected ? theme.colors.accentSubtle : theme.colors.surface
  )};

  border: 1px solid ${({theme, $selected}) => (
    $selected ? theme.colors.accent : theme.colors.borderStrong
  )};
  border-radius: 0.625rem;
  font-size: 0.875rem;
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: ${({theme}) => theme.colors.accent};
  }

  &:focus-within {
    outline: 2px solid ${({theme}) => theme.colors.accent};
    outline-offset: 2px;
  }
`;
export const MemberTextLink = styled(Link)`
  color: ${({theme}) => theme.colors.accent};
  font-size: inherit;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${({theme}) => theme.colors.accentHover};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &:focus-visible {
    outline: 2px solid ${({theme}) => theme.colors.accent};
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
  color: ${({theme}) => theme.colors.onAccent};
  background-color: ${({theme}) => theme.colors.accent};
  border: 1px solid ${({theme}) => theme.colors.accent};

  &:not(:disabled):hover {
    background-color: ${({theme}) => theme.colors.accentHover};
    border-color: ${({theme}) => theme.colors.accentHover};
    box-shadow: ${({theme}) => theme.shadow.accent};
  }

  &:not(:disabled):active {
    background-color: ${({theme}) => theme.colors.accentText};
  }
`;
export const MemberSearchButton = styled.button`
  ${C.ButtonBase}
  width: auto;
  padding-inline: 1rem;
  color: ${({theme}) => theme.colors.accent};
  border: 1px solid ${({theme}) => theme.colors.accent};
  white-space: nowrap;

  &:not(:disabled):hover {
    background-color: ${({theme}) => theme.colors.accentSubtle};
    border-color: ${({theme}) => theme.colors.accentHover};
  }
`;
export const MemberDivider = styled.hr`
  ${C.FlexCenter}
  margin: 1.375rem 0;
  gap: 0.875rem;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: 0.75rem;

  &::before,
  &::after {
    content: "";
    height: 1px;
    flex: 1;
    background-color: ${({theme}) => theme.colors.border};
  }
`;
export const MemberSocialWrapper = styled.div`
  ${C.FlexColumn}
  gap: 0.625rem;
`;
export const MemberSocialButton = styled.button`
  ${C.ButtonBase}
  color: ${({theme}) => theme.colors.textStrong};
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid ${({theme}) => theme.colors.borderStrong};

  svg {
    width: 1.3125rem;
    height: 1.3125rem;
    flex-shrink: 0;
  }

  &:not(:disabled):hover {
    background-color: ${({theme}) => theme.colors.bg};
    border-color: ${({theme}) => theme.colors.textDisabled};
  }
`;
export const InstagramIcon = styled.span`
  ${C.InlineFlexCenter}
  color: #DF287B; // 인스타그램 브랜드 색
`;
export const MemberFooter = styled.footer`
  ${C.FlexCenter}
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-top: 1px solid ${({theme}) => theme.colors.border};
  color: ${({theme}) => theme.colors.textMuted};
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
