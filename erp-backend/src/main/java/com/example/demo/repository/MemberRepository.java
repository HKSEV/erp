package com.example.demo.repository;

import com.example.demo.entity.Member;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
  Optional<Member> findByEmail(String email);
  Optional<Member> findByKakaoId(String kakaoId);
  boolean existsByEmail(String email);
  boolean existsByEmployee_Id(String employeeId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select m from Member m where m.id = :memberId")
  Optional<Member> findByIdForUpdate(
    @Param("memberId") Long memberId
  );

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select m from Member m where m.email = :email")
  Optional<Member> findByEmailForUpdate(
    @Param("email") String email
  );

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select m from Member m where m.passwordResetTokenHash = :hash")
  Optional<Member> findByResetTokenHashForUpdate(
    @Param("hash") String hash
  );

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select m from Member m where m.employee.id = :employeeId")
  Optional<Member> findByEmployeeIdForUpdate(
    @Param("employeeId") String employeeId
  );
}