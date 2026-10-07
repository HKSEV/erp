import { Holiday } from "@/app/types/Holiday";
import KoreanLunarCalendar from 'korean-lunar-calendar';

export const fetchHolidays = async (year: number, month: number): Promise<Holiday[]> => {
  const calendar = new KoreanLunarCalendar();
  calendar.setLunarDate(year, 1, 1, false);
  const seollal = calendar.getSolarCalendar();
  calendar.setLunarDate(year, 8, 15, false);
  const chuseok = calendar.getSolarCalendar();

  if (month === seollal.month)
    return [
      {date: seollal.day-1, name: "설날 연휴"},
      {date: seollal.day, name: "설날"},
      {date: seollal.day+1, name: "설날 연휴"},
    ];

  if (month === chuseok.month)
    return [
      {date: chuseok.day-1, name: "추석 연휴"},
      {date: chuseok.day, name: "추석"},
      {date: chuseok.day+1, name: "추석 연휴"},
    ];

  if (month === 12)
    return [
      {date: 25, name: "성탄절"},
    ];
  
  return [];
};