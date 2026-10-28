import { ItemCategory, ItemType, ItemStatus } from '../types/item';

export const CATEGORIES: { value: ItemCategory; label: string; icon: string }[] = [
  { value: 'ELECTRONICS', label: 'Electronics', icon: 'Laptop' },
  { value: 'BOOKS_AND_NOTES', label: 'Books & Notes', icon: 'BookOpen' },
  { value: 'ID_CARDS_AND_DOCUMENTS', label: 'ID Cards & Documents', icon: 'CreditCard' },
  { value: 'BAGS_AND_WALLETS', label: 'Bags & Wallets', icon: 'Briefcase' },
  { value: 'KEYS', label: 'Keys', icon: 'Key' },
  { value: 'CLOTHING', label: 'Clothing', icon: 'Shirt' },
  { value: 'ACCESSORIES', label: 'Accessories', icon: 'Watch' },
  { value: 'OTHER', label: 'Other', icon: 'HelpCircle' },
];

export const CAMPUS_LOCATIONS = [
  'Central Library',
  'Student Center & Food Court',
  'Science & Tech Complex',
  'Engineering Block B',
  'Computer Science Lab 3',
  'University Sports Arena',
  'North Campus Dining Commons',
  'Administrative Quadrangle',
  'Lecture Hall 101',
  'Campus Shuttle Stop #4',
];

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  ELECTRONICS: 'Electronics',
  BOOKS_AND_NOTES: 'Books and Notes',
  ID_CARDS_AND_DOCUMENTS: 'ID Cards & Documents',
  BAGS_AND_WALLETS: 'Bags & Wallets',
  KEYS: 'Keys',
  CLOTHING: 'Clothing',
  ACCESSORIES: 'Accessories',
  OTHER: 'Other',
};

export const TYPE_CONFIG: Record<ItemType, { label: string; bg: string; text: string; border: string; badge: string }> = {
  LOST: {
    label: 'Lost Item',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    badge: 'bg-amber-500 text-white',
  },
  FOUND: {
    label: 'Found Item',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    badge: 'bg-emerald-600 text-white',
  },
};

export const STATUS_CONFIG: Record<ItemStatus, { label: string; bg: string; text: string }> = {
  ACTIVE: {
    label: 'Active Report',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    text: 'text-blue-700',
  },
  RESOLVED: {
    label: 'Resolved / Reunited',
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    text: 'text-slate-600',
  },
};
