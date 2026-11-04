package com.example.demo.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record ProductionOrderRequestDto(
	@NotBlank(message = "제품명을 입력해 주세요.")
	@Size(max = 100, message = "제품명은 100자 이내로 입력해 주세요.")
	String productName,

	@NotNull(message = "수량을 입력해 주세요.")
	@Min(value = 1, message = "수량은 1 이상이어야 합니다.")
	Integer quantity,

	@NotBlank(message = "상태를 선택해 주세요.")
	@Pattern(
		regexp = "planning|progress|completed",
		message = "올바른 생산 상태를 선택해 주세요."
	)
	String status,

	// 생산중일 때만 사용 (생산대기는 0, 생산완료는 100으로 고정)
	@Min(value = 0, message = "진행률은 0~99 사이로 입력해 주세요.")
	@Max(value = 99, message = "진행률은 0~99 사이로 입력해 주세요.")
	Integer progress,

	@NotNull(message = "납기일을 선택해 주세요.")
	LocalDate dueDate
) {
}