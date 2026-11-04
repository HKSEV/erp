package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberEmployeeLinkDto(
	@NotBlank(message = "연결할 직원을 선택해 주세요.")
	@Size(max = 50, message = "사번을 확인해 주세요.")
	String employeeId
) {
}