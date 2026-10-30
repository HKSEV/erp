package com.example.demo.dto;

import com.example.demo.entity.Schedule;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public record ScheduleResponseDto(
  String id,
  int year,
  int month,
  int date,
  String content,
  String status,
  String createdAt
) {

  private static final DateTimeFormatter TIME_FORMAT =
    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

  public static ScheduleResponseDto from(Schedule schedule) {
    LocalDate scheduleDate = schedule.getScheduleDate();

    return new ScheduleResponseDto(
      schedule.getId().toString(),
      scheduleDate.getYear(),
      scheduleDate.getMonthValue(),
      scheduleDate.getDayOfMonth(),
      schedule.getContent(),
      schedule.getStatus(),
      schedule.getCreatedAt().format(TIME_FORMAT)
    );
  }
}