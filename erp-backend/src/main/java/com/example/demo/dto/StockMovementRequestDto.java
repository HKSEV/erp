package com.example.demo.dto;

import jakarta.validation.constraints.*;

// 직접 등록하는 입고·출고 (기초 재고·생산 입고는 서버가 자동으로 기록)
public record StockMovementRequestDto(
	@NotBlank(message = "입고 또는 출고를 선택해 주세요.")
	@Pattern(regexp = "IN|OUT", message = "입고 또는 출고를 선택해 주세요.")
	String type,

	@NotNull(message = "수량을 입력해 주세요.")
	@Min(value = 1, message = "수량은 1 이상이어야 합니다.")
	Integer quantity,

	@Size(max = 200, message = "메모는 200자 이내로 입력해 주세요.")
	String memo
) {
}
