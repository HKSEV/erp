export interface Schedule {
  id: string;
  year: number;
  month: number;
  date: number;
  content: string;
  status: "대기" | "진행" | "완료";
  createdAt: string;
};
