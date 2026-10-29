import type { Holiday } from "@/app/types/Holiday";
import KoreanLunarCalendar from "korean-lunar-calendar";

type SolarDate = {
  month: number;
  day: number;
};

type LunarDates = {
  seollal: SolarDate;
  chuseok: SolarDate;
  buddhaBirthday: SolarDate;
};

const lunarCache = new Map<number, LunarDates>();
const holidayCache = new Map<string, Holiday[]>();
const FIXED_HOLIDAYS: Partial<Record<number, readonly Holiday[]>> = {
  1: [
    {date: 1, name: "신정", icon: "🎆"},
  ],
  3: [
    {date: 1, name: "삼일절", icon: "🇰🇷"},
  ],
  5: [
    {date: 1, name: "노동절", icon: "👷"},
    {date: 5, name: "어린이날", icon: "🧸"},
  ],
  6: [
    {date: 6, name: "현충일", icon: "🥀"},
  ],
  7: [
    {date: 17, name: "제헌절", icon: "📜"},
  ],
  8: [
    {date: 15, name: "광복절", icon: "🇰🇷"},
  ],
  10: [
    {date: 3, name: "개천절", icon: "☀️"},
    {date: 9, name: "한글날", icon: "✍️"},
  ],
  12: [
    {date: 25, name: "성탄절", icon: "🎄"},
  ],
};

function getLunarDates(year: number): LunarDates {
  const cached = lunarCache.get(year);
  if (cached)
    return cached;

  const calendar = new KoreanLunarCalendar();

  calendar.setLunarDate(year, 1, 1, false);
  const seollal = {...calendar.getSolarCalendar()};

  calendar.setLunarDate(year, 8, 15, false);
  const chuseok = {...calendar.getSolarCalendar()};

  calendar.setLunarDate(year, 4, 8, false);
  const buddhaBirthday = {...calendar.getSolarCalendar()};

  const result = {seollal, chuseok, buddhaBirthday};
  lunarCache.set(year, result);

  return result;
};

export default function getHolidays(year: number, month: number): Holiday[] {
  const key = `${year}-${month}`;
  const cached = holidayCache.get(key);
  if (cached)
    return cached;

  const {seollal, chuseok, buddhaBirthday} = getLunarDates(year);
  const holidays: Holiday[] = [];

  if (month === seollal.month) {
    holidays.push(
      {date: seollal.day - 1, name: "설날 연휴", icon: "🎊"},
      {date: seollal.day, name: "설날", icon: "🎊"},
      {date: seollal.day + 1, name: "설날 연휴", icon: "🎊"},
    );
  };

  if (month === chuseok.month) {
    holidays.push(
      {date: chuseok.day - 1, name: "추석 연휴", icon: "🌕"},
      {date: chuseok.day, name: "추석", icon: "🌕"},
      {date: chuseok.day + 1, name: "추석 연휴", icon: "🌕"},
    );
  };

  if (month === buddhaBirthday.month) {
    holidays.push({
      date: buddhaBirthday.day,
      name: "석가탄신일",
      icon: "🪷",
    });
  };

  holidays.push(...(FIXED_HOLIDAYS[month] ?? []));
  holidayCache.set(key, holidays);

  return holidays;
};

// export const fetchHolidays = async (year: number, month: number): Promise<Holiday[]> => {
//   const calendar = new KoreanLunarCalendar();
//   const holidays: Holiday[] = [];
//   calendar.setLunarDate(year, 1, 1, false);
//   const seollal = calendar.getSolarCalendar();
//   calendar.setLunarDate(year, 8, 15, false);
//   const chuseok = calendar.getSolarCalendar();
//   calendar.setLunarDate(year, 4, 8, false);
//   const buddhaBirthday = calendar.getSolarCalendar();

//   if (month === seollal.month)
//     holidays.push(
//       {date: seollal.day-1, name: "설날 연휴", icon: "🎊"},
//       {date: seollal.day, name: "설날", icon: "🎊"},
//       {date: seollal.day+1, name: "설날 연휴", icon: "🎊"},
//     );

//   if (month === chuseok.month)
//     holidays.push(
//       {date: chuseok.day-1, name: "추석 연휴", icon: "🌕"},
//       {date: chuseok.day, name: "추석", icon: "🌕"},
//       {date: chuseok.day+1, name: "추석 연휴", icon: "🌕"},
//     );

//   if (month === buddhaBirthday.month)
//     holidays.push(
//       {date: buddhaBirthday.day, name: "석가탄신일", icon: "🪷"},
//     );

//   if (month === 1)
//     holidays.push(
//       {date: 1, name: "신정", icon: "🎆"},
//     );

//   if (month === 3)
//     holidays.push(
//       {date: 1, name: "삼일절", icon: "🇰🇷"},
//     );

//   if (month === 5)
//     holidays.push(
//       {date: 1, name: "노동절", icon: "👷"},
//       {date: 5, name: "어린이날", icon: "🧸"},
//     );

//   if (month === 6)
//     holidays.push(
//       {date: 6, name: "현충일", icon: "🥀"},
//     );

//   if (month === 7)
//     holidays.push(
//       {date: 17, name: "제헌절", icon: "📜"},
//     );

//   if (month === 8)
//     holidays.push(
//       {date: 15, name: "광복절", icon: "🇰🇷"},
//     );

//   if (month === 10)
//     holidays.push(
//       {date: 3, name: "개천절", icon: "☀️"},
//       {date: 9, name: "한글날", icon: "✍️"},
//     );

//   if (month === 12)
//     holidays.push(
//       {date: 25, name: "성탄절", icon: "🎄"},
//     );
  
//   return holidays;
// };