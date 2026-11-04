package com.example.demo.service;

import com.example.demo.dto.StockMovementRequestDto;
import com.example.demo.dto.StockMovementResponseDto;
import com.example.demo.dto.StockMovementResultDto;
import com.example.demo.entity.InventoryItem;
import com.example.demo.entity.StockMovement;
import com.example.demo.entity.StockMovementType;
import com.example.demo.repository.InventoryItemRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

// 재고 수량은 이 서비스의 record()로만 바꾸고, 바꿀 때마다 이력을 남깁니다.
@Service
@RequiredArgsConstructor
public class StockMovementService {
  private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
  private final InventoryItemRepository itemRepository;
  private final StockMovementRepository movementRepository;
  private final MemberRepository memberRepository;

  @Transactional(readOnly = true)
  public List<StockMovementResponseDto> getMovements(String itemId) {
    if (!itemRepository.existsById(itemId)) {
      throw new ResponseStatusException(
        HttpStatus.NOT_FOUND, "품목을 찾을 수 없습니다."
      );
    }

    return movementRepository.findByItemIdWithMember(itemId).stream()
      .map(StockMovementResponseDto::from)
      .toList();
  }

  // 화면에서 직접 등록하는 입고·출고
  @Transactional
  public StockMovementResultDto register(
    String itemId,
    StockMovementRequestDto dto,
    Long memberId
  ) {
    InventoryItem item = lockItem(itemId);
    StockMovement movement = record(
      item,
      StockMovementType.valueOf(dto.type()),
      dto.quantity(),
      null,
      dto.memo(),
      memberId
    );

    return new StockMovementResultDto(
      item, StockMovementResponseDto.from(movement)
    );
  }

  // 품목 행을 잠근 뒤 record()를 호출해야 동시에 들어온 요청이 재고를 덮어쓰지 않습니다.
  public InventoryItem lockItem(String itemId) {
    return itemRepository.findByIdForUpdate(itemId)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND, "품목을 찾을 수 없습니다."
      ));
  }

  // 호출한 쪽의 트랜잭션 안에서만 실행합니다. (재고 변경과 이력 저장을 함께 처리)
  @Transactional(propagation = Propagation.MANDATORY)
  public StockMovement record(
    InventoryItem item,
    StockMovementType type,
    int quantity,
    String orderId,
    String memo,
    Long memberId
  ) {
    if (quantity < 1) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "수량은 1 이상이어야 합니다."
      );
    }

    int stockAfter;

    try {
      stockAfter = type.decreases()
        ? Math.subtractExact(item.getStock(), quantity)
        : Math.addExact(item.getStock(), quantity);
    } catch (ArithmeticException e) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "재고 수량이 처리할 수 있는 범위를 넘었습니다."
      );
    }

    if (stockAfter < 0) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT,
        "재고가 부족합니다. (현재고: " + item.getStock() + ")"
      );
    }

    item.changeStock(stockAfter);

    StockMovement movement = StockMovement.builder()
      .item(item)
      .type(type)
      .quantity(quantity)
      .stockAfter(stockAfter)
      .orderId(orderId)
      .memo(memo == null || memo.isBlank() ? null : memo.strip())
      .member(memberId == null ? null : memberRepository.getReferenceById(memberId))
      .createdAt(LocalDateTime.now(ZONE).withNano(0))
      .build();

    movementRepository.save(movement);
    movementRepository.flush();

    return movement;
  }
}
