import styled, { css } from "styled-components";
import Link from "next/link";
import * as C from "./common/Common.styles";

// 헤더
export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 4rem;
  background-color: #1E293B;
  color: #FFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;
export const HeaderLogo = styled.nav`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
`;
export const HeaderDesktopNav = styled.nav`
  display: flex;
  gap: 2.285rem;

  @media (max-width: 768px) {
    display: none;
  }
`;
export const HeaderNavLink = styled(Link)`
  color: #CBD5E1;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
  &:hover { color: #FFF; }
`;
export const HeaderUserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;
export const HeaderLogoutButton = styled.button`
  background-color: #EF4444;
  color: #FFF;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;
  &:hover { background-color: #DC2626; }
`;
export const HeaderMobileMenuToggle = styled.button`
  display: none;
  background-color: transparent;
  border: none;
  color: #FFF;
  font-size: 1.75rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;
export const HeaderMobileNav = styled.nav<{$isOpen: boolean}>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 56px;
  left: 0;
  width: 100%;
  background-color: #334155;
  padding: ${({$isOpen}) => ($isOpen ? "16px 24px" : "0 24px")};
  max-height: ${({$isOpen}) => ($isOpen ? "300px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999999;

  & > a {
    padding: 12px 0;
    border-bottom: 1px solid #475569;
    color: #FFF;
    text-decoration: none;
    font-weight: 500;
  }

  & > a:nth-child(5) {
    color: #93C5FD
  }

  & > a:last-child {
    border-bottom: none;
    color: #FCA5A5
  }

  @media (min-width: 768px) {
    display: none;
  }
}
`;
export const HeaderStyledLink = styled(Link)`
  
`;

// 푸터
export const FooterContainer = styled.footer`
  background-color: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  padding: 1.5rem 2.285rem;
  color: #64748B;
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
    color: #475569;
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: #0F172A;
      text-decoration: underline;
    }
  }
`;

// sidebar
export const AsideContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  background-color: #FFF;
`;
export const MenuSection = styled.div`
  margin-bottom: 24px;
`;
export const SectionTitle = styled.h3`
  padding: 0 24px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94A3B8;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
`;
export const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
export const MenuItem = styled(Link)`
  display: block;
  padding: 10px 24px;
  color: #475569;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #F1F5F9;
    color: #2563EB;
    border-right: 3px solid #2563EB;
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
  ${({ $variant }) => {
    switch ($variant) {
      case "danger":
        return css`
          background-color: #EF4444;
          color: white;
          border: none;
          padding:  0.7rem 1rem;
          &:hover { background-color: #DC2626; }
        `; 

      case "grey":
        return css`
          background-color: #858796;
          color: white;
          border: none;
          padding:  0.7rem 1rem;
          &:hover { background-color: #717384; }
        `;

      case "primary":
        return css`
          background-color: #2563EB;
          color: white;
          border: none;
          padding:  0.7rem 1rem;
          &:hover { background-color: #1D4ED8; }
        `; 

      case "ghost":
        return css`
          background-color: transparent;
          border: none;
          color: inherit;
          padding: 0;
          &:hover { opacity: 0.7; }
        `; 

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