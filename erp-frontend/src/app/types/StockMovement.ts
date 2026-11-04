import type { InventoryItem } from "./InventoryItem";

// 재고 변동 구분 (백엔드 StockMovementType과 같음)
export type StockMovementType = "INITIAL" | "IN" | "OUT" | "PRODUCTION";

export const STOCK_MOVEMENT_LABEL: Record<StockMovementType, string> = {
  INITIAL: "기초 재고",
  IN: "입고",
  OUT: "출고",
  PRODUCTION: "생산 입고",
};

// 재고 입출고 이력 한 줄 (GET /api/inventory/items/{id}/movements)
export interface StockMovement {
  id: number;
  itemId: string;
  type: StockMovementType;
  quantity: number;     // 항상 양수, 늘었는지 줄었는지는 type으로 판단
  stockAfter: number;   // 처리 후 현재고
  orderId: string | null;
  memo: string | null;
  memberName: string | null;
  createdAt: string;    // yyyy-MM-dd HH:mm:ss (한국 시간)
}

// 입고·출고 등록 결과 (POST /api/inventory/items/{id}/movements)
export interface StockMovementResult {
  item: InventoryItem;
  movement: StockMovement;
}
