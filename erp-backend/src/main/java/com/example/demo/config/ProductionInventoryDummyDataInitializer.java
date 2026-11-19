package com.example.demo.config;

import com.example.demo.dto.InventoryItemRequestDto;
import com.example.demo.dto.ProductionOrderRequestDto;
import com.example.demo.entity.InventoryItem;
import com.example.demo.repository.DocumentSequenceRepository;
import com.example.demo.service.InventoryItemService;
import com.example.demo.service.ProductionOrderService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.production-inventory-dummy.enabled", havingValue = "true")
public class ProductionInventoryDummyDataInitializer implements ApplicationRunner {
  static final String SEQUENCE_KEY = "PRODUCTION_INVENTORY_DUMMY";

  private static final Logger log = LoggerFactory.getLogger(ProductionInventoryDummyDataInitializer.class);
  private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

  private final DocumentSequenceRepository sequenceRepository;
  private final InventoryItemService inventoryItemService;
  private final ProductionOrderService productionOrderService;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (sequenceRepository.claimInitialValue(SEQUENCE_KEY) == 0)
      return;

    LocalDate today = LocalDate.now(ZONE);
    List<SampleOrder> orders = List.of(
      new SampleOrder(
        new InventoryItemRequestDto("[샘플] 조립용 브래킷", "제품", 120, 40, 4_500L),
        90, "planning", null, today.plusDays(14)
      ),
      new SampleOrder(
        new InventoryItemRequestDto("[샘플] 모터 하우징", "제품", 18, 35, 28_900L),
        60, "progress", 35, today.plusDays(7)
      ),
      new SampleOrder(
        new InventoryItemRequestDto("[샘플] 컨베이어 롤러", "제품", 0, 20, 18_500L),
        40, "planning", null, today.plusDays(10)
      ),
      new SampleOrder(
        new InventoryItemRequestDto("[샘플] 센서 장착 플레이트", "제품", 36, 20, 6_200L),
        75, "progress", 70, today.plusDays(4)
      ),
      new SampleOrder(
        new InventoryItemRequestDto("[샘플] 제어판 케이스", "제품", 8, 25, 32_000L),
        42, "completed", null, today.plusDays(1)
      )
    );

    for (SampleOrder sample : orders) {
      InventoryItem item = inventoryItemService.createItem(sample.item(), null);
      productionOrderService.createOrder(new ProductionOrderRequestDto(
        item.getId(), sample.quantity(), sample.status(), sample.progress(), sample.dueDate()
      ), null);
    }

    log.info("재고 품목과 생산 오더 더미 데이터를 각각 {}건 등록했습니다.", orders.size());
  }

  private record SampleOrder(
    InventoryItemRequestDto item,
    int quantity,
    String status,
    Integer progress,
    LocalDate dueDate
  ) {
  }
}
