package com.example.demo.service;

import com.example.demo.dto.ScheduleCreateDto;
import com.example.demo.dto.ScheduleResponseDto;
import com.example.demo.entity.Member;
import com.example.demo.entity.Schedule;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.ScheduleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {
  private final ScheduleRepository scheduleRepository;
  private final MemberRepository memberRepository;

  @Transactional
  public ScheduleResponseDto create(
    Long memberId,
    ScheduleCreateDto dto
  ) {
    LocalDate scheduleDate;

    try {
      scheduleDate = LocalDate.of(
        dto.getYear(),
        dto.getMonth(),
        dto.getDate()
      );
    } catch (DateTimeException e) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "존재하지 않는 날짜입니다."
      );
    }

    Member member = memberRepository.findById(memberId)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.UNAUTHORIZED,
        "회원 정보를 확인할 수 없습니다."
      ));

    Schedule schedule = Schedule.builder()
      .member(member)
      .scheduleDate(scheduleDate)
      .content(dto.getContent().strip())
      .status(dto.getStatus())
      .build();

    // INSERT를 실행해 ID와 작성 시간이 생성된 뒤 응답합니다.
    Schedule saved = scheduleRepository.saveAndFlush(schedule);

    return ScheduleResponseDto.from(saved);
  }

  @Transactional(readOnly = true)
  public List<ScheduleResponseDto> getMonthlySchedules(
    Long memberId,
    int year,
    int month
  ) {
    if (year < 1 || year > 9999 || month < 1 || month > 12) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "조회할 연도와 월을 확인해 주세요."
      );
    }

    YearMonth targetMonth = YearMonth.of(year, month);

    return scheduleRepository
      .findAllByMember_IdAndScheduleDateBetweenOrderByScheduleDateAscCreatedAtAscIdAsc(
        memberId,
        targetMonth.atDay(1),
        targetMonth.atEndOfMonth()
      )
      .stream()
      .map(ScheduleResponseDto::from)
      .toList();
  }
}