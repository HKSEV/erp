package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "GOOGLE_AUTH_FLOWS", indexes = {
	@Index(name = "IDX_GOOGLE_AUTH_EXPIRES", columnList = "EXPIRES_AT")
})
@JsonIgnoreType
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class GoogleAuthFlow {
	@Id
	@Column(name = "STATE_HASH", length = 64)
	private String stateHash;

	@Column(name = "FLOW_TOKEN_HASH", nullable = false, length = 64)
	private String flowTokenHash;

	@Column(name = "AUTH_NONCE", nullable = false, length = 64)
	private String nonce;

	@Column(name = "CODE_VERIFIER", nullable = false, length = 64)
	private String codeVerifier;

	@Column(name = "IS_SIGNUP", nullable = false)
	private boolean signup;

	@Column(name = "FIRST_NAME", length = 50)
	private String firstName;

	@Column(name = "LAST_NAME", length = 50)
	private String lastName;

	@Column(name = "EXPIRES_AT", nullable = false)
	private LocalDateTime expiresAt;
}