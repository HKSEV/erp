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

// 가입하면 모두 USER라 관리자가 생길 방법이 없으므로,
// 사용 중인 관리자가 한 명도 없을 때만 서버 시작 시 지정한 회원을 관리자로 바꿉니다.
// 관리자가 이미 있으면 아무것도 하지 않습니다. (이후 권한은 사용자 권한 관리 화면에서 변경)
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

    memberRepository.findByEmail(email).ifPresentOrElse(
      member -> {
        member.setRole(MemberRole.ADMIN);
        member.setActive(true);
        log.info("첫 관리자를 지정했습니다. (회원 번호: {})", member.getId());
      },
      () -> log.warn("첫 관리자로 지정할 회원이 없습니다. 회원가입 후 서버를 다시 시작해 주세요.")
    );
  }
}
