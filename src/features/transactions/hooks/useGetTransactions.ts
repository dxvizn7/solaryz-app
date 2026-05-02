import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../services';
import { TransactionFilters } from '../types';

export function useGetTransactions(filters: TransactionFilters = {}) {
  const query = useQuery({
    // queryKey composto pelo nome do recurso e os filtros
    queryKey: ['transactions', filters],
    queryFn: () => fetchTransactions(filters),
    staleTime: 15000, // Tempo até os dados serem considerados velhos
  });

  return {
    transactions: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    currentPage: query.data?.current_page ?? 1,
    lastPage: query.data?.last_page ?? 1,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    isError: query.isError,
    error: query.error,
  };
}
