package com.example.demo.repository;

import com.example.demo.entity.GoogleAuthFlow;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface GoogleAuthFlowRepository
	extends JpaRepository<GoogleAuthFlow, String> {

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select f from GoogleAuthFlow f where f.stateHash = :hash")
	Optional<GoogleAuthFlow> findForUpdate(@Param("hash") String hash);

	@Modifying(flushAutomatically = true)
	@Query("delete from GoogleAuthFlow f where f.expiresAt <= :now")
	int deleteExpired(@Param("now") LocalDateTime now);
}