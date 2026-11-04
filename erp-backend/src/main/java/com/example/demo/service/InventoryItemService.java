package com.example.demo.service;

import com.example.demo.dto.InventoryItemRequestDto;
import com.example.demo.entity.InventoryItem;
import com.example.demo.entity.StockMovementType;
import com.example.demo.repository.InventoryItemRepository;
import com.example.demo.repository.ProductionOrderRepository;
import com.example.demo.repository.StockMovementRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryItemService {
  private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
  private final InventoryItemRepository itemRepository;
  private final StockMovementRepository movementRepository;
  private final ProductionOrderRepository productionOrderRepository;
  private final StockMovementService stockMovementService;
  private final DocumentNumberService documentNumberService;

  @PersistenceContext
  private EntityManager entityManager;

  @Transactional(readOnly = true)
  public List<InventoryItem> getAllItems() {
    return itemRepository.findAll();
  }

  @Transactional
  public InventoryItem createItem(InventoryItemRequestDto dto, Long memberId) {
    if (dto.stock() == null) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "현재고를 입력해 주세요."
      );
    }

    InventoryItem item = new InventoryItem();
    item.setId(documentNumberService.nextItemId());
    item.setCreatedAt(LocalDateTime.now(ZONE).withNano(0));
    item.changeStock(0);
    apply(item, dto);

    // 기존 데이터를 덮어쓰지 않도록 INSERT만 수행합니다.
    entityManager.persist(item);
    entityManager.flush();

    // 입력한 현재고는 기초 재고 이력으로 남깁니다.
    if (dto.stock() > 0) {
      stockMovementService.record(
        item, StockMovementType.INITIAL, dto.stock(), null, "품목 등록", memberId
      );
    }

    return item;
  }

  @Transactional
  public InventoryItem updateItem(
    String itemId,
    InventoryItemRequestDto dto
  ) {
    // 현재고는 바꾸지 않습니다. (입출고로만 변경)
    InventoryItem item = stockMovementService.lockItem(itemId);
    boolean usedByOrders = productionOrderRepository.existsByItem_Id(itemId);

    if (usedByOrders && !item.getCategory().equals(dto.category())) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "생산 오더에 사용 중인 품목은 분류를 바꿀 수 없습니다."
      );
    }

    String previousName = item.getName();
    apply(item, dto);
    itemRepository.flush();

    if (usedByOrders && !previousName.equals(item.getName()))
      productionOrderRepository.renameProduct(itemId, item.getName());

    return item;
  }

  @Transactional
  public void deleteItem(String itemId) {
    InventoryItem item = stockMovementService.lockItem(itemId);

    if (productionOrderRepository.existsByItem_Id(itemId)) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "생산 오더에 사용 중인 품목은 삭제할 수 없습니다."
      );
    }

    // 품목을 지우면 그 품목의 입출고 이력도 함께 지웁니다.
    movementRepository.deleteByItemId(itemId);
    itemRepository.delete(item);
    itemRepository.flush();
  }

  private void apply(
    InventoryItem item,
    InventoryItemRequestDto dto
  ) {
    item.setName(dto.name().strip());
    item.setCategory(dto.category());
    item.setSafetyStock(dto.safetyStock());
    item.setUnitPrice(dto.unitPrice());

    // 적정재고가 바뀌면 재고 상태를 다시 계산합니다.
    item.refreshStatus();
  }
}
