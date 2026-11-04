package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductionOrder {
  @Id
  @Column(name = "ORDER_ID", length = 50)
  private String id; // 예: PRD-2023-001 (React 프론트엔드의 문자열 id와 매핑)

  // 생산할 제품 (재고관리 품목). 연결 기능 이전에 등록한 오더는 null
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
    name = "ITEM_ID",
    foreignKey = @ForeignKey(name = "FK_PRODUCTION_ORDER_ITEM")
  )
  private InventoryItem item;

  // 품목명을 복사해 둡니다. (재고관리에서 품목명을 바꾸면 같이 바뀜)
  @Column(name = "PRODUCT_NAME", nullable = false, length = 100)
  private String productName;

  @Column(name = "QUANTITY", nullable = false)
  private Integer quantity;

  @Column(name = "STATUS", length = 20)
  private String status; // planning, progress, completed

  @Column(name = "PROGRESS")
  private Integer progress; // 0 ~ 100

  @Column(name = "DUE_DATE")
  private LocalDate dueDate; // 2023-11-20

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  @Column(updatable = false)
  private LocalDateTime createdAt; // 한국 시간 기준 등록 시각

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  @Column
  private LocalDateTime completedAt; // 미완료 상태는 null

  // 응답에는 품목 전체 대신 품목 코드만 내보냅니다.
  public String getItemId() {
    return item == null ? null : item.getId();
  }
}
