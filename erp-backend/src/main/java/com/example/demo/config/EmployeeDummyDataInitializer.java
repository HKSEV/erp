package com.example.demo.config;

import com.example.demo.dto.EmployeeRequestDto;
import com.example.demo.repository.DocumentSequenceRepository;
import com.example.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Component
@Order(1)
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.employee-dummy.enabled", havingValue = "true")
public class EmployeeDummyDataInitializer implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(EmployeeDummyDataInitializer.class);
  private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

  private final DocumentSequenceRepository sequenceRepository;
  private final EmployeeService employeeService;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (sequenceRepository.claimInitialValue("EMPLOYEE_DUMMY") == 0)
      return;

    LocalDate today = LocalDate.now(ZONE);
    List<EmployeeRequestDto> employees = List.of(
      new EmployeeRequestDto("김승훈", "개발팀", "대리", "active", today.minusMonths(6)),
      new EmployeeRequestDto("이상민", "생산팀", "과장", "active", today.minusMonths(12)),
      new EmployeeRequestDto("박서연", "인사팀", "주임", "active", today.minusMonths(3)),
      new EmployeeRequestDto("이도윤", "자재팀", "사원", "active", today.minusMonths(2)),
      new EmployeeRequestDto("최지우", "영업팀", "사원", "leave", today.minusMonths(8))
    );

    for (EmployeeRequestDto employee : employees)
      employeeService.createEmployee(employee);

    log.info("직원 더미 데이터 {}건을 등록했습니다.", employees.size());
  }
}
