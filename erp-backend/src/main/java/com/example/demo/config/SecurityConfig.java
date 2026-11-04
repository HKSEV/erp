package com.example.demo.config;

import com.example.demo.repository.MemberRepository;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(
    HttpSecurity http,
    JwtProvider jwtProvider,
    MemberRepository memberRepository
  ) throws Exception {

    JwtAuthenticationFilter jwtFilter =
      new JwtAuthenticationFilter(
        jwtProvider,
        memberRepository
      );

    http
      .csrf(AbstractHttpConfigurer::disable)
      .cors(Customizer.withDefaults())
      .formLogin(AbstractHttpConfigurer::disable)
      .httpBasic(AbstractHttpConfigurer::disable)

      .sessionManagement(session -> session
        .sessionCreationPolicy(
          SessionCreationPolicy.STATELESS
        )
      )

      .exceptionHandling(exception -> exception
        .authenticationEntryPoint(
          (request, response, authException) ->
            JwtAuthenticationFilter
              .writeUnauthorized(response)
        )
        // 로그인은 했지만 권한(역할)이 부족한 경우
        .accessDeniedHandler(
          (request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setCharacterEncoding("UTF-8");
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
              "{\"message\":\"관리자만 사용할 수 있습니다.\"}"
            );
          }
        )
      )

      .authorizeHttpRequests(auth -> auth
        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

        .requestMatchers(
          "/api/members/me",
          "/api/members/me/**",
          "/api/members/change-password",
          "/api/members/change-password/**",
          "/api/schedules",
          "/api/schedules/**",
          "/api/production",
          "/api/production/**",
          "/api/inventory",
          "/api/inventory/**",
          "/api/hr",
          "/api/hr/**"
        ).authenticated()

        // 시스템관리: 사용자 권한 관리와 회사 정보 수정은 관리자만
        .requestMatchers(
          "/api/admin",
          "/api/admin/**"
        ).hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/company").hasRole("ADMIN")
        .requestMatchers(HttpMethod.GET, "/api/company").authenticated()

        // 로그인·회원가입·비밀번호 찾기 (members/me 등은 위에서 먼저 로그인 필요로 처리)
        .requestMatchers("/api/members/**").permitAll()

        .anyRequest().authenticated()
      )

      .addFilterBefore(
        jwtFilter,
        UsernamePasswordAuthenticationFilter.class
      );

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration =
      new CorsConfiguration();

    configuration.setAllowedOrigins(List.of(
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ));

    configuration.setAllowedMethods(List.of(
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ));

    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
      new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration(
      "/**",
      configuration
    );

    return source;
  }
}