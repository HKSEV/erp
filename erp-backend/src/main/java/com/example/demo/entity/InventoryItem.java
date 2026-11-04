package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItem {
  @Id
  @Column(name = "ITEM_ID", length = 50)
  private String id; // 예: INV-1001

  @Column(name = "ITEM_NAME", nullable = false, length = 100)
  private String name;

  @Column(name = "CATEGORY", nullable = false, length = 20)
  private String category; // 원자재, 부품, 포장재, 소모품

  @Column(name = "STOCK", nullable = false)
  private Integer stock; // 현재고

  @Column(name = "SAFETY_STOCK", nullable = false)
  private Integer safetyStock; // 적정재고: 현재고가 이보다 적으면 재고부족

  @Column(name = "UNIT_PRICE", nullable = false)
  private Long unitPrice; // 단가 (원)

  @Column(name = "STATUS", length = 20)
  private String status; // normal, low, out (현재고·적정재고로 계산)

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  @Column(name = "CREATED_AT", updatable = false)
  private LocalDateTime createdAt; // 한국 시간 기준 등록 시각
}
