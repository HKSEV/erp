package com.example.demo.dto;

import jakarta.validation.constraints.Size;

public record GoogleAuthorizeRequestDto(
	boolean signup,
	@Size(max = 50) String firstName,
	@Size(max = 50) String lastName
) {
}