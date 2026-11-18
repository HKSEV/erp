package com.example.demo;

import com.example.demo.config.EmployeeDummyDataInitializer;
import com.example.demo.dto.EmployeeRequestDto;
import com.example.demo.entity.Employee;
import com.example.demo.repository.DocumentSequenceRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = "EMPLOYEE_DUMMY_DATA_ENABLED=true")
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class EmployeeDummyDataIntegrationTests {
  @TempDir
  static Path databaseDirectory;

  @DynamicPropertySource
  static void database(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", () -> "jdbc:sqlite:"
      + databaseDirectory.resolve("erp.db") + "?foreign_keys=on&busy_timeout=10000");
  }

  @Autowired
  private EmployeeDummyDataInitializer initializer;
  @Autowired
  private EmployeeRepository employeeRepository;
  @Autowired
  private MemberRepository memberRepository;
  @Autowired
  private DocumentSequenceRepository sequenceRepository;
  @Autowired
  private EmployeeService employeeService;

  @Test
  void startupCreatesFiveEmployeesAndRepeatedInitializationPreservesThem() {
    List<Employee> employees = employeeRepository.findAll();
    assertThat(employees).hasSize(5);
    assertThat(employees).extracting(Employee::getName)
      .containsExactlyInAnyOrder("김승훈", "이상민", "박서연", "이도윤", "최지우");
    assertThat(employees).extracting(Employee::getId)
      .containsExactlyInAnyOrder("EMP-0001", "EMP-0002", "EMP-0003", "EMP-0004", "EMP-0005");
    assertThat(employees).allSatisfy(employee -> {
      assertThat(employee.getCreatedAt()).isNotNull();
      assertThat(employee.getJoinDate()).isNotNull();
    });
    assertThat(memberRepository.count()).isZero();

    Employee edited = employees.stream()
      .filter(employee -> employee.getName().equals("김승훈")).findFirst().orElseThrow();
    edited.setName("수정된 이름");
    employeeRepository.saveAndFlush(edited);

    initializer.run(new DefaultApplicationArguments());

    assertThat(employeeRepository.count()).isEqualTo(5);
    assertThat(employeeRepository.findById(edited.getId()).orElseThrow().getName())
      .isEqualTo("수정된 이름");
    assertThat(sequenceRepository.findById("EMPLOYEE_DUMMY").orElseThrow().getLastValue())
      .isEqualTo(1);

    Employee next = employeeService.createEmployee(new EmployeeRequestDto(
      "추가 직원", "개발팀", "사원", "active", LocalDate.now()
    ));
    assertThat(next.getId()).isEqualTo("EMP-0006");
  }
}
