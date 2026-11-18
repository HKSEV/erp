package com.example.demo.service;

import com.example.demo.entity.MemberRole;
import com.example.demo.repository.DocumentSequenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MemberRegistrationService {
  private static final String REGISTRATION_KEY = "MEMBER_REGISTRATION";

  private final DocumentSequenceRepository sequenceRepository;

  @Transactional(propagation = Propagation.MANDATORY)
  public MemberRole claimInitialRole() {
    // 빈 회원 테이블도 원자적 UPDATE로 선점해 동시 가입을 처리합니다.
    // 가입이 실패하면 이 변경도 함께 롤백됩니다.
    if (sequenceRepository.claimInitialValue(REGISTRATION_KEY) == 1)
      return MemberRole.ADMIN;

    if (!sequenceRepository.existsById(REGISTRATION_KEY)) {
      throw new ResponseStatusException(
        HttpStatus.SERVICE_UNAVAILABLE,
        "회원가입 초기화가 필요합니다. 서버 초기화를 확인해 주세요."
      );
    }

    return MemberRole.USER;
  }
}
