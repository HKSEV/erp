package com.example.demo.dto;

import com.example.demo.entity.InventoryItem;

// 입고·출고 등록 결과: 바뀐 품목(목록 갱신용)과 새로 남긴 이력
public record StockMovementResultDto(
	InventoryItem item,
	StockMovementResponseDto movement
) {
}
