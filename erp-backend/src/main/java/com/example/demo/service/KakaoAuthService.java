package com.example.demo.service;

import com.example.demo.config.JwtProvider;
import com.example.demo.dto.KakaoLoginRequestDto;
import com.example.demo.dto.TokenResponseDto;
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
public class KakaoAuthService {
	private final KakaoClientService kakaoClientService;
	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtProvider jwtProvider;

	@Transactional
	public TokenResponseDto login(KakaoLoginRequestDto dto) {
		KakaoClientService.KakaoProfile profile =
			kakaoClientService.getProfile(dto.code(), dto.state());

		String kakaoId = profile.id().toString();
		Member member = memberRepository.findByKakaoId(kakaoId).orElse(null);

		if (member == null) {
			if (!dto.signup()) {
				throw new ResponseStatusException(
					HttpStatus.CONFLICT,
					"회원가입 화면에서 성과 이름을 입력한 후 카카오 가입을 진행해 주세요."
				);
			}

			if (dto.firstName() == null || dto.firstName().isBlank()
				|| dto.lastName() == null || dto.lastName().isBlank()) {
				throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"성과 이름을 입력해 주세요."
				);
			}

			KakaoClientService.KakaoAccount account = profile.account();

			if (account == null
				|| account.email() == null
				|| account.email().isBlank()
				|| account.email().strip().length() > 100
				|| !Boolean.TRUE.equals(account.emailValid())
				|| !Boolean.TRUE.equals(account.emailVerified())) {
				throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"카카오의 인증된 이메일 제공 동의가 필요합니다."
				);
			}

			String email = account.email().strip();

			if (memberRepository.existsByEmail(email)) {
				throw new ResponseStatusException(
					HttpStatus.CONFLICT,
					"같은 이메일로 가입된 계정이 있습니다. 기존 이메일 로그인을 이용해 주세요."
				);
			}

			member = memberRepository.saveAndFlush(Member.builder()
				.firstName(dto.firstName().strip())
				.lastName(dto.lastName().strip())
				.email(email)
				.password(passwordEncoder.encode(UUID.randomUUID().toString()))
				.kakaoId(kakaoId)
				.role(MemberRole.USER)
				.active(true)
				.build());
		}

		if (!member.isActive() || member.hasResignedEmployee()) {
			throw new ResponseStatusException(
				HttpStatus.FORBIDDEN,
				"사용이 중지된 계정입니다."
			);
		}

		return new TokenResponseDto(
			jwtProvider.generateToken(member.getEmail(), member.getId())
		);
	}
}