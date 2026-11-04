package com.example.demo.controller;

import com.example.demo.dto.InventoryItemRequestDto;
import com.example.demo.dto.StockMovementRequestDto;
import com.example.demo.dto.StockMovementResponseDto;
import com.example.demo.dto.StockMovementResultDto;
import com.example.demo.entity.InventoryItem;
import com.example.demo.service.InventoryItemService;
import com.example.demo.service.StockMovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryItemController {
  private final InventoryItemService inventoryItemService;
  private final StockMovementService stockMovementService;

  @GetMapping
  public ResponseEntity<List<InventoryItem>> getAllItems() {
    return ResponseEntity.ok(
      inventoryItemService.getAllItems()
    );
  }

  @PostMapping
  public ResponseEntity<InventoryItem> createItem(
    @AuthenticationPrincipal Long memberId,
    @Valid @RequestBody InventoryItemRequestDto dto
  ) {
    return ResponseEntity.status(HttpStatus.CREATED)
      .body(inventoryItemService.createItem(dto, memberId));
  }

  @PutMapping("/{itemId}")
  public ResponseEntity<InventoryItem> updateItem(
    @PathVariable("itemId") String itemId,
    @Valid @RequestBody InventoryItemRequestDto dto
  ) {
    return ResponseEntity.ok(
      inventoryItemService.updateItem(itemId, dto)
    );
  }

  @DeleteMapping("/{itemId}")
  public ResponseEntity<Void> deleteItem(
    @PathVariable("itemId") String itemId
  ) {
    inventoryItemService.deleteItem(itemId);
    return ResponseEntity.noContent().build();
  }

  // 품목별 입출고 이력 (최근 순)
  @GetMapping("/{itemId}/movements")
  public ResponseEntity<List<StockMovementResponseDto>> getMovements(
    @PathVariable("itemId") String itemId
  ) {
    return ResponseEntity.ok(
      stockMovementService.getMovements(itemId)
    );
  }

  // 입고·출고 등록 (현재고가 함께 바뀜)
  @PostMapping("/{itemId}/movements")
  public ResponseEntity<StockMovementResultDto> registerMovement(
    @AuthenticationPrincipal Long memberId,
    @PathVariable("itemId") String itemId,
    @Valid @RequestBody StockMovementRequestDto dto
  ) {
    return ResponseEntity.status(HttpStatus.CREATED)
      .body(stockMovementService.register(itemId, dto, memberId));
  }
}
