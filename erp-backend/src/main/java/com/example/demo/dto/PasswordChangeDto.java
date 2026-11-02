package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeDto {
  @NotBlank(message = "현재 비밀번호를 입력해 주세요.")
  private String oldPassword;

  @NotBlank(message = "새 비밀번호를 입력해 주세요.")
  private String newPassword;
}