package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record GoogleLoginRequestDto(
	@NotBlank @Size(max = 4096) String code,
	@NotBlank @Pattern(regexp = "[a-f0-9]{64}") String state,
	@NotBlank @Pattern(regexp = "[a-f0-9]{64}") String flowToken
) {
}