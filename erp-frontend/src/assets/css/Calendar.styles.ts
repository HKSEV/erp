import styled from "styled-components";

// 캘린더
export const CalTopMargin = styled.div`
  margin-top: 2rem;
`;
export const CalendarWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background-color: #FFF;
  border: 1px solid #E0E0E0;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;
export const CalHeader = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32px;
  font-weight: 700;
  margin: 1.5rem 2rem;
  color: #333;
`;
export const CalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin: 0.5rem;
`;
export const CalDayName = styled.div`
  text-align: center;
  font-size: 1rem;
  padding-bottom: 10px;
  &:nth-child(1) { color: #FF4D4F; }
  &:nth-child(7) { color: #1890FF; }
`;
export const CalTooltip = styled.div`
  visibility: hidden;
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
`;
interface DayCellProps {
  $isEmpty?: boolean;
  $isToday?: boolean;
  $isHoliday?: boolean;
  $isSunday?: boolean;
  $isSaturday?: boolean;
};
export const CalDayCell = styled.div<DayCellProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80px;
  border-radius: 8px;
  font-size: 1.2rem;
  background-color: ${({$isEmpty}) => (
    $isEmpty ? "transparent" : "#FAFAFA"
  )};
  pointer-events: ${({$isEmpty}) => (
    $isEmpty ? "none" : "auto"
  )};
  color: ${({$isHoliday, $isSunday, $isSaturday}) => {
    if ($isHoliday || $isSunday)
      return "#FF4D4F";
    if ($isSaturday)
      return "#1890FF";
    return "#333";
  }};
  font-weight: ${({$isToday}) => ($isToday ? "bold" : "normal")};
  border: ${({$isToday}) => (
    $isToday ? "2px solid #1890FF" : "1px solid transparent"
  )};
  cursor: pointer;

  &:hover {
    background-color: ${({$isEmpty}) => (
      $isEmpty ? "transparent" : "#F0F0F0"
    )};
  }
`;
export const CalEventArrowBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #222;
  border: none;
  font-size: 16px;
  color: #FFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #444;
  }
`;