package com.campusfind.service;

import com.campusfind.dto.ItemRequest;
import com.campusfind.dto.ItemResponse;
import com.campusfind.entity.*;
import com.campusfind.exception.ResourceNotFoundException;
import com.campusfind.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemService itemService;

    private Item sampleItem;
    private ItemRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleItem = new Item();
        sampleItem.setId(1L);
        sampleItem.setItemName("Blue Hydro Flask");
        sampleItem.setDescription("Found near the library entrance on a bench.");
        sampleItem.setType(ItemType.FOUND);
        sampleItem.setCategory(ItemCategory.ACCESSORIES);
        sampleItem.setLocation("Central Library");
        sampleItem.setIncidentDate(LocalDate.now());
        sampleItem.setContactName("Campus Security");
        sampleItem.setContactEmail("security@campus.edu");
        sampleItem.setStatus(ItemStatus.ACTIVE);
        sampleItem.setCreatedAt(LocalDateTime.now());

        sampleRequest = new ItemRequest();
        sampleRequest.setItemName("Blue Hydro Flask");
        sampleRequest.setDescription("Found near the library entrance on a bench.");
        sampleRequest.setType(ItemType.FOUND);
        sampleRequest.setCategory(ItemCategory.ACCESSORIES);
        sampleRequest.setLocation("Central Library");
        sampleRequest.setIncidentDate(LocalDate.now());
        sampleRequest.setContactName("Campus Security");
        sampleRequest.setContactEmail("security@campus.edu");
    }

    @Test
    void testCreateItem_Success() throws IOException {
        when(itemRepository.save(any(Item.class))).thenReturn(sampleItem);

        ItemResponse response = itemService.createItem(sampleRequest, null);

        assertNotNull(response);
        assertEquals("Blue Hydro Flask", response.getItemName());
        assertEquals(ItemType.FOUND, response.getType());
        assertEquals(ItemStatus.ACTIVE, response.getStatus());
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    void testGetItemById_Success() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(sampleItem));

        ItemResponse response = itemService.getItemById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Central Library", response.getLocation());
    }

    @Test
    void testGetItemById_NotFound() {
        when(itemRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> itemService.getItemById(99L));
    }

    @Test
    void testResolveItem_Success() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(sampleItem));
        when(itemRepository.save(any(Item.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ItemResponse response = itemService.resolveItem(1L);

        assertNotNull(response);
        assertEquals(ItemStatus.RESOLVED, response.getStatus());
        verify(itemRepository, times(1)).save(sampleItem);
    }

    @Test
    void testGetItems_WithSearchAndFilter() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Item> page = new PageImpl<>(Collections.singletonList(sampleItem));

        when(itemRepository.findWithFilters("Flask", ItemType.FOUND, ItemCategory.ACCESSORIES, "Library", ItemStatus.ACTIVE, pageable))
                .thenReturn(page);

        Page<ItemResponse> result = itemService.getItems("Flask", ItemType.FOUND, ItemCategory.ACCESSORIES, "Library", ItemStatus.ACTIVE, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Blue Hydro Flask", result.getContent().get(0).getItemName());
    }
}
