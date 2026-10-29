package com.example.demo.config;

import com.example.demo.repository.MemberRepository;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
      )

      .authorizeHttpRequests(auth -> auth
        .requestMatchers(
          "/api/members/**",
          "/api/production/**"
        ).permitAll()

        .requestMatchers(
          "/api/schedules",
          "/api/schedules/**"
        ).authenticated()

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