import type { Department, Position } from "./Organization";

export interface Employee {
  id: string;
  name: string;
  department: Department;
  position: Position;
  status: "active" | "leave" | "resigned";
  joinDate: string;
}
