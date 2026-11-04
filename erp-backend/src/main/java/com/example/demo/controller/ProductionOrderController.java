package com.example.demo.controller;

import com.example.demo.dto.ProductionOrderRequestDto;
import com.example.demo.entity.ProductionOrder;
import com.example.demo.service.ProductionOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/production/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProductionOrderController {
  private final ProductionOrderService productionOrderService;

  @GetMapping
  public ResponseEntity<List<ProductionOrder>> getAllOrders() {
    return ResponseEntity.ok(
      productionOrderService.getAllOrders()
    );
  }

  @PostMapping
  public ResponseEntity<ProductionOrder> createOrder(
    @AuthenticationPrincipal Long memberId,
    @Valid @RequestBody ProductionOrderRequestDto dto
  ) {
    return ResponseEntity.status(HttpStatus.CREATED)
      .body(productionOrderService.createOrder(dto, memberId));
  }

  @PutMapping("/{orderId}")
  public ResponseEntity<ProductionOrder> updateOrder(
    @AuthenticationPrincipal Long memberId,
    @PathVariable("orderId") String orderId,
    @Valid @RequestBody ProductionOrderRequestDto dto
  ) {
    return ResponseEntity.ok(
      productionOrderService.updateOrder(orderId, dto, memberId)
    );
  }

  @DeleteMapping("/{orderId}")
  public ResponseEntity<Void> deleteOrder(
    @PathVariable("orderId") String orderId
  ) {
    productionOrderService.deleteOrder(orderId);
    return ResponseEntity.noContent().build();
  }
}