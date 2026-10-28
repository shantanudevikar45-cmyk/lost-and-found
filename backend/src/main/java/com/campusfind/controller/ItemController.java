package com.campusfind.controller;

import com.campusfind.dto.ItemRequest;
import com.campusfind.dto.ItemResponse;
import com.campusfind.entity.ItemCategory;
import com.campusfind.entity.ItemStatus;
import com.campusfind.entity.ItemType;
import com.campusfind.service.ItemService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    private final ObjectMapper objectMapper;
    private final Validator validator;

    public ItemController(ItemService itemService, ObjectMapper objectMapper, Validator validator) {
        this.itemService = itemService;
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    @GetMapping
    public ResponseEntity<Page<ItemResponse>> getItems(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) ItemCategory category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ItemResponse> items = itemService.getItems(search, type, category, location, status, pageable);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable Long id) {
        ItemResponse item = itemService.getItemById(id);
        return ResponseEntity.ok(item);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ItemResponse> createItem(
            @RequestPart("item") String itemJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        ItemRequest request = objectMapper.readValue(itemJson, ItemRequest.class);
        validateRequest(request);

        ItemResponse created = itemService.createItem(request, image);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable Long id,
            @RequestPart("item") String itemJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        ItemRequest request = objectMapper.readValue(itemJson, ItemRequest.class);
        validateRequest(request);

        ItemResponse updated = itemService.updateItem(id, request, image);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ItemResponse> resolveItem(@PathVariable Long id) {
        ItemResponse resolved = itemService.resolveItem(id);
        return ResponseEntity.ok(resolved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    private void validateRequest(ItemRequest request) {
        Set<ConstraintViolation<ItemRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            StringBuilder sb = new StringBuilder();
            for (ConstraintViolation<ItemRequest> v : violations) {
                sb.append(v.getPropertyPath()).append(": ").append(v.getMessage()).append("; ");
            }
            throw new IllegalArgumentException("Validation error: " + sb);
        }
    }
}
