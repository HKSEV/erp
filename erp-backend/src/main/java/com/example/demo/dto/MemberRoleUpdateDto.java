package com.example.demo.dto;

import com.example.demo.entity.MemberRole;
import jakarta.validation.constraints.NotNull;

public record MemberRoleUpdateDto(
	@NotNull(message = "변경할 역할을 선택해 주세요.")
	MemberRole role
) {
}
