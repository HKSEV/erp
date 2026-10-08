import styled from "styled-components";

// dashboard
export const CalendarLayout = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;
export const LeftPanel = styled.div`
  width: 320px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;
export const RightPanel = styled.div`
  flex: 1;
  min-width: 0;
`;