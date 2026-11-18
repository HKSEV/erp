package com.example.demo.config;

import com.example.demo.entity.MemberRole;
import com.example.demo.repository.AdminMemberRepository;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

// 기존 회원이 있는 DB에서 사용 중인 관리자가 없으면 지정한 이메일로 복구합니다.
// 신규 DB의 최초 가입자는 회원가입 트랜잭션에서 ADMIN으로 배정합니다.
@Component
@RequiredArgsConstructor
public class InitialAdminInitializer implements ApplicationRunner {
  private static final Logger log = LoggerFactory.getLogger(InitialAdminInitializer.class);

  private final AdminMemberRepository adminMemberRepository;
  private final MemberRepository memberRepository;

  @Value("${app.initial-admin-email:}")
  private String initialAdminEmail;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    String email = initialAdminEmail == null ? "" : initialAdminEmail.strip();

    if (email.isEmpty())
      return;

    if (!adminMemberRepository.findActiveByRoleForUpdate(MemberRole.ADMIN).isEmpty())
      return;

    memberRepository.findByEmailForUpdate(email).ifPresentOrElse(
      member -> {
        if (member.hasResignedEmployee()) {
          log.warn("퇴사한 직원의 계정은 첫 관리자로 지정할 수 없습니다.");
          return;
        }

        member.setRole(MemberRole.ADMIN);
        member.setActive(true);
        log.info("첫 관리자를 지정했습니다. (회원 번호: {})", member.getId());
      },
      () -> log.warn("첫 관리자로 지정할 회원이 없습니다. 회원가입 후 서버를 다시 시작해 주세요.")
    );
  }
}
