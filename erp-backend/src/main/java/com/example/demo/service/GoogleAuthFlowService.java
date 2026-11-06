package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.GoogleAuthFlow;
import com.example.demo.repository.GoogleAuthFlowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class GoogleAuthFlowService {
	private final GoogleAuthFlowRepository repository;
	private final GoogleClientService client;
	private final SecureRandom random = new SecureRandom();

	@Transactional
	public GoogleAuthorizeResponseDto start(GoogleAuthorizeRequestDto dto) {
		if (dto.signup() && (
			dto.firstName() == null || dto.firstName().isBlank()
				|| dto.lastName() == null || dto.lastName().isBlank()
		)) {
			throw new ResponseStatusException(
				HttpStatus.BAD_REQUEST, "성과 이름을 입력해 주세요."
			);
		}

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		repository.deleteExpired(now);

		String state = randomValue();
		String flowToken = randomValue();
		String nonce = randomValue();
		String verifier = randomValue();

		repository.saveAndFlush(GoogleAuthFlow.builder()
			.stateHash(hash(state))
			.flowTokenHash(hash(flowToken))
			.nonce(nonce)
			.codeVerifier(verifier)
			.signup(dto.signup())
			.firstName(dto.signup() ? dto.firstName().strip() : null)
			.lastName(dto.signup() ? dto.lastName().strip() : null)
			.expiresAt(now.plusMinutes(5))
			.build());

		String challenge = Base64.getUrlEncoder().withoutPadding()
			.encodeToString(digest(verifier));

		return new GoogleAuthorizeResponseDto(
			client.authorizationUrl(state, nonce, challenge),
			state,
			flowToken
		);
	}

	// 이후 Google 통신에 실패해도 사용한 요청은 재사용하지 않습니다.
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public GoogleAuthFlow consume(GoogleLoginRequestDto dto) {
		GoogleAuthFlow flow = repository.findForUpdate(hash(dto.state()))
			.orElseThrow(this::invalidFlow);

		if (!flow.getExpiresAt().isAfter(LocalDateTime.now(ZoneOffset.UTC))
			|| !MessageDigest.isEqual(
			flow.getFlowTokenHash().getBytes(StandardCharsets.US_ASCII),
			hash(dto.flowToken()).getBytes(StandardCharsets.US_ASCII)
		)) {
			throw invalidFlow();
		}

		repository.delete(flow);
		repository.flush();

		return flow;
	}

	private String randomValue() {
		byte[] bytes = new byte[32];
		random.nextBytes(bytes);
		return HexFormat.of().formatHex(bytes);
	}

	private String hash(String value) {
		return HexFormat.of().formatHex(digest(value));
	}

	private byte[] digest(String value) {
		try {
			return MessageDigest.getInstance("SHA-256")
				.digest(value.getBytes(StandardCharsets.US_ASCII));
		} catch (NoSuchAlgorithmException exception) {
			throw new IllegalStateException(exception);
		}
	}

	private ResponseStatusException invalidFlow() {
		return new ResponseStatusException(
			HttpStatus.UNAUTHORIZED,
			"Google 인증 요청이 만료되었거나 유효하지 않습니다. 다시 시작해 주세요."
		);
	}
}