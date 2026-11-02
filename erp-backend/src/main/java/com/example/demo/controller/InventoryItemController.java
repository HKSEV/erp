package com.example.demo.controller;

import com.example.demo.dto.InventoryItemRequestDto;
import com.example.demo.entity.InventoryItem;
import com.example.demo.service.InventoryItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryItemController {
  private final InventoryItemService inventoryItemService;

  @GetMapping
  public ResponseEntity<List<InventoryItem>> getAllItems() {
    return ResponseEntity.ok(
      inventoryItemService.getAllItems()
    );
  }

  @PostMapping
  public ResponseEntity<InventoryItem> createItem(
    @Valid @RequestBody InventoryItemRequestDto dto
  ) {
    return ResponseEntity.status(HttpStatus.CREATED)
      .body(inventoryItemService.createItem(dto));
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
}
