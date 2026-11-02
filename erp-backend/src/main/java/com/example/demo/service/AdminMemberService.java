package com.example.demo.service;

import com.example.demo.dto.AdminMemberResponseDto;
import com.example.demo.dto.MemberProfileUpdateDto;
import com.example.demo.entity.Member;
import com.example.demo.entity.MemberRole;
import com.example.demo.repository.AdminMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AdminMemberService {
  private final AdminMemberRepository adminMemberRepository;

  @Transactional(readOnly = true)
  public List<AdminMemberResponseDto> getMembers() {
    return adminMemberRepository.findAll(Sort.by("id")).stream()
      .map(AdminMemberResponseDto::from)
      .toList();
  }

  @Transactional
  public AdminMemberResponseDto updateRole(
    Long currentMemberId,
    Long memberId,
    MemberRole role
  ) {
    // 자기 역할을 낮추면 바로 이 화면에 못 들어오므로 막습니다.
    if (Objects.equals(currentMemberId, memberId)) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "내 계정의 역할은 변경할 수 없습니다."
      );
    }

    // 관리자 행을 먼저 잠근 뒤 대상 회원을 잠급니다. (잠금 순서 통일)
    List<Member> activeAdmins = adminMemberRepository
      .findActiveByRoleForUpdate(MemberRole.ADMIN);
    Member member = findMember(memberId);

    if (member.getRole() == role)
      return AdminMemberResponseDto.from(member);

    if (isActiveAdmin(member) && activeAdmins.size() <= 1) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "관리자는 최소 1명 있어야 합니다."
      );
    }

    member.setRole(role);
    adminMemberRepository.flush();
    return AdminMemberResponseDto.from(member);
  }

  @Transactional
  public AdminMemberResponseDto updateActive(
    Long currentMemberId,
    Long memberId,
    boolean active
  ) {
    if (Objects.equals(currentMemberId, memberId)) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "내 계정은 정지할 수 없습니다."
      );
    }

    List<Member> activeAdmins = adminMemberRepository
      .findActiveByRoleForUpdate(MemberRole.ADMIN);
    Member member = findMember(memberId);

    if (member.isActive() == active)
      return AdminMemberResponseDto.from(member);

    if (!active && isActiveAdmin(member) && activeAdmins.size() <= 1) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "관리자는 최소 1명 있어야 합니다."
      );
    }

    member.setActive(active);
    adminMemberRepository.flush();
    return AdminMemberResponseDto.from(member);
  }

  @Transactional
  public AdminMemberResponseDto updateProfile(
    Long memberId,
    MemberProfileUpdateDto dto
  ) {
    if (dto.department() == null && dto.position() == null) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "변경할 부서 또는 직급을 선택해 주세요."
      );
    }

    Member member = findMember(memberId);

    if (dto.department() != null)
      member.setDepartment(dto.department());
    if (dto.position() != null)
      member.setPosition(dto.position());

    adminMemberRepository.flush();
    return AdminMemberResponseDto.from(member);
  }

  private Member findMember(Long memberId) {
    return adminMemberRepository.findByIdForUpdate(memberId)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."
      ));
  }

  private boolean isActiveAdmin(Member member) {
    return member.getRole() == MemberRole.ADMIN && member.isActive();
  }
}
