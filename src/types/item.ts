export type ItemType = 'LOST' | 'FOUND';

export type ItemCategory =
  | 'ELECTRONICS'
  | 'BOOKS_AND_NOTES'
  | 'ID_CARDS_AND_DOCUMENTS'
  | 'BAGS_AND_WALLETS'
  | 'KEYS'
  | 'CLOTHING'
  | 'ACCESSORIES'
  | 'OTHER';

export type ItemStatus = 'ACTIVE' | 'RESOLVED';

export interface Item {
  id: number;
  itemName: string;
  description: string;
  type: ItemType;
  category: ItemCategory;
  location: string;
  incidentDate: string; // YYYY-MM-DD
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  imageUrl?: string;
  status: ItemStatus;
  createdAt: string;
  isDemoSession?: boolean; // Track if created in current demo browser session
}

export interface ItemRequest {
  itemName: string;
  description: string;
  type: ItemType;
  category: ItemCategory;
  location: string;
  incidentDate: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface ItemFilterParams {
  search?: string;
  type?: ItemType | '';
  category?: ItemCategory | '';
  location?: string;
  status?: ItemStatus | '';
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ReportStats {
  totalActive: number;
  lostItems: number;
  foundItems: number;
  resolvedItems: number;
}
