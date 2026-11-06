package com.example.demo.repository;

import com.example.demo.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
  List<Schedule> findAllByMember_IdAndScheduleDateBetweenOrderByScheduleDateAscCreatedAtAscIdAsc(
    Long memberId,
    LocalDate startDate,
    LocalDate endDate
  );

  Optional<Schedule> findByIdAndMember_Id(
    Long id,
    Long memberId
  );

  @Modifying(flushAutomatically = true)
  @Query("delete from Schedule s where s.member.id = :memberId")
  int deleteByMemberId(@Param("memberId") Long memberId);
}