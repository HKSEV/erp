// ERP 권한 (직급과는 별개)
export type UserRole = "ADMIN" | "MANAGER" | "USER";

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "관리자",
  MANAGER: "매니저",
  USER: "일반",
};

// 회원 계정: 사용자 권한 관리 목록 (GET /api/admin/members, 비밀번호는 포함하지 않음)
// 부서·직급은 회원가입 때 입력하지 않으면 비어 있을 수 있음
export interface MemberAccount {
  id: number;
  name: string;
  email: string;
  department: string | null;
  position: string | null;   // 직급
  role: UserRole;
  active: boolean;      // false: 정지된 계정 (로그인 불가)
  createdAt: string;
};

// 내 정보: 마이페이지 (GET /api/members/me 예정)
export interface MemberProfile
  extends Omit<MemberAccount, "department" | "position"> {
  department: string | null;
  position: string | null;
  tel: string;
  address: string;
  detailAddress: string;
};