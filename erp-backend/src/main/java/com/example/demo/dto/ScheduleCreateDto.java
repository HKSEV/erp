package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleCreateDto {
  @NotNull(message = "연도를 입력해 주세요.")
  @Min(value = 1, message = "연도는 1 이상이어야 합니다.")
  @Max(value = 9999, message = "연도는 9999 이하여야 합니다.")
  private Integer year;

  @NotNull(message = "월을 입력해 주세요.")
  @Min(value = 1, message = "월은 1~12 사이여야 합니다.")
  @Max(value = 12, message = "월은 1~12 사이여야 합니다.")
  private Integer month;

  @NotNull(message = "날짜를 입력해 주세요.")
  @Min(value = 1, message = "날짜는 1~31 사이여야 합니다.")
  @Max(value = 31, message = "날짜는 1~31 사이여야 합니다.")
  private Integer date;

  @NotBlank(message = "일정 내용을 입력해 주세요.")
  @Size(
    max = 1000,
    message = "일정 내용은 1000자 이내로 입력해 주세요."
  )
  private String content;

  @NotBlank(message = "진행 상태를 선택해 주세요.")
  @Pattern(
    regexp = "대기|진행|완료",
    message = "진행 상태는 대기, 진행, 완료 중 하나여야 합니다."
  )
  private String status;
}