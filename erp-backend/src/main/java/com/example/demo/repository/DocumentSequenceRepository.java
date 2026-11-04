package com.example.demo.repository;

import com.example.demo.entity.DocumentSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DocumentSequenceRepository extends JpaRepository<DocumentSequence, String> {
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select counter from DocumentSequence counter where counter.sequenceKey = :key")
	Optional<DocumentSequence> findForUpdate(@Param("key") String key);
}