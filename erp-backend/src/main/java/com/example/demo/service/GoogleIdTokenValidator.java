package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Set;

@Component
public class GoogleIdTokenValidator {
	private final JwtDecoder decoder;
	private final String clientId;

	public GoogleIdTokenValidator(
		@Value("${google.client-id}") String clientId
	) {
		this.clientId = clientId;

		var factory = new SimpleClientHttpRequestFactory();
		factory.setConnectTimeout(Duration.ofSeconds(5));
		factory.setReadTimeout(Duration.ofSeconds(5));

		this.decoder = NimbusJwtDecoder
			.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
			.jwsAlgorithm(SignatureAlgorithm.RS256)
			.restOperations(new RestTemplate(factory))
			.build();
	}

	public GoogleProfile validate(
		String idToken, String expectedNonce
	) {
		try {
			Jwt jwt = decoder.decode(idToken);

			String issuer = jwt.getClaimAsString("iss");
			String nonce = jwt.getClaimAsString("nonce");
			String subject = jwt.getSubject();
			String authorizedParty = jwt.getClaimAsString("azp");
			Instant now = Instant.now();

			if (issuer == null || !Set.of(
				"https://accounts.google.com", "accounts.google.com"
			).contains(issuer)
				|| jwt.getAudience() == null
				|| !jwt.getAudience().contains(clientId)
				|| (jwt.getAudience().size() > 1 && authorizedParty == null)
				|| (authorizedParty != null && !clientId.equals(authorizedParty))
				|| jwt.getExpiresAt() == null
				|| !jwt.getExpiresAt().isAfter(now)
				|| jwt.getIssuedAt() == null
				|| jwt.getIssuedAt().isAfter(now.plusSeconds(60))
				|| nonce == null
				|| !MessageDigest.isEqual(
				expectedNonce.getBytes(StandardCharsets.UTF_8),
				nonce.getBytes(StandardCharsets.UTF_8)
			)
				|| subject == null
				|| !subject.matches("[\\x21-\\x7E]{1,255}")) {
				throw invalidToken();
			}

			return new GoogleProfile(
				subject,
				jwt.getClaimAsString("email"),
				Boolean.TRUE.equals(jwt.getClaimAsBoolean("email_verified"))
			);
		} catch (JwtException | IllegalArgumentException exception) {
			throw invalidToken();
		}
	}

	private ResponseStatusException invalidToken() {
		return new ResponseStatusException(
			HttpStatus.UNAUTHORIZED,
			"Google 인증 정보가 유효하지 않습니다. 다시 로그인해 주세요."
		);
	}

	public record GoogleProfile(
		String id, String email, boolean emailVerified
	) {
	}
}