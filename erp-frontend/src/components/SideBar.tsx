"use client";

import { usePathname } from "next/navigation";
import * as S from "@/assets/css/Style.styles";

interface MenuItem {
  label: string;
  href: string;
  hidden?: boolean; // 페이지가 준비되지 않은 메뉴는 숨김
};

interface MenuGroup {
  title: string;
  items: MenuItem[];
};

const MENU_GROUPS: MenuGroup[] = [
  {
    title: "업무",
    items: [
      { label: "대시보드", href: "/dashboard" },
      { label: "생산관리", href: "/dashboard/production" },
      { label: "재고관리", href: "/dashboard/inventory" },
      { label: "인사관리", href: "/dashboard/hr" },
    ],
  },
  {
    title: "시스템관리",
    items: [
      { label: "사용자 권한 관리", href: "/dashboard/system/users" },
      { label: "회사 기본 정보", href: "/dashboard/system/company" },
    ],
  },
];

// 모든 메뉴가 /dashboard로 시작하므로 대시보드는 정확히 일치할 때만 활성화
const isActiveMenu = (pathname: string, href: string) =>
  href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname === href || pathname.startsWith(`${href}/`);

interface SideBarProps {
  onNavigate?: () => void; // 모바일 서랍에서 메뉴 선택 시 닫기
};

export const SideBar = ({onNavigate}: SideBarProps) => {
  const pathname = usePathname();

  return (
    <S.AsideContainer id="side-menu" aria-label="주 메뉴">
      {MENU_GROUPS.map((group) => (
        <S.MenuSection key={group.title}>
          <S.SectionTitle>{group.title}</S.SectionTitle>
          <S.MenuList>
            {group.items
              .filter((item) => !item.hidden)
              .map((item) => {
                const isActive = isActiveMenu(pathname, item.href);
                return (
                  <li key={item.href}>
                    <S.MenuItem
                    href={item.href}
                    $isActive={isActive}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}>
                      {item.label}
                    </S.MenuItem>
                  </li>
                );
              })}
          </S.MenuList>
        </S.MenuSection>
      ))}
    </S.AsideContainer>
  );
};
