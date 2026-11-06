package com.example.demo.dto;

public record GoogleAuthorizeResponseDto(
	String authorizationUrl,
	String state,
	String flowToken
) {
}