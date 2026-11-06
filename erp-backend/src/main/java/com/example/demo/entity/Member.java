package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
// 오라클에서는 'MEMBER'가 예약어로 쓰이는 경우가 있어 보통 'MEMBERS'로 명명합니다.
@Table(name = "MEMBERS")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 기본 생성자 무분별한 사용 방지
@AllArgsConstructor
@Builder
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  /*
   * 💡 [참고] 오라클 버전에 따른 PK 생성 전략
   * Oracle 12c 이상: GenerationType.IDENTITY 사용 가능 (테이블 자동 생성 시 내부적으로 identity column 생성)
   * Oracle 11g 이하: 아래처럼 SEQUENCE 방식을 사용해야 합니다.
   * @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MEMBER_SEQ_GEN")
   * @SequenceGenerator(name = "MEMBER_SEQ_GEN", sequenceName = "MEMBER_SEQ", allocationSize = 1)
   */
  private Long id;

  @Column(nullable = false, length = 50)
  private String firstName;

  @Column(nullable = false, length = 50)
  private String lastName;

  @Column(nullable = false, unique = true, length = 100)
  private String email;

  @JsonIgnore
  @Column(nullable = false)
  private String password; // Spring Security BCrypt 등으로 암호화되어 저장됨

  @JsonIgnore
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "EMP_ID", unique = true,
    foreignKey = @ForeignKey(name = "FK_MEMBERS_EMPLOYEE"))
  private Employee employee;

  @Enumerated(EnumType.STRING)
  @Column(name = "MEMBER_ROLE", nullable = false, length = 20)
  @Builder.Default
  private MemberRole role = MemberRole.USER;

  @Column(name = "IS_ACTIVE", nullable = false)
  @Builder.Default
  private boolean active = true;

  @Column(length = 20)
  private String tel;

  private String address;

  private String detailAddress;

  @Column(length = 20)
  private String gender; // male, female, other

  @JsonIgnore
  @Column(unique = true, length = 255)
  private String googleId;

  @JsonIgnore
  @Column(unique = true, length = 32)
  private String kakaoId;

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt; // 가입일

  @UpdateTimestamp
  private LocalDateTime updatedAt; // 정보 수정일

  @JsonIgnore
  @Column(name = "PASSWORD_RESET_TOKEN_HASH", length = 64, unique = true)
  private String passwordResetTokenHash;

  @JsonIgnore
  @Column(name = "PASSWORD_RESET_EXPIRES_AT")
  private LocalDateTime passwordResetExpiresAt;

  public String getDepartment() {
    return employee == null ? null : employee.getDepartment();
  }

  public String getPosition() {
    return employee == null ? null : employee.getPosition();
  }

  public boolean hasResignedEmployee() {
    return employee != null && "resigned".equals(employee.getStatus());
  }
}