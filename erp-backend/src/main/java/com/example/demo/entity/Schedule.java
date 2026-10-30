package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
  name = "CALENDAR_SCHEDULES",
  indexes = {
    @Index(
      name = "IDX_SCHEDULE_MEMBER_DATE",
      columnList = "MEMBER_ID,SCHEDULE_DATE"
    )
  }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Schedule {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "MEMBER_ID", nullable = false)
  private Member member;

  @Column(name = "SCHEDULE_DATE", nullable = false)
  private LocalDate scheduleDate;

  @Column(name = "CONTENT", nullable = false, length = 1000)
  private String content;

  @Column(name = "STATUS", nullable = false, length = 10)
  private String status;

  @CreationTimestamp
  @Column(
          name = "CREATED_AT",
          nullable = false,
          updatable = false
  )
  private LocalDateTime createdAt;

  public void update(String content, String status) {
    this.content = content.strip();
    this.status = status;
  }
}