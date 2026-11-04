package com.example.demo.service;

import com.example.demo.entity.DocumentSequence;
import com.example.demo.repository.DocumentSequenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.MANDATORY)
public class DocumentNumberService {
	private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
	private final DocumentSequenceRepository sequenceRepository;

	public String nextOrderId() {
		// 연도별 행을 처음 만드는 요청도 PRD 행으로 직렬화합니다.
		lock("PRD");

		int year = LocalDate.now(ZONE).getYear();
		String key = "PRD-" + year;

		DocumentSequence sequence = sequenceRepository.findById(key)
			.orElseGet(() -> sequenceRepository.save(
				new DocumentSequence(key, 0L)
			));

		return String.format(
			Locale.ROOT,
			"PRD-%04d-%03d",
			year,
			advance(sequence, 999)
		);
	}

	public String nextItemId() {
		return String.format(
			Locale.ROOT,
			"INV-%04d",
			advance(lock("INV"), 9999)
		);
	}

	public String nextEmployeeId() {
		return String.format(
			Locale.ROOT,
			"EMP-%04d",
			advance(lock("EMP"), 9999)
		);
	}

	private DocumentSequence lock(String key) {
		return sequenceRepository.findForUpdate(key)
			.orElseThrow(() -> new ResponseStatusException(
				HttpStatus.SERVICE_UNAVAILABLE,
				"번호 초기화가 필요합니다. DOCUMENT_SEQUENCE의 "
					+ key + " 행을 확인해 주세요."
			));
	}

	private long advance(DocumentSequence sequence, long limit) {
		if (sequence.getLastValue() >= limit) {
			throw new ResponseStatusException(
				HttpStatus.CONFLICT,
				"번호 생성 범위를 초과했습니다. 번호 자릿수를 확장해 주세요."
			);
		}

		long next = sequence.getLastValue() + 1;
		sequence.setLastValue(next);

		return next;
	}
}