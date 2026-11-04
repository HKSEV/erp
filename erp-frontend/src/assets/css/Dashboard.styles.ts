import styled from "styled-components";
import Link from "next/link";

// dashboard
export const DashToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.space.md};
  flex-wrap: wrap;
`;

export const DashHint = styled.p`
  margin: 0;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.font.size.sm};
  line-height: 1.6;
  overflow-wrap: anywhere;
`;

export const KpiLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.space.sm};
  color: ${({theme}) => theme.colors.textSecondary};
  font-size: ${({theme}) => theme.font.size.md};

  svg {
    width: 20px;
    height: 20px;
    color: ${({theme}) => theme.colors.accent};
  }
`;

export const KpiValue = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({theme}) => theme.space.xs};
  margin: ${({theme}) => theme.space.md} 0 ${({theme}) => theme.space.sm};
  color: ${({theme}) => theme.colors.textStrong};
  font-size: ${({theme}) => theme.font.size.xxxl};
  font-weight: ${({theme}) => theme.font.weight.bold};
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;

  small {
    font-size: ${({theme}) => theme.font.size.md};
    font-weight: 400;
  }
`;

export const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: ${({theme}) => theme.space.xl};
  margin-bottom: ${({theme}) => theme.space.xl};

  > * {
    min-width: 0;
  }

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({theme}) => theme.space.xl};

  > * {
    min-width: 0;
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({theme}) => theme.breakpoint.mobile}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const DetailLink = styled(Link)`
  color: ${({theme}) => theme.colors.accent};
  font-size: ${({theme}) => theme.font.size.sm};
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }
`;

export const DashMessage = styled.p`
  display: grid;
  place-items: center;
  min-height: 120px;
  margin: 0;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.font.size.md};
  text-align: center;
  line-height: 1.7;

  &[role="alert"] {
    color: ${({theme}) => theme.colors.danger};
  }
`;

export const ProductionCharts = styled.div`
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  align-items: center;
  gap: ${({theme}) => theme.space.xl};

  @media (max-width: ${({theme}) => theme.breakpoint.mobile}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const DashRing = styled.svg`
  display: block;
  width: 170px;
  height: 170px;
  margin: 0 auto;

  circle {
    fill: none;
    stroke-width: 12;
  }

  .track {
    stroke: ${({theme}) => theme.colors.border};
  }

  .planning {
    stroke: ${({theme}) => theme.status.warning.dot};
  }

  .progress {
    stroke: ${({theme}) => theme.status.info.dot};
  }

  .completed {
    stroke: ${({theme}) => theme.status.success.dot};
  }

  text {
    fill: ${({theme}) => theme.colors.textStrong};
    text-anchor: middle;
  }

  .total {
    font-size: 24px;
    font-weight: 700;
  }

  .caption {
    fill: ${({theme}) => theme.colors.textMuted};
    font-size: 10px;
  }
`;

export const DashLegend = styled.ul`
  display: grid;
  gap: ${({theme}) => theme.space.sm};
  margin: ${({theme}) => theme.space.md} 0 0;
  padding: 0;
  list-style: none;
  font-size: ${({theme}) => theme.font.size.md};

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
`;

export const DashSubtitle = styled.h3`
  margin: 0 0 ${({theme}) => theme.space.xs};
  color: ${({theme}) => theme.colors.textStrong};
  font-size: ${({theme}) => theme.font.size.md};
`;

export const MonthChart = styled.div`
  display: flex;
  gap: ${({theme}) => theme.space.sm};
  margin: ${({theme}) => theme.space.xl} 0 ${({theme}) => theme.space.lg};
`;

export const MonthColumn = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: ${({theme}) => theme.space.sm};
  color: ${({theme}) => theme.colors.textSecondary};
  font-size: ${({theme}) => theme.font.size.sm};
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

export const BarTrack = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 120px;
  background-color: ${({theme}) => theme.colors.surfaceSubtle};
  border-radius: ${({theme}) => theme.radius.sm};
`;

export const MonthBar = styled.div`
  width: 70%;
  max-width: 32px;
  background-color: ${({theme}) => theme.colors.accent};
  border-radius: 4px 4px 0 0;
`;

export const RowHeading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({theme}) => theme.space.sm};
  margin-bottom: ${({theme}) => theme.space.sm};
  color: ${({theme}) => theme.colors.textBody};
  font-size: ${({theme}) => theme.font.size.md};

  > :first-child {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

export const DepartmentList = styled.ul`
  display: grid;
  gap: ${({theme}) => theme.space.lg};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ItemList = styled.ul`
  margin: 0 0 ${({theme}) => theme.space.lg};
  padding: 0;
  list-style: none;

  li + li {
    margin-top: ${({theme}) => theme.space.lg};
    padding-top: ${({theme}) => theme.space.lg};
    border-top: 1px solid ${({theme}) => theme.colors.border};
  }
`;

export const DashScheduleText = styled.p`
  margin: 0;
  color: ${({theme}) => theme.colors.textBody};
  font-size: ${({theme}) => theme.font.size.md};
  line-height: 1.6;
  overflow-wrap: anywhere;
`;