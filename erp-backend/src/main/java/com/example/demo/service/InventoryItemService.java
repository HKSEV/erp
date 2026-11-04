package com.example.demo.service;

import com.example.demo.dto.InventoryItemRequestDto;
import com.example.demo.entity.InventoryItem;
import com.example.demo.repository.InventoryItemRepository;
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
  private final DocumentNumberService documentNumberService;

  @PersistenceContext
  private EntityManager entityManager;

  @Transactional(readOnly = true)
  public List<InventoryItem> getAllItems() {
    return itemRepository.findAll();
  }

  @Transactional
  public InventoryItem createItem(InventoryItemRequestDto dto) {
    InventoryItem item = new InventoryItem();
    item.setId(documentNumberService.nextItemId());
    item.setCreatedAt(LocalDateTime.now(ZONE).withNano(0));
    apply(item, dto);

    // 기존 데이터를 덮어쓰지 않도록 INSERT만 수행합니다.
    entityManager.persist(item);
    entityManager.flush();

    return item;
  }

  @Transactional
  public InventoryItem updateItem(
    String itemId,
    InventoryItemRequestDto dto
  ) {
    InventoryItem item = findInventoryItem(itemId);
    apply(item, dto);

    itemRepository.flush();
    return item;
  }

  @Transactional
  public void deleteItem(String itemId) {
    InventoryItem item = findInventoryItem(itemId);

    itemRepository.delete(item);
    itemRepository.flush();
  }

  private InventoryItem findInventoryItem(String itemId) {
    return itemRepository.findById(itemId)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "품목을 찾을 수 없습니다."
      ));
  }

  private void apply(
    InventoryItem item,
    InventoryItemRequestDto dto
  ) {
    // 재고 상태는 입력받지 않고 현재고·적정재고로 계산합니다.
    String status = dto.stock() == 0 ? "out"
      : dto.stock() < dto.safetyStock() ? "low"
      : "normal";

    item.setName(dto.name().strip());
    item.setCategory(dto.category());
    item.setStock(dto.stock());
    item.setSafetyStock(dto.safetyStock());
    item.setUnitPrice(dto.unitPrice());
    item.setStatus(status);
  }
}
