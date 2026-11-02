package com.example.demo.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record EmployeeRequestDto(
	@NotBlank(message = "이름을 입력해 주세요.")
	@Size(max = 50, message = "이름은 50자 이내로 입력해 주세요.")
	String name,

	// 부서·직급 목록을 바꾸면 프론트 app/types/Organization.ts도 같이 변경
	@NotBlank(message = "부서를 선택해 주세요.")
	@Pattern(
		regexp = "생산팀|자재팀|영업팀|인사팀|개발팀|디자인팀",
		message = "올바른 부서를 선택해 주세요."
	)
	String department,

	@NotBlank(message = "직급을 선택해 주세요.")
	@Pattern(
		regexp = "사원|주임|대리|과장|차장|부장",
		message = "올바른 직급을 선택해 주세요."
	)
	String position,

	@NotBlank(message = "재직 상태를 선택해 주세요.")
	@Pattern(
		regexp = "active|leave|resigned",
		message = "올바른 재직 상태를 선택해 주세요."
	)
	String status,

	@NotNull(message = "입사일을 선택해 주세요.")
	LocalDate joinDate
) {
}
