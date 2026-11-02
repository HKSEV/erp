package com.example.demo.controller;

import com.example.demo.dto.AdminMemberResponseDto;
import com.example.demo.dto.MemberActiveUpdateDto;
import com.example.demo.dto.MemberProfileUpdateDto;
import com.example.demo.dto.MemberRoleUpdateDto;
import com.example.demo.service.AdminMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 시스템관리 > 사용자 권한 관리 (관리자 전용)
@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminMemberController {
  private final AdminMemberService adminMemberService;

  @GetMapping
  public ResponseEntity<List<AdminMemberResponseDto>> getMembers() {
    return ResponseEntity.ok(
      adminMemberService.getMembers()
    );
  }

  @PatchMapping("/{memberId}/role")
  public ResponseEntity<AdminMemberResponseDto> updateRole(
    @AuthenticationPrincipal Long currentMemberId,
    @PathVariable("memberId") Long memberId,
    @Valid @RequestBody MemberRoleUpdateDto dto
  ) {
    return ResponseEntity.ok(
      adminMemberService.updateRole(currentMemberId, memberId, dto.role())
    );
  }

  @PatchMapping("/{memberId}/active")
  public ResponseEntity<AdminMemberResponseDto> updateActive(
    @AuthenticationPrincipal Long currentMemberId,
    @PathVariable("memberId") Long memberId,
    @Valid @RequestBody MemberActiveUpdateDto dto
  ) {
    return ResponseEntity.ok(
      adminMemberService.updateActive(currentMemberId, memberId, dto.active())
    );
  }

  @PatchMapping("/{memberId}/profile")
  public ResponseEntity<AdminMemberResponseDto> updateProfile(
    @PathVariable("memberId") Long memberId,
    @Valid @RequestBody MemberProfileUpdateDto dto
  ) {
    return ResponseEntity.ok(
      adminMemberService.updateProfile(memberId, dto)
    );
  }
}
