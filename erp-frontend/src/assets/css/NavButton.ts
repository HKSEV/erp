import styled, { css } from "styled-components";
import Link from "next/link";
import * as C from "./common/Common.styles";

// 헤더
export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
  height: 4rem;
  background-color: ${({theme}) => theme.colors.dark};
  color: ${({theme}) => theme.colors.onDark};
  box-shadow: ${({theme}) => theme.shadow.header};
  position: relative;

  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 0.75rem;
  }
`;
export const HeaderLogo = styled(Link)`
  margin-right: auto;
  color: ${({theme}) => theme.colors.onDark};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
export const HeaderUserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  white-space: nowrap;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;
export const HeaderUserName = styled.span`
  color: ${({theme}) => theme.colors.onDarkMuted};

  @media (max-width: 768px) {
    display: none;
  }
`;
export const HeaderUserLink = styled(Link)`
  color: ${({theme}) => theme.colors.onDarkMuted};
  font-weight: 500;
  text-decoration: none;
  &:hover { color: ${({theme}) => theme.colors.onDark}; }
`;
export const HeaderLogoutButton = styled.button`
  background-color: transparent;
  color: ${({theme}) => theme.colors.onDarkSoft};
  border: 1px solid ${({theme}) => theme.colors.darkBorder};
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  &:hover { background-color: ${({theme}) => theme.colors.darkSubtle}; }
`;
// 모바일에서만 보이는 메뉴 버튼 (사이드바 서랍 열기/닫기)
export const HeaderMobileMenuToggle = styled.button`
  display: none;
  background-color: transparent;
  border: none;
  color: ${({theme}) => theme.colors.onDark};
  font-size: 1.75rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

// 푸터
export const FooterContainer = styled.footer`
  background-color: ${({theme}) => theme.colors.bg};
  border-top: 1px solid ${({theme}) => theme.colors.border};
  padding: 1.5rem 2.285rem;
  color: ${({theme}) => theme.colors.textMuted};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.143rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;
export const FooterInfo = styled.div`
  font-size: 0.875rem;
  text-align: center;
  line-height: 1.5;

  @media (min-width: 768px) {
    text-align: left;
  }
`;
export const FooterLinks = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.875rem;
  
  a {
    color: ${({theme}) => theme.colors.textSecondary};
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: ${({theme}) => theme.colors.textStrong};
      text-decoration: underline;
    }
  }
`;

// sidebar
export const AsideContainer = styled.nav`
  position: sticky;
  top: 4rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  background-color: ${({theme}) => theme.colors.surface};
`;
export const MenuSection = styled.div`
  margin-bottom: 24px;
`;
export const SectionTitle = styled.p`
  padding: 0 24px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({theme}) => theme.colors.textDisabled};
  margin-bottom: 8px;
  letter-spacing: 0.05em;
`;
export const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
export const MenuItem = styled(Link)<{$isActive?: boolean}>`
  display: block;
  padding: 10px 24px;
  color: ${({theme, $isActive}) => ($isActive ? theme.colors.accent : theme.colors.textSecondary)};
  background-color: ${({theme, $isActive}) => ($isActive ? theme.colors.accentSubtle : "transparent")};
  border-right: 3px solid ${({theme, $isActive}) => ($isActive ? theme.colors.accent : "transparent")};
  font-weight: ${({$isActive}) => ($isActive ? 700 : 500)};
  text-decoration: none;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({theme}) => theme.colors.surfaceSubtle};
    color: ${({theme}) => theme.colors.accent};
  }
`;

// 버튼
interface ButtonProps {
  $variant?: "primary" | "danger" | "grey" | "ghost" | "insta" | "kakao" | "white";
  $size?: "small" | "medium" | "large";
  $fullWidth?: boolean;
  $width?: string;
};
export const Button = styled.button<ButtonProps>`
  ${C.InlineFlexCenter}
  border-radius: 2.5rem;
  cursor: pointer;
  ${C.TransitionAll}
  font-weight: 900;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: max-content;

  //크기 사이즈 설정
  ${({ $size }) =>{
    switch($size) {
      case "small":
        return css`
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        `;
      case "medium":
        return css`
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        `; 
      case "large":
        return css`
          padding: 0.625rem 1.25rem;
          font-size: 1.125rem;
        `;
    };  
  }}

  // 가로길이 설정
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
  ${({ $width }) => $width && css`width: ${$width};`}

  //색상
  ${({ $variant, theme }) => {
    switch ($variant) {
      case "danger":
        return css`
          background-color: ${theme.colors.danger};
          color: white;
          border: none;
          padding:  0.7rem 1rem;
          &:hover { background-color: ${theme.colors.dangerHover}; }
        `; 

      case "grey":
        return css`
          background-color: ${theme.colors.neutral};
          color: white;
          border: none;
          padding:  0.7rem 1rem;
          &:hover { background-color: ${theme.colors.neutralHover}; }
        `;

      case "primary":
        return css`
          background-color: ${theme.colors.accent};
          color: white;
          border: none;
          padding:  0.7rem 1rem;
          &:hover { background-color: ${theme.colors.accentHover}; }
        `; 

      case "ghost":
        return css`
          background-color: transparent;
          border: none;
          color: inherit;
          padding: 0;
          &:hover { opacity: 0.7; }
        `; 

      // 외부 서비스 브랜드 색은 토큰으로 바꾸지 않음
      case "insta":
        return css`
          background-color: #E1306C;
          color: white;
          border: none;
          padding:  0.7rem 1rem;
          &:hover { background-color: #C13584; }
        `;
      
      case "kakao":
        return css`
          background-color: #FEE500;
          color: #3C1E1E;
          border: none;
          padding:  0.7rem 1rem;
          &:hover { background-color: #F4DC00; }
        `; 

      case "white":
        return css`
          background-color: transparent;
          color: #FFF;
          border: 1px solid #D1D3E2;
          padding:  0.7rem 1rem;
          &:hover { background-color: #F8F9FA; }
        `;
    };
  }}
`;