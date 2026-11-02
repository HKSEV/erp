package com.example.demo.controller;

import com.example.demo.dto.EmployeeRequestDto;
import com.example.demo.entity.Employee;
import com.example.demo.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {
  private final EmployeeService employeeService;

  @GetMapping
  public ResponseEntity<List<Employee>> getAllEmployees() {
    return ResponseEntity.ok(
      employeeService.getAllEmployees()
    );
  }

  @PostMapping
  public ResponseEntity<Employee> createEmployee(
    @Valid @RequestBody EmployeeRequestDto dto
  ) {
    return ResponseEntity.status(HttpStatus.CREATED)
      .body(employeeService.createEmployee(dto));
  }

  @PutMapping("/{employeeId}")
  public ResponseEntity<Employee> updateEmployee(
    @PathVariable("employeeId") String employeeId,
    @Valid @RequestBody EmployeeRequestDto dto
  ) {
    return ResponseEntity.ok(
      employeeService.updateEmployee(employeeId, dto)
    );
  }

  @DeleteMapping("/{employeeId}")
  public ResponseEntity<Void> deleteEmployee(
    @PathVariable("employeeId") String employeeId
  ) {
    employeeService.deleteEmployee(employeeId);
    return ResponseEntity.noContent().build();
  }
}
