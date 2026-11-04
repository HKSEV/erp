package com.example.demo.service;

import com.example.demo.dto.ProductionOrderRequestDto;
import com.example.demo.entity.ProductionOrder;
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
  private final ProductionOrderRepository productionOrderRepository;
  private final DocumentNumberService documentNumberService;

  @PersistenceContext
  private EntityManager entityManager;

  @Transactional(readOnly = true)
  public List<ProductionOrder> getAllOrders() {
    return productionOrderRepository.findAll();
  }

  @Transactional
  public ProductionOrder createOrder(ProductionOrderRequestDto dto) {
    ProductionOrder order = new ProductionOrder();
    order.setId(documentNumberService.nextOrderId());
    order.setCreatedAt(LocalDateTime.now(ZONE).withNano(0));
    apply(order, dto);

    // 기존 오더를 덮어쓰지 않도록 INSERT만 수행합니다.
    entityManager.persist(order);
    entityManager.flush();

    return order;
  }

  @Transactional
  public ProductionOrder updateOrder(
    String orderId,
    ProductionOrderRequestDto dto
  ) {
    ProductionOrder order = findOrder(orderId);
    apply(order, dto);

    productionOrderRepository.flush();
    return order;
  }

  @Transactional
  public void deleteOrder(String orderId) {
    ProductionOrder order = findOrder(orderId);

    productionOrderRepository.delete(order);
    productionOrderRepository.flush();
  }

  private ProductionOrder findOrder(String orderId) {
    return productionOrderRepository.findById(orderId)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "생산 오더를 찾을 수 없습니다."
      ));
  }

  private void apply(
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

    int progress = switch (dto.status()) {
      case "planning" -> 0;
      case "completed" -> 100;
      default -> previous >= 100 ? 0 : previous;
    };

    order.setProductName(dto.productName().strip());
    order.setQuantity(dto.quantity());
    order.setStatus(dto.status());
    order.setProgress(progress);
    order.setDueDate(dto.dueDate());
  }
}