package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// 재고 입출고 이력: 품목의 현재고가 바뀔 때마다 한 줄씩 남깁니다. (수정·삭제하지 않음)
@Entity
@Table(
  name = "STOCK_MOVEMENT",
  indexes = {
    @Index(
      name = "IDX_STOCK_MOVEMENT_ITEM",
      columnList = "ITEM_ID,MOVEMENT_ID"
    )
  }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class StockMovement {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "MOVEMENT_ID")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(
    name = "ITEM_ID",
    nullable = false,
    foreignKey = @ForeignKey(name = "FK_STOCK_MOVEMENT_ITEM")
  )
  private InventoryItem item;

  @Enumerated(EnumType.STRING)
  @Column(name = "MOVEMENT_TYPE", nullable = false, length = 20)
  private StockMovementType type;

  @Column(name = "QUANTITY", nullable = false)
  private Integer quantity; // 변동 수량 (항상 양수)

  @Column(name = "STOCK_AFTER", nullable = false)
  private Integer stockAfter; // 처리 후 현재고

  @Column(name = "ORDER_ID", length = 50)
  private String orderId; // 생산 입고일 때 생산 오더 번호

  @Column(name = "MEMO", length = 200)
  private String memo;

  // 처리자 (로그인한 회원)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
    name = "MEMBER_ID",
    foreignKey = @ForeignKey(name = "FK_STOCK_MOVEMENT_MEMBER")
  )
  private Member member;

  @Column(name = "CREATED_AT", nullable = false, updatable = false)
  private LocalDateTime createdAt; // 한국 시간 기준 처리 시각
}
