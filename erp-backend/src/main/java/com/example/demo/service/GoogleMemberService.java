package com.example.demo.service;

import com.example.demo.config.JwtProvider;
import com.example.demo.dto.TokenResponseDto;
import com.example.demo.entity.GoogleAuthFlow;
import com.example.demo.entity.Member;
import com.example.demo.entity.MemberRole;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleMemberService {
	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtProvider jwtProvider;

	@Transactional
	public TokenResponseDto login(
		GoogleIdTokenValidator.GoogleProfile profile,
		GoogleAuthFlow flow
	) {
		Member member = memberRepository
			.findByGoogleId(profile.id())
			.orElse(null);

		if (member == null) {
			if (!flow.isSignup()) {
				throw new ResponseStatusException(
					HttpStatus.CONFLICT,
					"회원가입 화면에서 성과 이름을 입력한 후 Google 가입을 진행해 주세요."
				);
			}

			if (!profile.emailVerified() || profile.email() == null
				|| profile.email().isBlank()
				|| profile.email().strip().length() > 100) {
				throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"Google의 인증된 이메일 정보가 필요합니다."
				);
			}

			String email = profile.email().strip();

			if (memberRepository.existsByEmail(email)) {
				throw new ResponseStatusException(
					HttpStatus.CONFLICT,
					"같은 이메일로 가입된 계정이 있습니다. 기존 가입 방식으로 로그인해 주세요."
				);
			}

			member = memberRepository.saveAndFlush(Member.builder()
				.firstName(flow.getFirstName())
				.lastName(flow.getLastName())
				.email(email)
				.password(passwordEncoder.encode(UUID.randomUUID().toString()))
				.googleId(profile.id())
				.role(MemberRole.USER)
				.active(true)
				.build());
		}

		if (!member.isActive() || member.hasResignedEmployee()) {
			throw new ResponseStatusException(
				HttpStatus.FORBIDDEN, "사용이 중지된 계정입니다."
			);
		}

		return new TokenResponseDto(
			jwtProvider.generateToken(member.getEmail(), member.getId())
		);
	}
}