package com.example.demo.dto;

import jakarta.validation.constraints.Pattern;

// 관리자가 회원의 부서·직급 변경 (보낸 값만 변경, null은 그대로 유지)
// 목록을 바꾸면 프론트 app/types/Organization.ts의 DEPARTMENTS·POSITIONS도 같이 변경
public record MemberProfileUpdateDto(
	@Pattern(
		regexp = "생산팀|자재팀|영업팀|인사팀|개발팀|디자인팀",
		message = "올바른 부서를 선택해 주세요."
	)
	String department,

	@Pattern(
		regexp = "사원|주임|대리|과장|차장|부장",
		message = "올바른 직급을 선택해 주세요."
	)
	String position
) {
}
