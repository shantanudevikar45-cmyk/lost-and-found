import { apiClient, getApiBaseUrl } from './api';
import { Item, ItemFilterParams, ItemRequest, PageResponse, ReportStats } from '../types/item';
import { INITIAL_DEMO_ITEMS } from '../data/mockItems';

// In-memory demo store for when Spring Boot backend is not running locally
let demoStore: Item[] = [...INITIAL_DEMO_ITEMS];

export interface BackendStatus {
  isAvailable: boolean;
  checking: boolean;
  lastChecked: Date | null;
  mode: 'real' | 'demo';
  apiUrl: string;
  errorMessage?: string;
}

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/items', {
      params: { page: 0, size: 1 },
      timeout: 3000,
    });
    return response.status >= 200 && response.status < 300;
  } catch {
    return false;
  }
};

export const itemService = {
  getApiUrl: () => getApiBaseUrl(),

  /**
   * Fetch items with filters & pagination
   */
  async getItems(params: ItemFilterParams = {}, useDemoMode: boolean = false): Promise<PageResponse<Item>> {
    if (!useDemoMode) {
      try {
        const queryParams: Record<string, string | number> = {};
        if (params.search) queryParams.search = params.search;
        if (params.type) queryParams.type = params.type;
        if (params.category) queryParams.category = params.category;
        if (params.location) queryParams.location = params.location;
        if (params.status) queryParams.status = params.status;
        queryParams.page = params.page ?? 0;
        queryParams.size = params.size ?? 12;

        const response = await apiClient.get<PageResponse<Item>>('/items', { params: queryParams });
        return response.data;
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        const msg = error.response?.data?.message || error.message || 'Cannot reach Spring Boot API';
        throw new Error(msg);
      }
    }

    // Demo Mode implementation (clearly marked in UI)
    let filtered = [...demoStore];

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        item =>
          item.itemName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
      );
    }

    if (params.type) {
      filtered = filtered.filter(item => item.type === params.type);
    }

    if (params.category) {
      filtered = filtered.filter(item => item.category === params.category);
    }

    if (params.location) {
      const loc = params.location.toLowerCase();
      filtered = filtered.filter(item => item.location.toLowerCase().includes(loc));
    }

    if (params.status) {
      filtered = filtered.filter(item => item.status === params.status);
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = params.page ?? 0;
    const size = params.size ?? 12;
    const start = page * size;
    const content = filtered.slice(start, start + size);
    const totalPages = Math.ceil(filtered.length / size) || 1;

    return {
      content,
      totalElements: filtered.length,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
      empty: content.length === 0,
    };
  },

  /**
   * Fetch single item by ID
   */
  async getItemById(id: number, useDemoMode: boolean = false): Promise<Item> {
    if (!useDemoMode) {
      try {
        const response = await apiClient.get<Item>(`/items/${id}`);
        return response.data;
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        throw new Error(error.response?.data?.message || 'Report not found on backend');
      }
    }

    const item = demoStore.find(i => i.id === id);
    if (!item) {
      throw new Error(`Report #${id} not found in demo records`);
    }
    return item;
  },

  /**
   * Create report with multipart/form-data
   */
  async createItem(itemData: ItemRequest, imageFile?: File | null, useDemoMode: boolean = false): Promise<Item> {
    if (!useDemoMode) {
      const formData = new FormData();
      // Spring Boot @RequestPart("item") expects JSON string
      formData.append('item', JSON.stringify(itemData));

      if (imageFile) {
        // Spring Boot @RequestPart("image")
        formData.append('image', imageFile);
      }

      // Important: Let Axios set the Content-Type boundary automatically
      const response = await apiClient.post<Item>('/items', formData);
      return response.data;
    }

    // Demo Mode Create
    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    } else {
      // Default clean placeholder based on category
      imageUrl = itemData.type === 'LOST'
        ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80';
    }

    const newItem: Item = {
      ...itemData,
      id: Date.now(),
      imageUrl,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      isDemoSession: true, // Marked as created in current demo session
    };

    demoStore = [newItem, ...demoStore];
    return newItem;
  },

  /**
   * Update report
   */
  async updateItem(id: number, itemData: ItemRequest, imageFile?: File | null, useDemoMode: boolean = false): Promise<Item> {
    if (!useDemoMode) {
      const formData = new FormData();
      formData.append('item', JSON.stringify(itemData));
      if (imageFile) {
        formData.append('image', imageFile);
      }
      const response = await apiClient.put<Item>(`/items/${id}`, formData);
      return response.data;
    }

    const index = demoStore.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error(`Report #${id} not found in demo records`);
    }

    let updatedImageUrl = demoStore[index].imageUrl;
    if (imageFile) {
      updatedImageUrl = URL.createObjectURL(imageFile);
    }

    const updatedItem: Item = {
      ...demoStore[index],
      ...itemData,
      imageUrl: updatedImageUrl,
    };

    demoStore[index] = updatedItem;
    return updatedItem;
  },

  /**
   * Delete report
   */
  async deleteItem(id: number, useDemoMode: boolean = false): Promise<void> {
    if (!useDemoMode) {
      await apiClient.delete(`/items/${id}`);
      return;
    }

    demoStore = demoStore.filter(i => i.id !== id);
  },

  /**
   * Resolve report (PATCH /api/items/{id}/resolve)
   */
  async resolveItem(id: number, useDemoMode: boolean = false): Promise<Item> {
    if (!useDemoMode) {
      const response = await apiClient.patch<Item>(`/items/${id}/resolve`);
      return response.data;
    }

    const item = demoStore.find(i => i.id === id);
    if (!item) {
      throw new Error(`Report #${id} not found`);
    }
    item.status = 'RESOLVED';
    return { ...item };
  },

  /**
   * Compute dashboard stats
   */
  computeStats(items: Item[]): ReportStats {
    const totalActive = items.filter(i => i.status === 'ACTIVE').length;
    const lostItems = items.filter(i => i.type === 'LOST' && i.status === 'ACTIVE').length;
    const foundItems = items.filter(i => i.type === 'FOUND' && i.status === 'ACTIVE').length;
    const resolvedItems = items.filter(i => i.status === 'RESOLVED').length;

    return {
      totalActive,
      lostItems,
      foundItems,
      resolvedItems,
    };
  },

  /**
   * Reset demo data
   */
  resetDemoData(): void {
    demoStore = [...INITIAL_DEMO_ITEMS];
  },
};
