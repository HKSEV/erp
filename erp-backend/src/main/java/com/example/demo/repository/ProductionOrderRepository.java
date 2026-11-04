package com.example.demo.repository;

import com.example.demo.entity.ProductionOrder;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, String> {
  // 기본 CRUD 메서드(findAll, findById, save, delete)가 자동으로 제공됩니다.
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select productionOrder from ProductionOrder productionOrder where productionOrder.id = :orderId")
	Optional<ProductionOrder> findForUpdate(@Param("orderId") String orderId);

	boolean existsByItem_Id(String itemId);

	// 재고관리에서 품목명을 바꾸면 그 품목을 쓰는 오더의 제품명도 바꿉니다.
	@Modifying(flushAutomatically = true, clearAutomatically = true)
	@Query("update ProductionOrder o set o.productName = :name where o.item.id = :itemId")
	int renameProduct(@Param("itemId") String itemId, @Param("name") String name);
}
