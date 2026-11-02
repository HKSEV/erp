package com.example.demo.dto;

import com.example.demo.entity.Member;
import com.example.demo.entity.MemberRole;

public record MemberProfileResponseDto(
	Long id,
	String name,
	String email,
	String department,
	String position,
	MemberRole role,
	boolean active,
	String createdAt,
	String tel,
	String address,
	String detailAddress
) {
	public static MemberProfileResponseDto from(Member member) {
		return new MemberProfileResponseDto(
			member.getId(),
			text(member.getLastName()) + text(member.getFirstName()),
			member.getEmail(),
			member.getDepartment(),
			member.getPosition(),
			member.getRole(),
			member.isActive(),
			member.getCreatedAt() == null
				? ""
				: member.getCreatedAt().toLocalDate().toString(),
			text(member.getTel()),
			text(member.getAddress()),
			text(member.getDetailAddress())
		);
	}

	private static String text(String value) {
		return value == null ? "" : value;
	}
}