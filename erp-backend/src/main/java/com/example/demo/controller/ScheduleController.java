package com.example.demo.controller;

import com.example.demo.dto.ScheduleCreateDto;
import com.example.demo.dto.ScheduleResponseDto;
import com.example.demo.dto.ScheduleUpdateDto;
import com.example.demo.service.ScheduleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {
  private final ScheduleService scheduleService;

  @PostMapping
  public ResponseEntity<ScheduleResponseDto> create(
    @AuthenticationPrincipal Long memberId,
    @Valid @RequestBody ScheduleCreateDto dto
  ) {
    ScheduleResponseDto response =
      scheduleService.create(memberId, dto);

    return ResponseEntity
      .status(HttpStatus.CREATED)
      .body(response);
  }

  @GetMapping
  public ResponseEntity<List<ScheduleResponseDto>> getMonthlySchedules(
    @AuthenticationPrincipal Long memberId,
    @RequestParam("year") int year,
    @RequestParam("month") int month
  ) {
    return ResponseEntity.ok(
      scheduleService.getMonthlySchedules(
        memberId, year, month
      )
    );
  }

  @PutMapping("/{scheduleId}")
  public ResponseEntity<ScheduleResponseDto> update(
    @AuthenticationPrincipal Long memberId,
    @PathVariable("scheduleId") Long scheduleId,
    @Valid @RequestBody ScheduleUpdateDto dto
  ) {
    return ResponseEntity.ok(
      scheduleService.update(memberId, scheduleId, dto)
    );
  }

  @DeleteMapping("/{scheduleId}")
  public ResponseEntity<Void> delete(
    @AuthenticationPrincipal Long memberId,
    @PathVariable("scheduleId") Long scheduleId
  ) {
    scheduleService.delete(memberId, scheduleId);

    return ResponseEntity.noContent().build();
  }
}