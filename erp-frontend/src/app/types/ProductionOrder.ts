export interface ProductionOrder {
  id: string;
  itemId: string | null;  // 재고관리 제품 품목 코드 (연결 기능 이전 오더는 null)
  productName: string;    // 품목명 (서버가 품목에서 복사)
  quantity: number;
  status: "planning" | "progress" | "completed";
  progress: number;
  dueDate: string;
  createdAt: string | null;
  completedAt: string | null;
}