package com.example.demo.repository;

import com.example.demo.entity.ProductionOrder;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, String> {
  // 기본 CRUD 메서드(findAll, findById, save, delete)가 자동으로 제공됩니다.
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select productionOrder from ProductionOrder productionOrder where productionOrder.id = :orderId")
	Optional<ProductionOrder> findForUpdate(@Param("orderId") String orderId);
}
