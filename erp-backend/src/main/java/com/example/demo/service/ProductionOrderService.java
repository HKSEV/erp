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

import java.security.SecureRandom;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ProductionOrderService {
  private final ProductionOrderRepository productionOrderRepository;
  private final SecureRandom random = new SecureRandom();

  @PersistenceContext
  private EntityManager entityManager;

  @Transactional(readOnly = true)
  public List<ProductionOrder> getAllOrders() {
    return productionOrderRepository.findAll();
  }

  @Transactional
  public ProductionOrder createOrder(ProductionOrderRequestDto dto) {
    ProductionOrder order = new ProductionOrder();
    order.setId(generateOrderId());
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

  private String generateOrderId() {
    for (int attempt = 0; attempt < 50; attempt++) {
      String id = String.format(
        Locale.ROOT,
        "PRD-%04d-%03d",
        random.nextInt(10000),
        random.nextInt(1000)
      );

      if (!productionOrderRepository.existsById(id))
        return id;
    }

    throw new ResponseStatusException(
      HttpStatus.SERVICE_UNAVAILABLE,
      "오더 번호를 생성하지 못했습니다. 다시 시도해 주세요."
    );
  }

  private void apply(
    ProductionOrder order,
    ProductionOrderRequestDto dto
  ) {
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