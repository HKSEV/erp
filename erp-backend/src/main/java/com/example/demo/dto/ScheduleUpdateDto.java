package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleUpdateDto {
	@NotBlank(message = "일정 내용을 입력해 주세요.")
	@Size(
		max = 1000,
		message = "일정 내용은 1000자 이내로 입력해 주세요."
	)
	private String content;

	@NotBlank(message = "진행 상태를 선택해 주세요.")
	@Pattern(
		regexp = "대기|진행|완료",
		message = "진행 상태는 대기, 진행, 완료 중 하나여야 합니다."
	)
	private String status;
}