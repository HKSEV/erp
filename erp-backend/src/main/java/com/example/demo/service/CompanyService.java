package com.example.demo.service;

import com.example.demo.dto.CompanyRequestDto;
import com.example.demo.entity.Company;
import com.example.demo.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyService {
  // 회사 정보는 1행만 두므로 ID를 고정합니다.
  private static final Long COMPANY_ID = 1L;

  private final CompanyRepository companyRepository;

  @Transactional(readOnly = true)
  public Company getCompany() {
    // 아직 저장한 적이 없으면 빈 값을 돌려줍니다. (DB에는 저장하지 않음)
    return companyRepository.findById(COMPANY_ID)
      .orElseGet(() -> new Company(COMPANY_ID, "", "", ""));
  }

  @Transactional
  public Company updateCompany(CompanyRequestDto dto) {
    // 처음 저장할 때는 행을 새로 만들고, 이후에는 같은 행을 수정합니다.
    Company company = companyRepository.findById(COMPANY_ID)
      .orElseGet(() -> {
        Company created = new Company();
        created.setId(COMPANY_ID);
        return created;
      });

    company.setName(dto.name().strip());
    company.setBusinessNumber(dto.businessNumber());
    company.setEmail(dto.email().strip());

    return companyRepository.saveAndFlush(company);
  }
}
