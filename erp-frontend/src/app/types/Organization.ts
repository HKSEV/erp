// 회사 조직 정보: 인사관리, 사용자 권한 관리, 회원가입에서 같은 목록 사용
// 부서 = 소속 팀, 직급 = 회사 안의 등급 (ERP 권한인 역할(role)과는 별개)
export const DEPARTMENTS = ["생산팀", "자재팀", "영업팀", "인사팀", "개발팀", "디자인팀"] as const;
export const POSITIONS = ["사원", "주임", "대리", "과장", "차장", "부장"] as const;

export type Department = typeof DEPARTMENTS[number];
export type Position = typeof POSITIONS[number];
