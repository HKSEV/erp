package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.GoogleAuthFlow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {
	private final GoogleAuthFlowService flowService;
	private final GoogleClientService clientService;
	private final GoogleIdTokenValidator validator;
	private final GoogleMemberService memberService;

	public GoogleAuthorizeResponseDto authorize(
		GoogleAuthorizeRequestDto dto
	) {
		return flowService.start(dto);
	}

	public TokenResponseDto login(GoogleLoginRequestDto dto) {
		GoogleAuthFlow flow = flowService.consume(dto);

		String idToken = clientService.exchange(
			dto.code(), flow.getCodeVerifier()
		);

		var profile = validator.validate(idToken, flow.getNonce());

		return memberService.login(profile, flow);
	}
}