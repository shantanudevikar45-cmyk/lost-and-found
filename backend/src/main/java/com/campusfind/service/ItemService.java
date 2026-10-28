package com.campusfind.service;

import com.campusfind.dto.ItemRequest;
import com.campusfind.dto.ItemResponse;
import com.campusfind.entity.*;
import com.campusfind.exception.ResourceNotFoundException;
import com.campusfind.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ItemService {

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    private final ItemRepository itemRepository;

    @Value("${file.upload-dir:./uploads/images}")
    private String uploadDir;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public Page<ItemResponse> getItems(String search, ItemType type, ItemCategory category,
                                      String location, ItemStatus status, Pageable pageable) {
        return itemRepository.findWithFilters(search, type, category, location, status, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public ItemResponse getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
        return mapToResponse(item);
    }

    public ItemResponse createItem(ItemRequest request, MultipartFile image) throws IOException {
        Item item = new Item();
        item.setItemName(request.getItemName());
        item.setDescription(request.getDescription());
        item.setType(request.getType());
        item.setCategory(request.getCategory());
        item.setLocation(request.getLocation());
        item.setIncidentDate(request.getIncidentDate());
        item.setContactName(request.getContactName());
        item.setContactEmail(request.getContactEmail());
        item.setContactPhone(request.getContactPhone());
        item.setStatus(ItemStatus.ACTIVE);

        if (image != null && !image.isEmpty()) {
            validateImage(image);
            String storedPath = storeImage(image);
            item.setImageUrl(storedPath);
        }

        Item saved = itemRepository.save(item);
        return mapToResponse(saved);
    }

    public ItemResponse updateItem(Long id, ItemRequest request, MultipartFile image) throws IOException {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));

        item.setItemName(request.getItemName());
        item.setDescription(request.getDescription());
        item.setType(request.getType());
        item.setCategory(request.getCategory());
        item.setLocation(request.getLocation());
        item.setIncidentDate(request.getIncidentDate());
        item.setContactName(request.getContactName());
        item.setContactEmail(request.getContactEmail());
        item.setContactPhone(request.getContactPhone());

        if (image != null && !image.isEmpty()) {
            validateImage(image);
            // Remove previous image if exists
            deleteImageFile(item.getImageUrl());
            String storedPath = storeImage(image);
            item.setImageUrl(storedPath);
        }

        Item updated = itemRepository.save(item);
        return mapToResponse(updated);
    }

    public ItemResponse resolveItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));

        item.setStatus(ItemStatus.RESOLVED);
        Item saved = itemRepository.save(item);
        return mapToResponse(saved);
    }

    public void deleteItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));

        // Clean up image file safely
        deleteImageFile(item.getImageUrl());
        itemRepository.delete(item);
    }

    private ItemResponse mapToResponse(Item item) {
        ItemResponse response = new ItemResponse();
        response.setId(item.getId());
        response.setItemName(item.getItemName());
        response.setDescription(item.getDescription());
        response.setType(item.getType());
        response.setCategory(item.getCategory());
        response.setLocation(item.getLocation());
        response.setIncidentDate(item.getIncidentDate());
        response.setContactName(item.getContactName());
        response.setContactEmail(item.getContactEmail());
        response.setContactPhone(item.getContactPhone());
        response.setImageUrl(item.getImageUrl());
        response.setStatus(item.getStatus());
        response.setCreatedAt(item.getCreatedAt());
        return response;
    }

    private void validateImage(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file format. Only JPG, PNG, and WEBP images are allowed");
        }
    }

    private String storeImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate secure unique filename
        String originalFilename = file.getOriginalFilename();
        String safeExtension = ".jpg";
        if (originalFilename != null && originalFilename.contains(".")) {
            String ext = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            if (ext.equals(".png") || ext.equals(".webp") || ext.equals(".jpeg") || ext.equals(".jpg")) {
                safeExtension = ext;
            }
        }

        String uniqueFilename = UUID.randomUUID().toString() + safeExtension;
        Path destination = uploadPath.resolve(uniqueFilename).normalize();

        // Prevent path traversal
        if (!destination.startsWith(uploadPath)) {
            throw new SecurityException("Unsafe file path detected");
        }

        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        return "/api/items/images/" + uniqueFilename;
    }

    private void deleteImageFile(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith("/api/items/images/")) {
            return;
        }
        try {
            String filename = imageUrl.replace("/api/items/images/", "");
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(filename).normalize();
            if (filePath.startsWith(uploadPath) && Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (Exception ignored) {
            // Log but do not block deletion
        }
    }
}
