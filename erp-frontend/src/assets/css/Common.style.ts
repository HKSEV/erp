"use client";

import styled from "styled-components";
import Link from "next/link";

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
export const Logo = styled.nav`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
`;
export const DesktopNav = styled.nav`
  display: flex;
  gap: 2.285rem;

  @media (max-width: 768px) {
    display: none;
  }
`;
export const NavLink = styled(Link)`
  color: #CBD5E1;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
  &:hover { color: #FFF; }
`;
export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;
export const LogoutButton = styled.button`
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
export const MobileMenuToggle = styled.button`
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
export const MobileNav = styled.nav<{$isOpen: boolean}>`
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
export const StyledLink = styled(Link)`
  
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