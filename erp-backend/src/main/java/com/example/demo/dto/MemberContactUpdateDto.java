package com.example.demo.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberContactUpdateDto {
	@Size(max = 20, message = "휴대폰 번호는 20자 이내로 입력해 주세요.")
	private String tel;

	@Size(max = 255, message = "주소는 255자 이내로 입력해 주세요.")
	private String address;

	@Size(max = 255, message = "상세 주소는 255자 이내로 입력해 주세요.")
	private String detailAddress;
}