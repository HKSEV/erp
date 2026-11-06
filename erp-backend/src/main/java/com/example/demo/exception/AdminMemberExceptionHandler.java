package com.example.demo.exception;

import com.example.demo.controller.AdminMemberController;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice(assignableTypes = AdminMemberController.class)
public class AdminMemberExceptionHandler {
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

	// 없는 역할 값(예: "OWNER")이나 true/false가 아닌 값, 문자가 아닌 부서·직급
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> handleInvalidBody(
		HttpMessageNotReadableException exception
	) {
		return ResponseEntity.badRequest().body(Map.of(
			"message", "요청 값을 확인해 주세요."
		));
	}

	// 회원 번호 자리에 숫자가 아닌 값
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<Map<String, String>> handleTypeMismatch(
		MethodArgumentTypeMismatchException exception
	) {
		return ResponseEntity.badRequest().body(Map.of(
			"message", "회원 번호를 확인해 주세요."
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
	public ResponseEntity<Map<String, String>> handleRelatedData(
		DataIntegrityViolationException exception
	) {
		return ResponseEntity.status(409).body(Map.of(
			"message",
			"회원이 사용 중인 데이터가 있습니다. 잠시 후 다시 시도해 주세요."
		));
	}
}
