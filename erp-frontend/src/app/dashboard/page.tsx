"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiClipboard,
  FiPackage,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";
import api from "@/app/lib/api";
import {
  getDashboardStats,
  getScheduleMonths,
} from "@/app/lib/dashboard";
import type { ProductionOrder } from "@/app/types/ProductionOrder";
import type { InventoryItem } from "@/app/types/InventoryItem";
import type { Employee } from "@/app/types/Employee";
import type { Schedule } from "@/app/types/Schedule";
import {
  Button,
  Card,
  PageContainer,
  PageHeader,
  ProgressBar,
  StatGrid,
  StatusBadge,
} from "@/components/ui";
import type { StatusTone } from "@/components/ui";
import * as S from "@/assets/css/Style.styles";

interface Resource<T> {
  data: T[];
  loading: boolean;
  error: string | null;
};

const pending = <T,>(): Resource<T> => ({
  data: [],
  loading: true,
  error: null,
});

const isReady = (resource: Resource<unknown>) =>
  !resource.loading && !resource.error;

const STATUS: {
  key: ProductionOrder["status"];
  label: string;
  tone: StatusTone;
}[] = [
  {key: "planning", label: "생산대기", tone: "warning"},
  {key: "progress", label: "생산중", tone: "info"},
  {key: "completed", label: "생산완료", tone: "success"},
];

function StateMessage({resource}: {resource: Resource<unknown>}) {
  return (
    <S.DashMessage role={resource.error ? "alert" : "status"}>
      {resource.loading
        ? "정보를 불러오는 중입니다."
        : resource.error}
    </S.DashMessage>
  );
}

export default function Dashboard() {
  const [referenceDate, setReferenceDate] = useState(() => new Date());
  const [orders, setOrders] = useState<Resource<ProductionOrder>>(pending);
  const [items, setItems] = useState<Resource<InventoryItem>>(pending);
  const [employees, setEmployees] = useState<Resource<Employee>>(pending);
  const [schedules, setSchedules] = useState<Resource<Schedule>>(pending);

  useEffect(() => {
    const controller = new AbortController();
    const options = {
      signal: controller.signal,
      timeout: 10000,
    };

    const load = async <T,>(
      request: Promise<T[]>,
      apply: (value: Resource<T>) => void,
      label: string,
    ) => {
      try {
        const data = await request;

        if (!Array.isArray(data))
          throw new Error("잘못된 응답 형식");

        if (!controller.signal.aborted)
          apply({data, loading: false, error: null});
      } catch {
        if (!controller.signal.aborted) {
          apply({
            data: [],
            loading: false,
            error: `${label} 정보를 불러오지 못했습니다. 새로고침해 주세요.`,
          });
        }
      }
    };

    void load(
      api.get<ProductionOrder[]>("/api/production/orders", options)
        .then(({data}) => data),
      setOrders,
      "생산",
    );

    void load(
      api.get<InventoryItem[]>("/api/inventory/items", options)
        .then(({data}) => data),
      setItems,
      "재고",
    );

    void load(
      api.get<Employee[]>("/api/hr/employees", options)
        .then(({data}) => data),
      setEmployees,
      "인사",
    );

    void load(
      Promise.all(
        getScheduleMonths(referenceDate).map((params) =>
          api.get<Schedule[]>("/api/schedules", {...options, params})
            .then(({data}) => data),
        ),
      ).then((months) => months.flat()),
      setSchedules,
      "일정",
    );

    return () => controller.abort();
  }, [referenceDate]);

  const stats = useMemo(() => getDashboardStats(
    orders.data,
    items.data,
    employees.data,
    schedules.data,
    referenceDate,
  ), [
    orders.data,
    items.data,
    employees.data,
    schedules.data,
    referenceDate,
  ]);

  const loading = [orders, items, employees, schedules]
    .some((resource) => resource.loading);

  const refresh = () => {
    setOrders(pending());
    setItems(pending());
    setEmployees(pending());
    setSchedules(pending());
    setReferenceDate(new Date());
  };

  const metrics = [
    {
      label: "미완료 생산 오더",
      icon: <FiClipboard/>,
      resource: orders,
      value: stats.openOrderCount,
      unit: "건",
      hint: `생산중 ${stats.statusCounts.progress} · 대기 ${stats.statusCounts.planning} · 납기 지연 ${stats.overdueCount}`,
    },
    {
      label: "재고 자산",
      icon: <FiPackage/>,
      resource: items,
      value: stats.inventoryValue,
      unit: "원",
      hint: `등록 ${items.data.length}품목 · 부족/품절 ${stats.riskItems.length}품목`,
    },
    {
      label: "총 임직원",
      icon: <FiUsers/>,
      resource: employees,
      value: stats.staffCount,
      unit: "명",
      hint: `퇴사자 제외 · 휴직 ${stats.leaveCount}명 포함`,
    },
    {
      label: "오늘 내 일정",
      icon: <FiCalendar/>,
      resource: schedules,
      value: stats.todayCount,
      unit: "건",
      hint: `오늘 미완료 일정 ${stats.todayPendingCount}건`,
    },
  ];

  const maxDue = Math.max(
    1,
    ...stats.monthlyDue.map((month) => month.count),
  );

  return (
    <PageContainer>
      <PageHeader
      title="대시보드"
      description="생산·재고·인사 현황과 개인 업무를 한눈에 확인합니다."
      actions={
        <S.DashToolbar>
          <S.DashHint>
            조회 기준 {referenceDate.toLocaleString("ko-KR", {
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </S.DashHint>
          <Button
          variant="secondary"
          size="sm"
          onClick={refresh}
          disabled={loading}>
            <FiRefreshCw aria-hidden="true"/> 새로고침
          </Button>
        </S.DashToolbar>
      }/>

      <StatGrid>
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div
            aria-label={metric.label}
            aria-busy={metric.resource.loading}>
              <S.KpiLabel>
                {metric.icon}
                {metric.label}
              </S.KpiLabel>
              <S.KpiValue>
                {isReady(metric.resource)
                  ? metric.value.toLocaleString("ko-KR")
                  : "—"}
                <small>{metric.unit}</small>
              </S.KpiValue>
              <S.DashHint>
                {isReady(metric.resource)
                  ? metric.hint
                  : metric.resource.loading ? "조회 중" : "조회 실패"}
              </S.DashHint>
            </div>
          </Card>
        ))}
      </StatGrid>

      <S.AnalyticsGrid>
        <Card
        title="생산 현황"
        actions={
          <S.DetailLink href="/dashboard/production">
            생산관리 →
          </S.DetailLink>
        }>
          {!isReady(orders) ? (
            <StateMessage resource={orders}/>
          ) : (
            <S.ProductionCharts>
              <div>
                <S.DashRing
                viewBox="0 0 160 160"
                role="img"
                aria-label={
                  `전체 생산 오더 ${orders.data.length}건. ${
                    STATUS.map(({key, label}) =>
                      `${label} ${stats.statusCounts[key]}건`,
                    ).join(", ")
                  }`
                }>
                  <circle className="track" cx="80" cy="80" r="62"/>

                  {STATUS.map(({key}, index) => {
                    const total = orders.data.length;
                    const percent = total
                      ? stats.statusCounts[key] / total * 100
                      : 0;
                    const offset = total
                      ? STATUS.slice(0, index).reduce(
                        (sum, status) => sum + stats.statusCounts[status.key],
                        0,
                      ) / total * 100
                      : 0;

                    return (
                      <circle
                      key={key}
                      className={key}
                      cx="80"
                      cy="80"
                      r="62"
                      pathLength="100"
                      strokeDasharray={`${percent} ${100 - percent}`}
                      strokeDashoffset={-offset}
                      transform="rotate(-90 80 80)"/>
                    );
                  })}

                  <text className="total" x="80" y="80">
                    {orders.data.length.toLocaleString("ko-KR")}
                  </text>
                  <text className="caption" x="80" y="100">
                    전체 오더
                  </text>
                </S.DashRing>

                <S.DashLegend>
                  {STATUS.map(({key, label, tone}) => (
                    <li key={key}>
                      <StatusBadge tone={tone}>{label}</StatusBadge>
                      <strong>{stats.statusCounts[key]}건</strong>
                    </li>
                  ))}
                </S.DashLegend>
              </div>

              <div>
                <S.DashSubtitle>미완료 오더 납기월</S.DashSubtitle>
                <S.DashHint>
                  {stats.monthlyDue[0].key} ~ {stats.monthlyDue[5].key}
                </S.DashHint>

                <S.MonthChart
                role="list"
                aria-label="향후 6개월 납기별 미완료 오더">
                  {stats.monthlyDue.map((month) => (
                    <S.MonthColumn
                    key={month.key}
                    role="listitem"
                    aria-label={`${month.key} 납기 ${month.count}건`}
                    title={`${month.key} 납기 ${month.count}건`}>
                      <strong>{month.count}</strong>
                      <S.BarTrack>
                        <S.MonthBar
                        style={{height: `${month.count / maxDue * 100}%`}}/>
                      </S.BarTrack>
                      <span>{month.label}</span>
                    </S.MonthColumn>
                  ))}
                </S.MonthChart>

                <S.DashHint>
                  완료되지 않은 오더의 납기일을 기준으로 집계합니다.
                </S.DashHint>
              </div>
            </S.ProductionCharts>
          )}
        </Card>

        <Card
        title="부서별 임직원"
        actions={
          <S.DetailLink href="/dashboard/hr">
            인사관리 →
          </S.DetailLink>
        }>
          {!isReady(employees) ? (
            <StateMessage resource={employees}/>
          ) : stats.departments.length ? (
            <S.DepartmentList>
              {stats.departments.map(({name, count}) => (
                <li key={name}>
                  <S.RowHeading>
                    <span>{name}</span>
                    <strong>{count}명</strong>
                  </S.RowHeading>
                  <ProgressBar
                  value={count / stats.staffCount * 100}
                  label={`${name} 인원 비중`}/>
                </li>
              ))}
            </S.DepartmentList>
          ) : (
            <S.DashMessage>등록된 임직원이 없습니다.</S.DashMessage>
          )}
        </Card>
      </S.AnalyticsGrid>

      <S.DetailGrid>
        <Card
        title="납기 확인 오더"
        actions={
          <S.DetailLink href="/dashboard/production">
            전체 보기 →
          </S.DetailLink>
        }>
          {!isReady(orders) ? (
            <StateMessage resource={orders}/>
          ) : stats.dueOrders.length ? (
            <>
              <S.ItemList>
                {stats.dueOrders.slice(0, 5).map((order) => (
                  <li key={order.id}>
                    <S.RowHeading>
                      <strong>{order.productName}</strong>
                      <StatusBadge
                      tone={order.dueDate < stats.todayKey ? "danger" : "warning"}>
                        {order.dueDate < stats.todayKey
                          ? "납기 지연"
                          : "7일 내 납기"}
                      </StatusBadge>
                    </S.RowHeading>
                    <S.DashHint>
                      {order.id} · 납기 {order.dueDate}
                    </S.DashHint>
                  </li>
                ))}
              </S.ItemList>
              <S.DashHint>
                확인 대상 {stats.dueOrders.length}건 · 납기일순 최대 5건
              </S.DashHint>
            </>
          ) : (
            <S.DashMessage>
              지연되거나 7일 내 납기인 미완료 오더가 없습니다.
            </S.DashMessage>
          )}
        </Card>

        <Card
        title="보충 필요 재고"
        actions={
          <S.DetailLink href="/dashboard/inventory">
            전체 보기 →
          </S.DetailLink>
        }>
          {!isReady(items) ? (
            <StateMessage resource={items}/>
          ) : stats.riskItems.length ? (
            <>
              <S.ItemList>
                {stats.riskItems.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <S.RowHeading>
                      <strong>{item.name}</strong>
                      <StatusBadge
                      tone={item.status === "out" ? "danger" : "warning"}>
                        {item.status === "out" ? "품절" : "부족"}
                      </StatusBadge>
                    </S.RowHeading>
                    <S.DashHint>
                      현재 {item.stock.toLocaleString("ko-KR")}
                      {" · "}
                      안전재고 {item.safetyStock.toLocaleString("ko-KR")}
                    </S.DashHint>
                  </li>
                ))}
              </S.ItemList>
              <S.DashHint>
                보충 대상 {stats.riskItems.length}품목 · 품절 우선 최대 5건
              </S.DashHint>
            </>
          ) : (
            <S.DashMessage>보충이 필요한 품목이 없습니다.</S.DashMessage>
          )}
        </Card>

        <Card
        title="7일 내 미완료 일정"
        actions={
          <S.DetailLink href="/dashboard/calendar">
            업무 캘린더 →
          </S.DetailLink>
        }>
          {!isReady(schedules) ? (
            <StateMessage resource={schedules}/>
          ) : stats.agenda.length ? (
            <>
              <S.ItemList>
                {stats.agenda.slice(0, 5).map(({schedule, key}) => (
                  <li key={schedule.id}>
                    <S.RowHeading>
                      <span>{key}</span>
                      <StatusBadge
                      tone={schedule.status === "진행" ? "info" : "warning"}>
                        {schedule.status}
                      </StatusBadge>
                    </S.RowHeading>
                    <S.DashScheduleText>
                      {schedule.content}
                    </S.DashScheduleText>
                  </li>
                ))}
              </S.ItemList>
              <S.DashHint>
                내 미완료 일정 {stats.agenda.length}건 · 날짜순 최대 5건
              </S.DashHint>
            </>
          ) : (
            <S.DashMessage>7일 내 미완료 일정이 없습니다.</S.DashMessage>
          )}
        </Card>
      </S.DetailGrid>
    </PageContainer>
  );
};