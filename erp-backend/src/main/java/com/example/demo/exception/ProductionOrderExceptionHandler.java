package com.example.demo.exception;

import com.example.demo.controller.ProductionOrderController;
import jakarta.persistence.EntityExistsException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice(assignableTypes = ProductionOrderController.class)
public class ProductionOrderExceptionHandler {
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
			"message", "요청 형식과 수량·납기일을 확인해 주세요."
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

	@ExceptionHandler({
		DataIntegrityViolationException.class,
		EntityExistsException.class,
		ConstraintViolationException.class
	})
	public ResponseEntity<Map<String, String>> handleConflict(
		RuntimeException exception
	) {
		return ResponseEntity.status(409).body(Map.of(
			"message",
			"오더 번호 중복 또는 연결된 데이터로 처리하지 못했습니다. 목록을 확인한 뒤 다시 시도해 주세요."
		));
	}
}