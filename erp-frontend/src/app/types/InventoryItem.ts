// 목록을 바꾸면 백엔드 InventoryItemRequestDto의 @Pattern도 같이 변경
export const INVENTORY_CATEGORIES = ["원자재", "부품", "포장재", "소모품"] as const;
export type InventoryCategory = typeof INVENTORY_CATEGORIES[number];

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  stock: number;
  safetyStock: number;  // 적정재고: 현재고가 이보다 적으면 재고부족
  unitPrice: number;
  status: "normal" | "low" | "out";  // 백엔드가 현재고·적정재고로 계산
}
