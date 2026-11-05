package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record KakaoLoginRequestDto(
	@NotBlank @Size(max = 2048) String code,
	@NotBlank @Pattern(regexp = "[a-f0-9]{64}") String state,
	boolean signup,
	@Size(max = 50) String firstName,
	@Size(max = 50) String lastName
) {}