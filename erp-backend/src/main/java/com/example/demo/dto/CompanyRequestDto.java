package com.example.demo.dto;

import jakarta.validation.constraints.*;

public record CompanyRequestDto(
	@NotBlank(message = "회사명을 입력해 주세요.")
	@Size(max = 100, message = "회사명은 100자 이내로 입력해 주세요.")
	String name,

	@NotBlank(message = "사업자 등록번호를 입력해 주세요.")
	@Pattern(
		regexp = "\\d{3}-\\d{2}-\\d{5}",
		message = "사업자 등록번호는 000-00-00000 형식으로 입력해 주세요."
	)
	String businessNumber,

	@NotBlank(message = "대표 이메일을 입력해 주세요.")
	@Email(message = "올바른 이메일 형식으로 입력해 주세요.")
	@Size(max = 100, message = "대표 이메일은 100자 이내로 입력해 주세요.")
	String email
) {
}
