import type { Department, Position } from "./Organization";

// ERP 권한 (직급과는 별개)
export type UserRole = "ADMIN" | "MANAGER" | "USER";

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "관리자",
  MANAGER: "매니저",
  USER: "일반",
};

// 회원 계정: 사용자 권한 관리 목록 (백엔드 응답에 비밀번호는 포함하지 않음)
export interface MemberAccount {
  id: number;
  name: string;
  email: string;
  department: Department;
  position: Position;   // 직급
  role: UserRole;
  active: boolean;      // false: 정지된 계정 (로그인 불가)
  createdAt: string;
};

// 내 정보: 마이페이지 (GET /api/members/me 예정)
export interface MemberProfile extends MemberAccount {
  tel: string;
  address: string;
  detailAddress: string;
};
