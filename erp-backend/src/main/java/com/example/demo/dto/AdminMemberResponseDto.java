package com.example.demo.dto;

import com.example.demo.entity.Member;
import com.example.demo.entity.MemberRole;

// 시스템관리 > 사용자 권한 관리 목록 한 줄 (비밀번호·연락처는 내보내지 않음)
public record AdminMemberResponseDto(
	Long id,
	String name,
	String email,
	String department,
	String position,
	MemberRole role,
	boolean active,
	String createdAt
) {
	public static AdminMemberResponseDto from(Member member) {
		return new AdminMemberResponseDto(
			member.getId(),
			text(member.getLastName()) + text(member.getFirstName()),
			member.getEmail(),
			member.getDepartment(),
			member.getPosition(),
			member.getRole(),
			member.isActive(),
			member.getCreatedAt() == null
				? ""
				: member.getCreatedAt().toLocalDate().toString()
		);
	}

	private static String text(String value) {
		return value == null ? "" : value;
	}
}
