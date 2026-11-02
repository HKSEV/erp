package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public record MemberActiveUpdateDto(
	@NotNull(message = "계정 사용 여부를 선택해 주세요.")
	Boolean active
) {
}
