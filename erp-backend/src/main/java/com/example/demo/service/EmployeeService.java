package com.example.demo.service;

import com.example.demo.dto.EmployeeRequestDto;
import com.example.demo.entity.Employee;
import com.example.demo.repository.EmployeeRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
  private final EmployeeRepository employeeRepository;
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
    Employee employee = findEmployee(employeeId);
    apply(employee, dto);

    employeeRepository.flush();
    return employee;
  }

  @Transactional
  public void deleteEmployee(String employeeId) {
    Employee employee = findEmployee(employeeId);

    employeeRepository.delete(employee);
    employeeRepository.flush();
  }

  private Employee findEmployee(String employeeId) {
    return employeeRepository.findById(employeeId)
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
