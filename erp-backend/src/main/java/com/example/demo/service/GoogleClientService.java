package com.example.demo.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Duration;

@Component
public class GoogleClientService {
	private final RestClient client;
	private final String clientId;
	private final String clientSecret;
	private final String redirectUri;

	public GoogleClientService(
		@Value("${google.client-id}") String clientId,
		@Value("${google.client-secret}") String clientSecret,
		@Value("${google.redirect-uri}") String redirectUri
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

	public String authorizationUrl(
		String state, String nonce, String challenge
	) {
		return UriComponentsBuilder
			.fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
			.queryParam("client_id", clientId)
			.queryParam("redirect_uri", redirectUri)
			.queryParam("response_type", "code")
			.queryParam("scope", "openid email")
			.queryParam("state", state)
			.queryParam("nonce", nonce)
			.queryParam("code_challenge", challenge)
			.queryParam("code_challenge_method", "S256")
			.queryParam("access_type", "online")
			.queryParam("prompt", "select_account")
			.build().encode().toUriString();
	}

	public String exchange(String code, String verifier) {
		var form = new LinkedMultiValueMap<String, String>();
		form.add("grant_type", "authorization_code");
		form.add("client_id", clientId);
		form.add("client_secret", clientSecret);
		form.add("redirect_uri", redirectUri);
		form.add("code", code);
		form.add("code_verifier", verifier);

		try {
			GoogleToken token = client.post()
				.uri("https://oauth2.googleapis.com/token")
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.body(form)
				.retrieve()
				.body(GoogleToken.class);

			if (token == null || token.idToken() == null
				|| token.idToken().isBlank()
				|| token.idToken().length() > 16384) {
				throw invalidResponse();
			}

			return token.idToken();
		} catch (RestClientException exception) {
			throw invalidResponse();
		}
	}

	private ResponseStatusException invalidResponse() {
		return new ResponseStatusException(
			HttpStatus.BAD_GATEWAY,
			"Google 인증을 완료하지 못했습니다. 다시 시도해 주세요."
		);
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public record GoogleToken(
		@JsonProperty("id_token") String idToken
	) {
	}
}