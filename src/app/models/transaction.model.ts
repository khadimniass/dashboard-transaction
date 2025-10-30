export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  customer: {
    name: string;
    email: string;
  };
  paymentMethod: string;
  reference: string;
}

export enum TransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  TRANSFER = 'TRANSFER',
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface TransactionFilter {
  status?: TransactionStatus;
  type?: TransactionType;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}
