package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.GoogleAuthService;
import com.example.demo.service.KakaoAuthService;
import com.example.demo.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MemberController {
  private final MemberService memberService;
  private final GoogleAuthService googleAuthService;
  private final KakaoAuthService kakaoAuthService;

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody MemberRegisterDto requestDto) {
    try {
      memberService.register(requestDto);
      return ResponseEntity.ok("회원가입 성공");
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body("회원가입 처리 중 오류가 발생했습니다.");
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody MemberLoginDto requestDto) {
    try {
      String token = memberService.login(requestDto);
      return ResponseEntity.ok(new TokenResponseDto(token));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body("로그인 처리 중 오류가 발생했습니다.");
    }
  }

  @PostMapping("/google/authorize")
  public GoogleAuthorizeResponseDto googleAuthorize(
    @Valid @RequestBody GoogleAuthorizeRequestDto dto
  ) {
    return googleAuthService.authorize(dto);
  }

  @PostMapping("/google")
  public TokenResponseDto googleLogin(
    @Valid @RequestBody GoogleLoginRequestDto dto
  ) {
    return googleAuthService.login(dto);
  }

  @PostMapping("/kakao")
  public TokenResponseDto kakaoLogin(
    @Valid @RequestBody KakaoLoginRequestDto dto
  ) {
    return kakaoAuthService.login(dto);
  }

  @GetMapping("/me")
  public ResponseEntity<MemberProfileResponseDto> getMyProfile(
    @AuthenticationPrincipal Long memberId
  ) {
    return ResponseEntity.ok(memberService.getMyProfile(memberId));
  }

  @PatchMapping("/me")
  public ResponseEntity<MemberProfileResponseDto> updateMyContact(
    @AuthenticationPrincipal Long memberId,
    @Valid @RequestBody MemberContactUpdateDto dto
  ) {
    return ResponseEntity.ok(memberService.updateMyContact(memberId, dto));
  }

  // 비밀번호 찾기 (비밀번호 리셋)
  @PostMapping("/forgot-password")
  public ResponseEntity<String> forgotPassword(
    @RequestBody Map<String, String> request
  ) {
    try {
      memberService.sendPasswordResetLink(request.get("email"));

      return ResponseEntity.ok(
        "입력한 이메일로 가입된 계정이 있다면 재설정 링크가 발송됩니다."
      );
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
        .body("재설정 메일 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  @PostMapping("/reset-password")
  public ResponseEntity<String> resetPassword(
    @RequestBody PasswordResetDto dto
  ) {
    try {
      memberService.resetPassword(dto.getToken(), dto.getNewPassword());

      return ResponseEntity.ok(
        "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요."
      );
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
        .body("비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  // 비밀번호 변경 (마이페이지용)
  @PostMapping("/change-password")
  public ResponseEntity<String> changePassword(
    @AuthenticationPrincipal Long memberId,
    @Valid @RequestBody PasswordChangeDto dto
  ) {
    memberService.changePassword(
      memberId, dto.getOldPassword(), dto.getNewPassword()
    );

    return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
  }
}