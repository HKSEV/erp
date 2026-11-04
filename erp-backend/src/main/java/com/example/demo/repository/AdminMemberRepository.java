package com.example.demo.repository;

import com.example.demo.entity.Member;
import com.example.demo.entity.MemberRole;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

// 관리자 화면 전용 조회 (회원 기본 기능은 MemberRepository)
public interface AdminMemberRepository extends JpaRepository<Member, Long> {
  // 관리자 두 명이 동시에 서로를 강등·정지해도 관리자가 0명이 되지 않도록
  // 사용 중인 관리자 행을 잠근 뒤 수를 셉니다.
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select m from Member m where m.role = :role and m.active = true")
  List<Member> findActiveByRoleForUpdate(
    @Param("role") MemberRole role
  );

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select m from Member m where m.id = :memberId")
  Optional<Member> findByIdForUpdate(
    @Param("memberId") Long memberId
  );

  @Query("select m from Member m left join fetch m.employee order by m.id")
  List<Member> findAllWithEmployee();
}
