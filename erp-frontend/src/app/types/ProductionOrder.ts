export interface ProductionOrder {
  id: string;
  productName: string;
  quantity: number;
  status: "planning" | "progress" | "completed";
  progress: number;
  dueDate: string;
}