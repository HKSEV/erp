package com.example.demo.exception;

import com.example.demo.controller.CompanyController;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice(assignableTypes = CompanyController.class)
public class CompanyExceptionHandler {
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidation(
		MethodArgumentNotValidException exception
	) {
		String message = exception.getBindingResult().getFieldErrors()
			.stream()
			.map(error -> error.getDefaultMessage())
			.findFirst()
			.orElse("입력값을 확인해 주세요.");

		return ResponseEntity.badRequest()
			.body(Map.of("message", message));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> handleInvalidBody(
		HttpMessageNotReadableException exception
	) {
		return ResponseEntity.badRequest().body(Map.of(
			"message", "요청 형식을 확인해 주세요."
		));
	}

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> handleStatus(
		ResponseStatusException exception
	) {
		String message = exception.getReason() == null
			? "요청을 처리할 수 없습니다."
			: exception.getReason();

		return ResponseEntity.status(exception.getStatusCode())
			.body(Map.of("message", message));
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<Map<String, String>> handleConflict(
		RuntimeException exception
	) {
		return ResponseEntity.status(409).body(Map.of(
			"message",
			"회사 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요."
		));
	}
}
