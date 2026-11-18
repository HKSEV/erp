package com.example.demo.repository;

import com.example.demo.entity.DocumentSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DocumentSequenceRepository extends JpaRepository<DocumentSequence, String> {
	// 초기화 상태를 같은 트랜잭션에서 한 번만 선점합니다.
	@Modifying
	@Query("update DocumentSequence counter set counter.lastValue = 1 "
		+ "where counter.sequenceKey = :key and counter.lastValue = 0")
	int claimInitialValue(@Param("key") String key);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select counter from DocumentSequence counter where counter.sequenceKey = :key")
	Optional<DocumentSequence> findForUpdate(@Param("key") String key);
}
