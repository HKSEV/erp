package com.example.demo.dto;

import jakarta.validation.constraints.*;

public record InventoryItemRequestDto(
	@NotBlank(message = "품목명을 입력해 주세요.")
	@Size(max = 100, message = "품목명은 100자 이내로 입력해 주세요.")
	String name,

	// 목록을 바꾸면 프론트 app/types/InventoryItem.ts의 INVENTORY_CATEGORIES도 같이 변경
	@NotBlank(message = "분류를 선택해 주세요.")
	@Pattern(
		regexp = "원자재|부품|포장재|소모품",
		message = "올바른 분류를 선택해 주세요."
	)
	String category,

	@NotNull(message = "현재고를 입력해 주세요.")
	@Min(value = 0, message = "현재고는 0 이상이어야 합니다.")
	Integer stock,

	@NotNull(message = "적정재고를 입력해 주세요.")
	@Min(value = 0, message = "적정재고는 0 이상이어야 합니다.")
	Integer safetyStock,

	@NotNull(message = "단가를 입력해 주세요.")
	@Min(value = 0, message = "단가는 0 이상이어야 합니다.")
	@Max(value = 999_999_999_999L, message = "단가는 9,999억 원 이하로 입력해 주세요.")
	Long unitPrice
) {
}
