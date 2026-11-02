package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {
  @Id
  @Column(name = "EMP_ID", length = 50)
  private String id; // 예: EMP-0001

  @Column(name = "EMP_NAME", nullable = false, length = 50)
  private String name;

  @Column(name = "DEPARTMENT", nullable = false, length = 20)
  private String department; // 프론트 Organization.ts의 DEPARTMENTS와 같은 값

  @Column(name = "JOB_POSITION", nullable = false, length = 20)
  private String position; // 직급: 프론트 Organization.ts의 POSITIONS와 같은 값

  @Column(name = "STATUS", length = 20)
  private String status; // active, leave, resigned

  @Column(name = "JOIN_DATE", nullable = false)
  private LocalDate joinDate; // 2026-03-02
}
