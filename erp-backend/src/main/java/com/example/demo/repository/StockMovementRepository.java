package com.example.demo.repository;

import com.example.demo.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
  // 최근 이력부터 (처리자 이름을 함께 가져와 행마다 추가 조회하지 않음)
  @Query("""
    select m from StockMovement m
    left join fetch m.member
    where m.item.id = :itemId
    order by m.id desc
    """)
  List<StockMovement> findByItemIdWithMember(
    @Param("itemId") String itemId
  );

  @Modifying(flushAutomatically = true)
  @Query("delete from StockMovement m where m.item.id = :itemId")
  int deleteByItemId(@Param("itemId") String itemId);

  @Modifying(flushAutomatically = true)
  @Query("update StockMovement m set m.member = null where m.member.id = :memberId")
  int unlinkMember(@Param("memberId") Long memberId);
}
