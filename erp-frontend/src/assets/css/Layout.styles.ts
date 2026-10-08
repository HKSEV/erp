import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
export const TopArea = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;
export const MainContent = styled.div<{$isHidden: boolean}>`
  ${(props) => (props.$isHidden ? "width: 100%" : "display: flex")};
  flex: 1;
`;
export const LnbWrapper = styled.aside`
  width: 250px;
  background-color: #FFF;
  border-right: 1px solid #E2E8F0;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;
export const ContentArea = styled.main`
  flex: 1;
  padding: 32px;
  background-color: #F8FAFC;
  overflow-y: auto;
  min-width: 0;
`;
