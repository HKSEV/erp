package com.example.demo.exception;

import com.example.demo.controller.MemberController;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice(assignableTypes = MemberController.class)
public class MemberExceptionHandler {
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidation(
		MethodArgumentNotValidException exception
	) {
		String message = exception.getBindingResult().getFieldErrors().stream()
			.map(error -> error.getDefaultMessage())
			.findFirst()
			.orElse("입력값을 확인해 주세요.");

		return ResponseEntity.badRequest().body(Map.of("message", message));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> handleInvalidBody(
		HttpMessageNotReadableException exception
	) {
		return ResponseEntity.badRequest().body(Map.of(
			"message", "요청 본문의 형식과 입력값을 확인해 주세요."
		));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, String>> handleInvalidValue(
		IllegalArgumentException exception
	) {
		return ResponseEntity.badRequest().body(Map.of(
			"message", exception.getMessage() == null
				? "입력값을 확인해 주세요."
				: exception.getMessage()
		));
	}

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> handleStatus(
		ResponseStatusException exception
	) {
		return ResponseEntity.status(exception.getStatusCode()).body(Map.of(
			"message", exception.getReason() == null
				? "요청을 처리할 수 없습니다."
				: exception.getReason()
		));
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<Map<String, String>> handleDuplicateAccount(
		DataIntegrityViolationException exception
	) {
		return ResponseEntity.status(409).body(Map.of(
			"message",
			"이미 가입된 계정입니다. 로그인 화면에서 다시 시도해 주세요."
		));
	}
}