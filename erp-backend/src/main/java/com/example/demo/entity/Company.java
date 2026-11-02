package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

// 한 회사만 쓰는 ERP라 회사 정보는 1행만 저장합니다.
@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
  @Id
  @Column(name = "COMPANY_ID")
  private Long id; // 항상 1

  @Column(name = "COMPANY_NAME", nullable = false, length = 100)
  private String name;

  @Column(name = "BUSINESS_NUMBER", nullable = false, length = 12)
  private String businessNumber; // 000-00-00000

  @Column(name = "EMAIL", nullable = false, length = 100)
  private String email; // 대표 이메일
}
