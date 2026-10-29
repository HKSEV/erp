package com.example.demo.config;

import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;

import io.jsonwebtoken.JwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final String SCHEDULE_PATH = "/api/schedules";

	private final JwtProvider jwtProvider;
	private final MemberRepository memberRepository;

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String path = request.getServletPath();

		// 이번에 추가하는 일정 API에 JWT 인증을 적용합니다.
		return !(
			SCHEDULE_PATH.equals(path)
				|| path.startsWith(SCHEDULE_PATH + "/")
		);
	}

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {

		String authorization =
			request.getHeader(HttpHeaders.AUTHORIZATION);

		if (
			authorization == null
				|| !authorization.regionMatches(
				true, 0, "Bearer ", 0, 7
			)
		) {
			writeUnauthorized(response);
			return;
		}

		String token = authorization.substring(7).trim();

		try {
			// 기존 메서드가 JWT 서명과 만료를 함께 검증합니다.
			String email = jwtProvider.getEmailFromToken(token);

			if (email == null || email.isBlank()) {
				throw new BadCredentialsException(
					"토큰에 회원 정보가 없습니다."
				);
			}

			Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new BadCredentialsException(
					"존재하지 않는 회원입니다."
				));

			// principal에 인증된 회원 ID를 저장합니다.
			var authentication =
				new UsernamePasswordAuthenticationToken(
					member.getId(),
					null,
					List.of()
				);

			authentication.setDetails(
				new WebAuthenticationDetailsSource()
					.buildDetails(request)
			);

			SecurityContext context =
				SecurityContextHolder.createEmptyContext();

			context.setAuthentication(authentication);
			SecurityContextHolder.setContext(context);

		} catch (
			JwtException
			| IllegalArgumentException
			| BadCredentialsException e
		) {
			writeUnauthorized(response);
			return;
		}

		// 서비스·컨트롤러 오류를 JWT 오류로 분류하지 않도록
		// 인증 검사 try/catch 밖에서 호출합니다.
		filterChain.doFilter(request, response);
	}

	static void writeUnauthorized(
		HttpServletResponse response
	) throws IOException {
		SecurityContextHolder.clearContext();

		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setHeader(
			HttpHeaders.WWW_AUTHENTICATE,
			"Bearer"
		);
		response.setCharacterEncoding("UTF-8");
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);

		response.getWriter().write(
			"{\"message\":\"유효한 로그인 토큰이 필요합니다.\"}"
		);
	}
}