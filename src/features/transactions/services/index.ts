import { api } from '@/lib/api';
import { Transaction, TransactionFilters, TransactionPaginatedResponse } from '../types';

export const fetchTransactions = async (filters: TransactionFilters = {}) => {
  const { start_date, end_date, type, page = 1, per_page = 20 } = filters;

  const params: Record<string, string | number> = { page, per_page };
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (type) params.type = type;
  if (filters.category_id) params.category_id = filters.category_id;
  if (filters.month) params.month = filters.month;
  if (filters.year) params.year = filters.year;
  if (filters.day) params.day = filters.day;

  const response = await api.get<TransactionPaginatedResponse | Transaction[]>('/transactions', { params });
  
  // O backend pode retornar tanto um array direto quanto objeto paginado
  const raw = response.data;
  if (Array.isArray(raw)) {
    return { data: raw, total: raw.length, current_page: 1, last_page: 1, per_page: raw.length };
  }
  return raw as TransactionPaginatedResponse;
};
