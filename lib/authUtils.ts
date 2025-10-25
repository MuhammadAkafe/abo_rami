import { AUTH_STORAGE_KEYS } from '@/constans/constans';

export interface SupplierData {
  id: number;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  cities: Array<{
    id: number;
    city: string;
    supplierId: number;
  }>;
  createdAt: Date;
}

export const getSupplierToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_STORAGE_KEYS.SUPPLIER_TOKEN);
};

export const getSupplierData = (): SupplierData | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(AUTH_STORAGE_KEYS.SUPPLIER_DATA);
  return data ? JSON.parse(data) : null;
};

export const setSupplierAuth = (token: string, supplierData: SupplierData): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEYS.SUPPLIER_TOKEN, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.SUPPLIER_DATA, JSON.stringify(supplierData));
};

export const clearSupplierAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEYS.SUPPLIER_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.SUPPLIER_DATA);
};

export const isSupplierAuthenticated = (): boolean => {
  const token = getSupplierToken();
  const data = getSupplierData();
  return !!(token && data);
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getSupplierToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
