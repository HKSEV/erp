package com.example.demo.service;

import com.example.demo.dto.AdminMemberResponseDto;
import com.example.demo.entity.Employee;
import com.example.demo.entity.Member;
import com.example.demo.entity.MemberRole;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
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
  private final EmployeeRepository employeeRepository;
  private final MemberRepository memberRepository;
  private final ScheduleRepository scheduleRepository;
  private final StockMovementRepository stockMovementRepository;

  @Transactional(readOnly = true)
  public List<AdminMemberResponseDto> getMembers() {
    return adminMemberRepository.findAllWithEmployee().stream()
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

    if (active && member.hasResignedEmployee()) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "퇴사한 직원의 계정은 사용할 수 없습니다."
      );
    }

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
  public AdminMemberResponseDto linkEmployee(Long memberId, String employeeId) {
    // 퇴사 처리와 같은 순서로 관리자, 직원, 계정 행을 잠급니다.
    adminMemberRepository.findActiveByRoleForUpdate(MemberRole.ADMIN);

    Employee employee = employeeRepository.findByIdForUpdate(employeeId.strip())
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND, "직원 정보를 찾을 수 없습니다."
      ));

    Member member = findMember(memberId);

    if (member.getEmployee() != null) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "이미 직원과 연결된 계정입니다."
      );
    }

    if ("resigned".equals(employee.getStatus())) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "퇴사한 직원은 계정에 연결할 수 없습니다."
      );
    }

    if (memberRepository.existsByEmployee_Id(employee.getId())) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "다른 계정에 연결된 직원입니다."
      );
    }

    member.setEmployee(employee);
    adminMemberRepository.flush();

    return AdminMemberResponseDto.from(member);
  }

  @Transactional
  public AdminMemberResponseDto unlinkEmployee(Long memberId, String employeeId) {
    // 직원 연결 및 퇴사 처리와 같은 순서로 잠급니다.
    adminMemberRepository.findActiveByRoleForUpdate(MemberRole.ADMIN);
    employeeRepository.findByIdForUpdate(employeeId);
    Member member = findMember(memberId);
    Employee employee = member.getEmployee();

    if (employee == null)
      return AdminMemberResponseDto.from(member);

    if (!employeeId.equals(employee.getId())) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "연결된 직원이 변경되었습니다. 목록을 다시 확인해 주세요."
      );
    }

    member.setEmployee(null);
    adminMemberRepository.flush();

    return AdminMemberResponseDto.from(member);
  }

  @Transactional
  public void deleteMember(Long currentMemberId, Long memberId) {
    if (Objects.equals(currentMemberId, memberId)) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "내 계정은 삭제할 수 없습니다."
      );
    }

    // 기존 권한 변경·정지 처리와 동일한 순서로 잠급니다.
    List<Member> activeAdmins = adminMemberRepository
      .findActiveByRoleForUpdate(MemberRole.ADMIN);

    // 잠금을 기다리는 동안 요청자의 권한이 바뀌었는지도 검사합니다.
    if (activeAdmins.stream().noneMatch(
      admin -> admin.getId().equals(currentMemberId)
    )) {
      throw new ResponseStatusException(
        HttpStatus.FORBIDDEN,
        "사용자를 삭제할 권한이 없습니다."
      );
    }

    Member member = findMember(memberId);

    if (isActiveAdmin(member) && activeAdmins.size() <= 1) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "관리자는 최소 1명 있어야 합니다."
      );
    }

    scheduleRepository.deleteByMemberId(memberId);
    stockMovementRepository.unlinkMember(memberId);

    adminMemberRepository.delete(member);
    adminMemberRepository.flush();
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
