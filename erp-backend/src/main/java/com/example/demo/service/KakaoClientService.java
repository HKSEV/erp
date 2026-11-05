package com.example.demo.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

@Component
public class KakaoClientService {
	private final RestClient client;
	private final String clientId;
	private final String clientSecret;
	private final String redirectUri;

	public KakaoClientService(
		@Value("${kakao.client-id}") String clientId,
		@Value("${kakao.client-secret}") String clientSecret,
		@Value("${kakao.redirect-uri}") String redirectUri
	) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectUri = redirectUri;

		var factory = new SimpleClientHttpRequestFactory();
		factory.setConnectTimeout(Duration.ofSeconds(5));
		factory.setReadTimeout(Duration.ofSeconds(5));

		this.client = RestClient.builder()
			.requestFactory(factory)
			.build();
	}

	public KakaoProfile getProfile(String code, String state) {
		var form = new LinkedMultiValueMap<String, String>();
		form.add("grant_type", "authorization_code");
		form.add("client_id", clientId);
		form.add("client_secret", clientSecret);
		form.add("redirect_uri", redirectUri);
		form.add("code", code);
		form.add("state", state);

		try {
			KakaoToken token = client.post()
				.uri("https://kauth.kakao.com/oauth/token")
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.body(form)
				.retrieve()
				.body(KakaoToken.class);

			if (token == null
				|| token.accessToken() == null
				|| token.accessToken().isBlank()) {
				throw invalidResponse();
			}

			KakaoProfile profile = client.get()
				.uri("https://kapi.kakao.com/v2/user/me")
				.headers(headers -> headers.setBearerAuth(token.accessToken()))
				.retrieve()
				.body(KakaoProfile.class);

			if (profile == null || profile.id() == null || profile.id() <= 0)
				throw invalidResponse();

			return profile;
		} catch (RestClientException exception) {
			throw invalidResponse();
		}
	}

	private ResponseStatusException invalidResponse() {
		return new ResponseStatusException(
			HttpStatus.BAD_GATEWAY,
			"카카오 인증을 완료하지 못했습니다. 다시 시도해 주세요."
		);
	}

	public record KakaoToken(
		@JsonProperty("access_token") String accessToken
	) {
	}

	public record KakaoProfile(
		Long id,
		@JsonProperty("kakao_account") KakaoAccount account
	) {
	}

	public record KakaoAccount(
		String email,
		@JsonProperty("is_email_valid") Boolean emailValid,
		@JsonProperty("is_email_verified") Boolean emailVerified
	) {
	}
}