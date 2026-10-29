import type { Holiday } from "@/app/types/Holiday";
import { Temporal } from "@js-temporal/polyfill";
import KoreanLunarCalendar from "korean-lunar-calendar";

type SubstituteRule = "none" | "sunday" | "weekend";
type HolidayKind = "regular" | "extra" | "company";

type DatedHoliday = {
  date: Temporal.PlainDate;
  name: string;
  icon: string;
  rule: SubstituteRule;
  kind: HolidayKind;
};

// 공식 확정된 선거일·임시공휴일을 등록합니다.
// 전체 과거 이력이 아니므로 필요한 연도의 날짜를 추가하세요.
const EXTRA_HOLIDAYS = [
  {date: "2025-01-27", name: "임시공휴일", icon: "📌"},
  {date: "2025-06-03", name: "대통령선거일", icon: "🗳️"},
  {date: "2026-06-03", name: "전국동시지방선거일", icon: "🗳️"},
];

const baseCache = new Map<number, DatedHoliday[]>();
const yearCache = new Map<number, Holiday[][]>();

function getBaseHolidays(year: number): DatedHoliday[] {
  const cached = baseCache.get(year);
  if (cached)
    return cached;

  const holidays: DatedHoliday[] = [];

  const add = (
    date: Temporal.PlainDate,
    name: string,
    icon: string,
    rule: SubstituteRule = "none",
    kind: HolidayKind = "regular",
  ) => holidays.push({date, name, icon, rule, kind});

  const addFixed = (
    month: number,
    day: number,
    name: string,
    icon: string,
    substituteSince?: string,
    kind: HolidayKind = "regular",
  ) => {
    const date = Temporal.PlainDate.from({ year, month, day });
    const rule =
      substituteSince && date.toString() >= substituteSince
        ? "weekend"
        : "none";

    add(date, name, icon, rule, kind);
  };

  addFixed(1, 1, "신정", "🎆");
  addFixed(3, 1, "삼일절", "🇰🇷", "2021-08-04");
  addFixed(5, 5, "어린이날", "🧸", "2013-11-05");
  addFixed(6, 6, "현충일", "🥀");
  addFixed(8, 15, "광복절", "🇰🇷", "2021-08-04");
  addFixed(10, 3, "개천절", "☀️", "2021-08-04");
  addFixed(10, 9, "한글날", "✍️", "2021-08-04");
  addFixed(12, 25, "성탄절", "🎄", "2023-05-04");

  if (year >= 2026) {
    addFixed(5, 1, "노동절", "👷", "2026-05-01");
    addFixed(7, 17, "제헌절", "📜", "2026-05-11");
  } else {
    // 기존 ERP의 근로자 휴일 표시는 유지합니다.
    // 관공서 공휴일 중복·대체 계산에서는 제외합니다.
    addFixed(
      5, 1, "근로자의 날", "👷", undefined, "company",
    );
  }

  const calendar = new KoreanLunarCalendar();

  const toSolar = (month: number, day: number) => {
    // false: 평달. 윤달의 같은 날짜는 추가하지 않습니다.
    if (!calendar.setLunarDate(year, month, day, false))
      throw new RangeError("음력 변환 지원 범위를 벗어났습니다.");
    const solar = calendar.getSolarCalendar();

    return Temporal.PlainDate.from({
      year: solar.year,
      month: solar.month,
      day: solar.day,
    });
  };

  const addLunarPeriod = (
    center: Temporal.PlainDate,
    name: string,
    icon: string,
  ) => {
    for (const offset of [-1, 0, 1]) {
      add(
        center.add({ days: offset }),
        offset === 0 ? name : name + " 연휴",
        icon,
        year >= 2014 ? "sunday" : "none",
      );
    }
  };

  // 날짜 연산으로 전날·다음 날을 구하므로 월 경계도 처리됩니다.
  addLunarPeriod(toSolar(1, 1), "설날", "🎊");
  addLunarPeriod(toSolar(8, 15), "추석", "🌕");

  const buddha = toSolar(4, 8);

  add(
    buddha,
    "부처님오신날",
    "🪷",
    buddha.toString() >= "2023-05-04" ? "weekend" : "none",
  );

  for (const holiday of EXTRA_HOLIDAYS) {
    if (holiday.date.startsWith(year + "-")) {
      add(
        Temporal.PlainDate.from(holiday.date),
        holiday.name,
        holiday.icon,
        "none",
        "extra",
      );
    };
  };

  baseCache.set(year, holidays);
  return holidays;
}

function buildYearHolidays(year: number): Holiday[][] {
  // 연도 경계를 넘는 대체일과 공휴일 충돌도 함께 계산합니다.
  const sourceYears = [year - 1, year, year + 1]
    .filter((value) => value >= 1000 && value <= 2050);

  const base = sourceYears.flatMap(getBaseHolidays);
  const publicByDate = new Map<string, DatedHoliday[]>();

  for (const holiday of base) {
    if (holiday.kind === "company")
      continue;

    const key = holiday.date.toString();
    const entries = publicByDate.get(key) ?? [];

    entries.push(holiday);
    publicByDate.set(key, entries);
  }

  // 같은 원래 날짜에서 발생한 중복은 요청 하나로 묶습니다.
  const requests = new Map<string, DatedHoliday[]>();

  for (const [key, entries] of publicByDate) {
    // 규정 제2조제2호~제10호에 해당하는 공휴일끼리 비교합니다.
    const regular = entries.filter(
      (item) => item.kind === "regular",
    );
    const dayOfWeek = entries[0].date.dayOfWeek;

    const causes = regular.filter((item) => {
      if (item.rule === "none")
        return false;

      const weekendOverlap =
        item.rule === "weekend" && dayOfWeek >= 6;

      const sundayOverlap =
        item.rule === "sunday" && dayOfWeek === 7;

      const holidayOverlap =
        dayOfWeek <= 5 && regular.length > 1;

      return weekendOverlap || sundayOverlap || holidayOverlap;
    });

    if (causes.length > 0)
      requests.set(key, causes);
  };

  // 선거일·임시공휴일도 대체일 배정 시 건너뛰도록 포함합니다.
  const occupied = new Set(publicByDate.keys());
  const result = [...base];

  const ordered = [...requests.entries()]
    .sort(([left], [right]) => left.localeCompare(right));

  for (const [key, causes] of ordered) {
    let date = Temporal.PlainDate.from(key).add({ days: 1 });

    // 주말·기존 공휴일·먼저 배정한 대체공휴일을 건너뜁니다.
    while (date.dayOfWeek >= 6 || occupied.has(date.toString())) {
      date = date.add({ days: 1 });
    }

    occupied.add(date.toString());

    const names = [...new Set(
      causes.map((item) => item.name.replace(" 연휴", "")),
    )].join("·");

    result.push({
      date,
      name: "대체공휴일 (" + names + ")",
      icon: "🔄",
      rule: "none",
      kind: "extra",
    });
  };

  const months = Array.from(
    { length: 12 },
    () => [] as Holiday[],
  );

  result.sort((left, right) =>
    Temporal.PlainDate.compare(left.date, right.date),
  );

  for (const holiday of result) {
    if (holiday.date.year !== year)
      continue;

    months[holiday.date.month - 1].push({
      date: holiday.date.day,
      name: holiday.name,
      icon: holiday.icon,
    });
  }

  return months;
};

export default function getHolidays(
  year: number,
  month: number,
): Holiday[] {
  if (!Number.isInteger(year) || year < 1000 || year > 2050)
    throw new RangeError("음력 변환은 1000~2050년을 지원합니다.");

  if (!Number.isInteger(month) || month < 1 || month > 12)
    throw new RangeError("월은 1~12 사이여야 합니다.");

  let months = yearCache.get(year);

  if (!months) {
    months = buildYearHolidays(year);
    yearCache.set(year, months);
  };

  return months[month - 1];
};
