package com.example.demo.repository;

import com.example.demo.entity.InventoryItem;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {
  // 기본 CRUD 메서드(findAll, findById, save, delete)가 자동으로 제공됩니다.

  // 재고를 바꾸는 요청이 동시에 와도 한 번에 하나씩 처리하도록 품목 행을 잠급니다.
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select i from InventoryItem i where i.id = :itemId")
  Optional<InventoryItem> findByIdForUpdate(
    @Param("itemId") String itemId
  );
}
