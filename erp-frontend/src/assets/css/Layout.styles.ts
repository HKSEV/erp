import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
export const TopArea = styled.div`
  position: sticky;
  top: 0;
  z-index: ${({theme}) => theme.zIndex.header};
`;
export const MainContent = styled.div<{$isHidden: boolean}>`
  ${(props) => (props.$isHidden ? "width: 100%" : "display: flex")};
  flex: 1;
`;
export const LnbWrapper = styled.aside<{$isOpen: boolean}>`
  width: 250px;
  background-color: ${({theme}) => theme.colors.surface};
  border-right: 1px solid ${({theme}) => theme.colors.border};
  flex-shrink: 0;

  // 모바일: 헤더 아래에서 왼쪽으로 열리는 서랍
  @media (max-width: 768px) {
    position: fixed;
    top: 4rem;
    bottom: 0;
    left: 0;
    z-index: ${({theme}) => theme.zIndex.drawer};
    box-shadow: ${({theme, $isOpen}) => ($isOpen ? theme.shadow.drawer : "none")};
    transform: translateX(${({$isOpen}) => ($isOpen ? "0" : "-100%")});
    // 닫혀 있을 때 Tab 포커스가 숨은 메뉴로 가지 않도록 visibility도 함께 전환
    visibility: ${({$isOpen}) => ($isOpen ? "visible" : "hidden")};
    transition: transform 0.25s ease-out, visibility 0.25s;
  }
`;
// 모바일 서랍이 열렸을 때 뒤쪽을 덮는 배경 (누르면 닫힘)
export const DrawerBackdrop = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 4rem 0 0 0;
    z-index: ${({theme}) => theme.zIndex.backdrop};
    background-color: ${({theme}) => theme.colors.overlay};
  }
`;
export const ContentArea = styled.main`
  flex: 1;
  padding: 32px;
  background-color: ${({theme}) => theme.colors.bg};
  overflow-y: auto;
  min-width: 0;
`;
