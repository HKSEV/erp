import type { ProductionOrder } from "@/app/types/ProductionOrder";
import type { InventoryItem } from "@/app/types/InventoryItem";
import type { Employee } from "@/app/types/Employee";
import type { Schedule } from "@/app/types/Schedule";

export const dateKey = (date: Date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, "0"),
  String(date.getDate()).padStart(2, "0"),
].join("-");

// 오늘을 포함한 7일이 다음 달까지 이어지면 두 달을 조회
export function getScheduleMonths(today: Date) {
  const end = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 6,
  );
  const months = [{
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  }];

  if (
    today.getFullYear() !== end.getFullYear()
    || today.getMonth() !== end.getMonth()
  )
    months.push({
      year: end.getFullYear(),
      month: end.getMonth() + 1,
    });

  return months;
}

export function getDashboardStats(
  orders: ProductionOrder[],
  items: InventoryItem[],
  employees: Employee[],
  schedules: Schedule[],
  today: Date,
) {
  const todayKey = dateKey(today);
  const endKey = dateKey(new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 6,
  ));

  const openOrders = orders.filter(
    (order) => order.status !== "completed",
  );

  const statusCounts = {
    planning: orders.filter((order) => order.status === "planning").length,
    progress: orders.filter((order) => order.status === "progress").length,
    completed: orders.filter((order) => order.status === "completed").length,
  };

  const dueOrders = openOrders
    .filter((order) => order.dueDate && order.dueDate <= endKey)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const overdueCount = openOrders.filter(
    (order) => order.dueDate && order.dueDate < todayKey,
  ).length;

  const monthlyDue = Array.from({length: 6}, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const key = dateKey(date).slice(0, 7);

    return {
      key,
      label: `${date.getMonth() + 1}월`,
      count: openOrders.filter(
        (order) => order.dueDate?.startsWith(key),
      ).length,
    };
  });

  const riskItems = items
    .filter((item) => item.status !== "normal")
    .sort((a, b) =>
      Number(b.status === "out") - Number(a.status === "out")
      || (b.safetyStock - b.stock) - (a.safetyStock - a.stock),
    );

  const staff = employees.filter(
    (employee) => employee.status !== "resigned",
  );

  const departmentMap = new Map<string, number>();

  staff.forEach((employee) => {
    const name = employee.department?.trim() || "미지정";
    departmentMap.set(name, (departmentMap.get(name) ?? 0) + 1);
  });

  const departments = [...departmentMap]
    .map(([name, count]) => ({name, count}))
    .sort((a, b) =>
      b.count - a.count || a.name.localeCompare(b.name, "ko"),
    );

  const datedSchedules = schedules.map((schedule) => ({
    schedule,
    key: [
      schedule.year,
      String(schedule.month).padStart(2, "0"),
      String(schedule.date).padStart(2, "0"),
    ].join("-"),
  }));

  const todaySchedules = datedSchedules.filter(
    (item) => item.key === todayKey,
  );

  const agenda = datedSchedules
    .filter((item) =>
      item.key >= todayKey
      && item.key <= endKey
      && item.schedule.status !== "완료",
    )
    .sort((a, b) =>
      a.key.localeCompare(b.key)
      || String(a.schedule.id).localeCompare(String(b.schedule.id)),
    );

  return {
    todayKey,
    statusCounts,
    monthlyDue,
    dueOrders,
    overdueCount,
    openOrderCount: openOrders.length,
    inventoryValue: items.reduce(
      (sum, item) => sum + item.stock * item.unitPrice,
      0,
    ),
    riskItems,
    departments,
    staffCount: staff.length,
    leaveCount: staff.filter(
      (employee) => employee.status === "leave",
    ).length,
    todayCount: todaySchedules.length,
    todayPendingCount: todaySchedules.filter(
      (item) => item.schedule.status !== "완료",
    ).length,
    agenda,
  };
}