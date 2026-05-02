export interface Transaction {
  id: number;
  account_id: number | null;
  user_id: number;
  credit_card_id: number | null;
  parent_id: number | null;
  description: string;
  amount: number;
  currency_code: string;
  date: string;
  category_id: number | null;
  type: 'CREDIT' | 'DEBIT' | 'TRANSFER';
  status: string;
  source: string | null;
  is_installment: boolean;
  installment_current: number | null;
  installment_total: number | null;
  total_purchase_amount: number | null;
  invoice_date: string | null;
  category_name?: string;
  account_name?: string;
  credit_card_name?: string;
}

export interface TransactionFilters {
  start_date?: string;
  end_date?: string;
  month?: number;
  year?: number;
  type?: 'CREDIT' | 'DEBIT' | 'TRANSFER' | '';
  category_id?: string | number;
  day?: number;
  page?: number;
  per_page?: number;
}

export interface TransactionPaginatedResponse {
  data: Transaction[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}
