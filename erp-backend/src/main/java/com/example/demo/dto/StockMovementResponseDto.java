package com.example.demo.dto;

import com.example.demo.entity.Member;
import com.example.demo.entity.StockMovement;
import com.example.demo.entity.StockMovementType;

import java.time.format.DateTimeFormatter;

// 재고 입출고 이력 한 줄
public record StockMovementResponseDto(
	Long id,
	String itemId,
	StockMovementType type,
	int quantity,
	int stockAfter,
	String orderId,
	String memo,
	String memberName,
	String createdAt
) {
	private static final DateTimeFormatter TIME_FORMAT =
		DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

	public static StockMovementResponseDto from(StockMovement movement) {
		Member member = movement.getMember();

		return new StockMovementResponseDto(
			movement.getId(),
			movement.getItem().getId(),
			movement.getType(),
			movement.getQuantity(),
			movement.getStockAfter(),
			movement.getOrderId(),
			movement.getMemo(),
			member == null ? null : text(member.getLastName()) + text(member.getFirstName()),
			movement.getCreatedAt().format(TIME_FORMAT)
		);
	}

	private static String text(String value) {
		return value == null ? "" : value;
	}
}
