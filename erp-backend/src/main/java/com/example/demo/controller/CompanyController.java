package com.example.demo.controller;

import com.example.demo.dto.CompanyRequestDto;
import com.example.demo.entity.Company;
import com.example.demo.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CompanyController {
  private final CompanyService companyService;

  @GetMapping
  public ResponseEntity<Company> getCompany() {
    return ResponseEntity.ok(
      companyService.getCompany()
    );
  }

  @PutMapping
  public ResponseEntity<Company> updateCompany(
    @Valid @RequestBody CompanyRequestDto dto
  ) {
    return ResponseEntity.ok(
      companyService.updateCompany(dto)
    );
  }
}
