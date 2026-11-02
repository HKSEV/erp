package com.example.demo.service;

import com.example.demo.config.JwtProvider;
import com.example.demo.dto.MemberLoginDto;
import com.example.demo.dto.MemberRegisterDto;
import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class MemberService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtProvider jwtProvider;
  private final JavaMailSender mailSender;
  private final SecureRandom passwordResetRandom = new SecureRandom();

  @Value("${app.frontend-url:http://localhost:3000}")
  private String frontendUrl;

  @Transactional
  public void register(MemberRegisterDto dto) {
    // 이메일 중복 체크
    if (memberRepository.existsByEmail(dto.getEmail())) {
      throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
    }

    // 비밀번호 암호화 후 엔티티 생성
    Member member = Member.builder()
      .firstName(dto.getFirstName())
      .lastName(dto.getLastName())
      .email(dto.getEmail())
      .password(passwordEncoder.encode(dto.getPassword())) // 암호화
      .companyName(dto.getCompanyName())
      .position(dto.getPosition())
      .tel(dto.getTel())
      .address(dto.getAddress())
      .detailAddress(dto.getDetailAddress())
      .gender(dto.getGender())
      .build();

    memberRepository.save(member);
  }

  public String login(MemberLoginDto dto) {
    Member member = memberRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

    if (!passwordEncoder.matches(dto.getPassword(), member.getPassword())) {
      throw new IllegalArgumentException("잘못된 비밀번호입니다.");
    }

    // 비밀번호가 일치하면 JWT 토큰 생성 및 반환
    return jwtProvider.generateToken(member.getEmail());
  }

  // 1. 임시 비밀번호 발급 및 메일 전송
//  @Transactional
//  public void sendTempPassword(String email) {
//    Member member = memberRepository.findByEmail(email)
//      .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));
//
//    // 8자리 랜덤 임시 비밀번호 생성
//    String tempPassword = UUID.randomUUID().toString().substring(0, 8);
//
//    // DB 비밀번호 업데이트
//    member.setPassword(passwordEncoder.encode(tempPassword));
//
//    // 메일 발송
//    SimpleMailMessage message = new SimpleMailMessage();
//    message.setTo(email);
//    message.setSubject("[ERP 시스템] 임시 비밀번호 발급 안내");
//    message.setText("요청하신 임시 비밀번호는 [" + tempPassword + "] 입니다.\n로그인 후 마이페이지에서 반드시 비밀번호를 변경해 주세요.");
//    mailSender.send(message);
//  }
  @Transactional
  public void sendPasswordResetLink(String email) {
    if (email == null || email.isBlank() || email.strip().length() > 100) {
      throw new IllegalArgumentException("이메일을 올바르게 입력해 주세요.");
    }

    Member member = memberRepository
      .findByEmailForPasswordReset(email.strip())
      .orElse(null);

    // 가입 여부와 관계없이 컨트롤러에서 같은 안내를 반환합니다.
    if (member == null) {
      return;
    }

    byte[] bytes = new byte[32];
    passwordResetRandom.nextBytes(bytes);

    String token = Base64.getUrlEncoder()
      .withoutPadding()
      .encodeToString(bytes);

    // 재발급하면 이전 토큰을 덮어써서 무효화합니다.
    member.setPasswordResetTokenHash(hashResetToken(token));
    member.setPasswordResetExpiresAt(
      LocalDateTime.now(ZoneOffset.UTC).plusMinutes(15)
    );
    memberRepository.flush();

    String resetUrl = frontendUrl.replaceAll("/+$", "")
      + "/forgot/reset?token=" + token;

    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(member.getEmail());
    message.setSubject("[ERP 시스템] 비밀번호 재설정 안내");
    message.setText(
      "아래 링크에서 새 비밀번호를 설정해 주세요.\n\n"
        + resetUrl
        + "\n\n이 링크는 15분 동안 한 번만 사용할 수 있습니다."
        + "\n새 링크를 요청하면 이전 링크는 사용할 수 없습니다."
        + "\n본인이 요청하지 않았다면 이 메일을 무시해 주세요."
    );

    mailSender.send(message);
  }

  @Transactional
  public void resetPassword(String token, String newPassword) {
    if (token == null || !token.matches("[A-Za-z0-9_-]{43}")) {
      throw invalidResetLink();
    }

    if (newPassword == null || newPassword.isBlank()
      || newPassword.length() < 8 || newPassword.length() > 64
      || newPassword.getBytes(StandardCharsets.UTF_8).length > 72) {
      throw new IllegalArgumentException(
        "비밀번호는 8~64자, UTF-8 기준 72바이트 이하로 입력해 주세요."
      );
    }

    String hash = hashResetToken(token);

    Member member = memberRepository
      .findByResetTokenHashForUpdate(hash)
      .orElseThrow(this::invalidResetLink);

    if (!hash.equals(member.getPasswordResetTokenHash())
      || member.getPasswordResetExpiresAt() == null
      || !member.getPasswordResetExpiresAt()
      .isAfter(LocalDateTime.now(ZoneOffset.UTC))) {
      throw invalidResetLink();
    }

    member.setPassword(passwordEncoder.encode(newPassword));

    // 변경 성공 후에는 같은 링크를 다시 사용할 수 없습니다.
    member.setPasswordResetTokenHash(null);
    member.setPasswordResetExpiresAt(null);
    memberRepository.flush();
  }

  private String hashResetToken(String token) {
    try {
      byte[] hash = MessageDigest.getInstance("SHA-256")
        .digest(token.getBytes(StandardCharsets.UTF_8));

      return HexFormat.of().formatHex(hash);
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(
        "재설정 토큰을 처리하지 못했습니다.", e
      );
    }
  }

  private IllegalArgumentException invalidResetLink() {
    return new IllegalArgumentException(
      "재설정 링크가 만료되었거나 유효하지 않습니다. 새 링크를 요청해 주세요."
    );
  }

  // 2. 마이페이지 비밀번호 변경
  @Transactional
  public void changePassword(String email, String oldPassword, String newPassword) {
    Member member = memberRepository.findByEmail(email)
      .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

    if (!passwordEncoder.matches(oldPassword, member.getPassword())) {
      throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
    }

    member.setPassword(passwordEncoder.encode(newPassword));
    member.setPasswordResetTokenHash(null);
    member.setPasswordResetExpiresAt(null);
  }
}