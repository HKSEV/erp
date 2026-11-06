package com.example.demo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

  private final Key key;
  private final long expirationTime;

  // 생성자를 통해 application.properties의 값을 주입받습니다.
  public JwtProvider(@Value("${jwt.secret}") String secretKey,
                     @Value("${jwt.expiration-time}") long expirationTime) {

    // Base64로 인코딩된 문자열을 디코딩하여 안전한 Key 객체로 변환합니다.
    byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    this.key = Keys.hmacShaKeyFor(keyBytes);

    this.expirationTime = expirationTime;
  }

  public String generateToken(String email, Long memberId) {
    if (memberId == null)
      throw new IllegalArgumentException("회원 번호가 없습니다.");

    return Jwts.builder()
      .setSubject(email)
      .claim("memberId", memberId.toString())
      .setIssuedAt(new Date())
      .setExpiration(
        new Date(System.currentTimeMillis() + expirationTime)
      )
      .signWith(key, SignatureAlgorithm.HS256)
      .compact();
  }

  /**
   * JWT 토큰에서 사용자 이메일을 추출합니다.
   *
   * 토큰의 서명과 만료 시간도 함께 검증하므로,
   * 유효하지 않은 토큰이면 JwtException이 발생합니다.
   */
  public String getEmailFromToken(String token) {
    return getClaims(token).getSubject();
  }

  public Long getMemberIdFromToken(String token) {
    String memberId = getClaims(token).get("memberId", String.class);

    if (memberId == null || memberId.isBlank())
      throw new IllegalArgumentException("토큰에 회원 번호가 없습니다.");

    return Long.valueOf(memberId);
  }

  private Claims getClaims(String token) {
    if (token == null || token.isBlank())
      throw new IllegalArgumentException("JWT 토큰이 없습니다.");

    return Jwts.parserBuilder()
      .setSigningKey(key)
      .build()
      .parseClaimsJws(token)
      .getBody();
  }
}
