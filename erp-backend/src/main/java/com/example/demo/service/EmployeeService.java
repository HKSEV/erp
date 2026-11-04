package com.example.demo.service;

import com.example.demo.dto.EmployeeRequestDto;
import com.example.demo.entity.Employee;
import com.example.demo.entity.Member;
import com.example.demo.entity.MemberRole;
import com.example.demo.repository.AdminMemberRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.MemberRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
  private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
  private final AdminMemberRepository adminMemberRepository;
  private final EmployeeRepository employeeRepository;
  private final MemberRepository memberRepository;
  private final DocumentNumberService documentNumberService;

  @PersistenceContext
  private EntityManager entityManager;

  @Transactional(readOnly = true)
  public List<Employee> getAllEmployees() {
    return employeeRepository.findAll();
  }

  @Transactional
  public Employee createEmployee(EmployeeRequestDto dto) {
    Employee employee = new Employee();
    employee.setId(documentNumberService.nextEmployeeId());
    employee.setCreatedAt(LocalDateTime.now(ZONE).withNano(0));
    apply(employee, dto);

    // 기존 데이터를 덮어쓰지 않도록 INSERT만 수행합니다.
    entityManager.persist(employee);
    entityManager.flush();

    return employee;
  }

  @Transactional
  public Employee updateEmployee(
    String employeeId,
    EmployeeRequestDto dto
  ) {
    boolean resigning = "resigned".equals(dto.status());
    List<Member> activeAdmins = resigning
      ? adminMemberRepository.findActiveByRoleForUpdate(MemberRole.ADMIN)
      : List.of();

    Employee employee = findEmployee(employeeId);

    if (resigning)
      suspendLinkedAccount(employeeId, activeAdmins.size());

    apply(employee, dto);
    employeeRepository.flush();

    return employee;
  }

  private void suspendLinkedAccount(String employeeId, int activeAdminCount) {
    memberRepository.findByEmployeeIdForUpdate(employeeId).ifPresent(member -> {
      if (member.isActive() && member.getRole() == MemberRole.ADMIN
        && activeAdminCount <= 1) {
        throw new ResponseStatusException(
          HttpStatus.CONFLICT,
          "마지막 관리자와 연결된 직원입니다. 다른 관리자를 지정한 뒤 퇴사 처리해 주세요."
        );
      }

      member.setActive(false);
    });
  }

  @Transactional
  public void deleteEmployee(String employeeId) {
    Employee employee = findEmployee(employeeId);

    if (memberRepository.existsByEmployee_Id(employeeId)) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "계정과 연결된 직원은 퇴사로 처리해 주세요."
      );
    }

    employeeRepository.delete(employee);
    employeeRepository.flush();
  }

  private Employee findEmployee(String employeeId) {
    return employeeRepository.findByIdForUpdate(employeeId)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "직원을 찾을 수 없습니다."
      ));
  }

  private void apply(
    Employee employee,
    EmployeeRequestDto dto
  ) {
    employee.setName(dto.name().strip());
    employee.setDepartment(dto.department());
    employee.setPosition(dto.position());
    employee.setStatus(dto.status());
    employee.setJoinDate(dto.joinDate());
  }
}
