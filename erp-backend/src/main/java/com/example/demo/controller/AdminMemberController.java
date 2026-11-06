package com.example.demo.controller;

import com.example.demo.dto.*;
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

  @PatchMapping("/{memberId}/employee")
  public ResponseEntity<AdminMemberResponseDto> linkEmployee(
    @PathVariable("memberId") Long memberId,
    @Valid @RequestBody MemberEmployeeLinkDto dto
  ) {
    return ResponseEntity.ok(
      adminMemberService.linkEmployee(memberId, dto.employeeId())
    );
  }

  @DeleteMapping("/{memberId}/employee/{employeeId}")
  public ResponseEntity<AdminMemberResponseDto> unlinkEmployee(
    @PathVariable("memberId") Long memberId,
    @PathVariable("employeeId") String employeeId
  ) {
    return ResponseEntity.ok(
      adminMemberService.unlinkEmployee(memberId, employeeId)
    );
  }

  @DeleteMapping("/{memberId}")
  public ResponseEntity<Void> deleteMember(
    @AuthenticationPrincipal Long currentMemberId,
    @PathVariable("memberId") Long memberId
  ) {
    adminMemberService.deleteMember(currentMemberId, memberId);
    return ResponseEntity.noContent().build();
  }
}
