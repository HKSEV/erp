package com.example.demo.entity;

// 재고 변동 구분 (수량은 항상 양수로 저장하고, 늘어나는지 줄어드는지는 구분으로 정합니다)
public enum StockMovementType {
	INITIAL,    // 기초 재고: 품목을 등록할 때 입력한 현재고
	IN,         // 입고 (+)
	OUT,        // 출고 (-)
	PRODUCTION; // 생산 입고 (+): 생산 오더가 생산완료로 바뀔 때 자동 기록

	public boolean decreases() {
		return this == OUT;
	}
}
