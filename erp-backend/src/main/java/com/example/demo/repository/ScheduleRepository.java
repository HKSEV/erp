package com.example.demo.repository;

import com.example.demo.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

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
}