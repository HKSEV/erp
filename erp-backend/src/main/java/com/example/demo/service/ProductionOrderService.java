package com.example.demo.service;

import com.example.demo.dto.ProductionOrderRequestDto;
import com.example.demo.entity.InventoryItem;
import com.example.demo.entity.ProductionOrder;
import com.example.demo.entity.StockMovementType;
import com.example.demo.repository.InventoryItemRepository;
import com.example.demo.repository.ProductionOrderRepository;
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
public class ProductionOrderService {
  private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
  private static final String PRODUCT_CATEGORY = "제품";
  private final ProductionOrderRepository productionOrderRepository;
  private final InventoryItemRepository itemRepository;
  private final StockMovementService stockMovementService;
  private final DocumentNumberService documentNumberService;

  @PersistenceContext
  private EntityManager entityManager;

  @Transactional(readOnly = true)
  public List<ProductionOrder> getAllOrders() {
    return productionOrderRepository.findAll();
  }

  @Transactional
  public ProductionOrder createOrder(ProductionOrderRequestDto dto, Long memberId) {
    ProductionOrder order = new ProductionOrder();
    order.setId(documentNumberService.nextOrderId());
    order.setCreatedAt(LocalDateTime.now(ZONE).withNano(0));
    boolean completing = apply(order, dto);

    // 기존 오더를 덮어쓰지 않도록 INSERT만 수행합니다.
    entityManager.persist(order);
    entityManager.flush();

    if (completing)
      addProducedStock(order, memberId);

    return order;
  }

  @Transactional
  public ProductionOrder updateOrder(
    String orderId,
    ProductionOrderRequestDto dto,
    Long memberId
  ) {
    ProductionOrder order = findOrder(orderId);

    // 생산완료된 오더는 재고에 반영되었으므로 바꾸지 않습니다.
    if ("completed".equals(order.getStatus())) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT, "생산완료된 오더는 수정할 수 없습니다."
      );
    }

    boolean completing = apply(order, dto);
    productionOrderRepository.flush();

    if (completing)
      addProducedStock(order, memberId);

    return order;
  }

  @Transactional
  public void deleteOrder(String orderId) {
    ProductionOrder order = findOrder(orderId);

    // 제품 재고에 반영된 오더는 지우지 않습니다. (연결 기능 이전에 완료된 오더는 삭제 가능)
    if ("completed".equals(order.getStatus()) && order.getItem() != null) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT,
        "생산완료된 오더는 재고에 반영되어 삭제할 수 없습니다."
      );
    }

    productionOrderRepository.delete(order);
    productionOrderRepository.flush();
  }

  // 같은 오더를 동시에 완료 처리해 재고가 두 번 늘지 않도록 행을 잠급니다.
  private ProductionOrder findOrder(String orderId) {
    return productionOrderRepository.findForUpdate(orderId)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "생산 오더를 찾을 수 없습니다."
      ));
  }

  // 처음 읽을 때부터 잠가야 생산완료 시 최신 현재고에 더합니다.
  // (잠그기 전에 읽어 둔 품목은 잠근 뒤에도 예전 값이 남아 있음)
  private InventoryItem findProduct(String itemId) {
    InventoryItem item = itemRepository.findByIdForUpdate(itemId.strip())
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND, "선택한 품목을 찾을 수 없습니다."
      ));

    if (!PRODUCT_CATEGORY.equals(item.getCategory())) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST, "생산 오더에는 분류가 제품인 품목만 선택할 수 있습니다."
      );
    }

    return item;
  }

  // 생산완료 시 제품 재고를 생산 수량만큼 늘리고 이력을 남깁니다.
  private void addProducedStock(ProductionOrder order, Long memberId) {
    stockMovementService.record(
      order.getItem(),
      StockMovementType.PRODUCTION,
      order.getQuantity(),
      order.getId(),
      "생산 완료",
      memberId
    );
  }

  // 반환값: 이번 요청으로 생산완료가 되었는지 (재고 반영 필요 여부)
  private boolean apply(
    ProductionOrder order,
    ProductionOrderRequestDto dto
  ) {
    boolean wasCompleted = "completed".equals(order.getStatus());
    boolean isCompleted = "completed".equals(dto.status());

    // 완료 상태로 전환되는 순간에만 기록합니다.
    if (isCompleted && !wasCompleted)
      order.setCompletedAt(LocalDateTime.now(ZONE).withNano(0));
    else if (!isCompleted)
      order.setCompletedAt(null);

    int previous = order.getProgress() == null
      ? 0 : Math.max(0, order.getProgress());

    // 생산중: 입력한 진행률, 입력이 없으면 기존 값 유지 (완료에서 되돌리면 0)
    int progress = switch (dto.status()) {
      case "planning" -> 0;
      case "completed" -> 100;
      default -> dto.progress() != null
        ? dto.progress()
        : previous >= 100 ? 0 : previous;
    };

    InventoryItem item = findProduct(dto.itemId());

    order.setItem(item);
    order.setProductName(item.getName());
    order.setQuantity(dto.quantity());
    order.setStatus(dto.status());
    order.setProgress(progress);
    order.setDueDate(dto.dueDate());

    return isCompleted && !wasCompleted;
  }
}