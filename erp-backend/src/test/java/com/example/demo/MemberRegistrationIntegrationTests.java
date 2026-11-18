package com.example.demo;

import com.example.demo.config.DocumentSequenceInitializer;
import com.example.demo.config.EmployeeDummyDataInitializer;
import com.example.demo.dto.KakaoLoginRequestDto;
import com.example.demo.dto.MemberRegisterDto;
import com.example.demo.entity.DocumentSequence;
import com.example.demo.entity.GoogleAuthFlow;
import com.example.demo.entity.Member;
import com.example.demo.entity.MemberRole;
import com.example.demo.repository.DocumentSequenceRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.service.GoogleIdTokenValidator;
import com.example.demo.service.GoogleMemberService;
import com.example.demo.service.KakaoAuthService;
import com.example.demo.service.KakaoClientService;
import com.example.demo.service.MemberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@SpringBootTest(properties = "EMPLOYEE_DUMMY_DATA_ENABLED=false")
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class MemberRegistrationIntegrationTests {
  @TempDir
  static Path databaseDirectory;

  @DynamicPropertySource
  static void database(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", () -> "jdbc:sqlite:"
      + databaseDirectory.resolve("erp.db") + "?foreign_keys=on&busy_timeout=10000");
  }

  @Autowired
  private MemberService memberService;
  @Autowired
  private GoogleMemberService googleMemberService;
  @Autowired
  private KakaoAuthService kakaoAuthService;
  @Autowired
  private MemberRepository memberRepository;
  @Autowired
  private EmployeeRepository employeeRepository;
  @Autowired
  private DocumentSequenceRepository sequenceRepository;
  @Autowired
  private DocumentSequenceInitializer sequenceInitializer;
  @Autowired
  private ApplicationContext context;

  @MockitoBean
  private KakaoClientService kakaoClientService;

  @BeforeEach
  void resetRegistration() {
    memberRepository.deleteAll();
    sequenceRepository.saveAndFlush(new DocumentSequence("MEMBER_REGISTRATION", 0L));
  }

  @Test
  void emailSignupReceivesTheFirstAdminRole() {
    registerEmail("email@example.com");
    registerGoogle("google-id", "google@example.com", true);
    registerKakao(100L, "kakao@example.com");

    assertRoles("email@example.com");
  }

  @Test
  void googleSignupReceivesTheFirstAdminRole() {
    registerGoogle("google-id", "google@example.com", true);
    registerEmail("email@example.com");
    registerKakao(100L, "kakao@example.com");

    assertRoles("google@example.com");
  }

  @Test
  void kakaoSignupReceivesTheFirstAdminRole() {
    registerKakao(100L, "kakao@example.com");
    registerEmail("email@example.com");
    registerGoogle("google-id", "google@example.com", true);

    assertRoles("kakao@example.com");
  }

  @Test
  void failedSignupRollsBackTheFirstAdminClaim() {
    MemberRegisterDto invalid = registration("invalid@example.com");
    invalid.setFirstName("가".repeat(51));

    assertThatThrownBy(() -> memberService.register(invalid))
      .isInstanceOf(RuntimeException.class);

    assertThat(sequenceRepository.findById("MEMBER_REGISTRATION").orElseThrow().getLastValue())
      .isZero();

    registerEmail("valid@example.com");
    assertThat(memberRepository.findByEmail("valid@example.com").orElseThrow().getRole())
      .isEqualTo(MemberRole.ADMIN);
  }

  @Test
  void concurrentSignupsCreateExactlyOneAdmin() throws Exception {
    ExecutorService executor = Executors.newFixedThreadPool(4);
    CountDownLatch start = new CountDownLatch(1);
    List<Future<?>> signups = new ArrayList<>();

    try {
      for (int index = 0; index < 4; index++) {
        String email = "concurrent-" + index + "@example.com";
        signups.add(executor.submit(() -> {
          start.await();
          registerEmail(email);
          return null;
        }));
      }

      start.countDown();
      for (Future<?> signup : signups)
        signup.get(30, TimeUnit.SECONDS);
    } finally {
      executor.shutdownNow();
    }

    assertThat(memberRepository.count()).isEqualTo(4);
    assertThat(memberRepository.findAll().stream()
      .filter(member -> member.getRole() == MemberRole.ADMIN).count()).isEqualTo(1);
  }

  @Test
  void socialLoginKeepsTheExistingRole() {
    registerEmail("admin@example.com");
    registerGoogle("google-id", "google@example.com", true);
    registerGoogle("google-id", "google@example.com", false);

    assertThat(memberRepository.findByGoogleId("google-id").orElseThrow().getRole())
      .isEqualTo(MemberRole.USER);
  }

  @Test
  void deletingAllMembersAndRestartingDoesNotReuseTheAdminClaim() {
    registerEmail("first@example.com");
    memberRepository.deleteAll();
    sequenceInitializer.run(new DefaultApplicationArguments());
    registerEmail("later@example.com");

    assertThat(memberRepository.findByEmail("later@example.com").orElseThrow().getRole())
      .isEqualTo(MemberRole.USER);
  }

  @Test
  void existingMembersConsumeTheInitialClaimDuringUpgrade() {
    memberRepository.saveAndFlush(Member.builder()
      .firstName("기존")
      .lastName("회원")
      .email("existing@example.com")
      .password("existing-test-hash")
      .build());
    sequenceRepository.deleteById("MEMBER_REGISTRATION");
    sequenceInitializer.run(new DefaultApplicationArguments());

    registerEmail("new@example.com");

    assertThat(memberRepository.findByEmail("new@example.com").orElseThrow().getRole())
      .isEqualTo(MemberRole.USER);
  }

  @Test
  void disabledDummyDataDoesNotCreateEmployees() {
    assertThat(context.getBeansOfType(EmployeeDummyDataInitializer.class)).isEmpty();
    assertThat(employeeRepository.count()).isZero();
  }

  private void assertRoles(String adminEmail) {
    assertThat(memberRepository.findAll()).hasSize(3).allSatisfy(member ->
      assertThat(member.getRole()).isEqualTo(
        member.getEmail().equals(adminEmail) ? MemberRole.ADMIN : MemberRole.USER
      )
    );
  }

  private void registerEmail(String email) {
    memberService.register(registration(email));
  }

  private MemberRegisterDto registration(String email) {
    MemberRegisterDto dto = new MemberRegisterDto();
    dto.setFirstName("테스트");
    dto.setLastName("회원");
    dto.setEmail(email);
    dto.setPassword("ValidPassword123!");
    return dto;
  }

  private void registerGoogle(String id, String email, boolean signup) {
    googleMemberService.login(
      new GoogleIdTokenValidator.GoogleProfile(id, email, true),
      GoogleAuthFlow.builder().signup(signup).firstName("구글").lastName("회원").build()
    );
  }

  private void registerKakao(Long id, String email) {
    when(kakaoClientService.getProfile("code", "state")).thenReturn(
      new KakaoClientService.KakaoProfile(
        id, new KakaoClientService.KakaoAccount(email, true, true)
      )
    );
    kakaoAuthService.login(new KakaoLoginRequestDto("code", "state", true, "카카오", "회원"));
  }
}
