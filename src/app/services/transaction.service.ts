import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
  TransactionFilter,
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private mockTransactions: Transaction[] = [
    {
      id: 'TXN-001',
      date: new Date('2025-10-28T10:30:00'),
      amount: 1250.5,
      currency: 'EUR',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
      description: 'Payment for web development services',
      customer: {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
      },
      paymentMethod: 'Carte de crédit',
      reference: 'REF-2025-001',
    },
    {
      id: 'TXN-002',
      date: new Date('2025-10-28T14:15:00'),
      amount: 3500.0,
      currency: 'EUR',
      type: TransactionType.TRANSFER,
      status: TransactionStatus.PENDING,
      description: 'Transfer to vendor account',
      customer: {
        name: 'Marie Martin',
        email: 'marie.martin@example.com',
      },
      paymentMethod: 'Virement bancaire',
      reference: 'REF-2025-002',
    },
    {
      id: 'TXN-003',
      date: new Date('2025-10-27T09:45:00'),
      amount: 450.75,
      currency: 'EUR',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
      description: 'Monthly subscription payment',
      customer: {
        name: 'Pierre Bernard',
        email: 'pierre.bernard@example.com',
      },
      paymentMethod: 'PayPal',
      reference: 'REF-2025-003',
    },
    {
      id: 'TXN-004',
      date: new Date('2025-10-27T16:20:00'),
      amount: 125.0,
      currency: 'EUR',
      type: TransactionType.REFUND,
      status: TransactionStatus.COMPLETED,
      description: 'Refund for cancelled order',
      customer: {
        name: 'Sophie Laurent',
        email: 'sophie.laurent@example.com',
      },
      paymentMethod: 'Carte de crédit',
      reference: 'REF-2025-004',
    },
    {
      id: 'TXN-005',
      date: new Date('2025-10-26T11:00:00'),
      amount: 2800.0,
      currency: 'EUR',
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      description: 'Initial deposit',
      customer: {
        name: 'Luc Moreau',
        email: 'luc.moreau@example.com',
      },
      paymentMethod: 'Virement bancaire',
      reference: 'REF-2025-005',
    },
    {
      id: 'TXN-006',
      date: new Date('2025-10-26T13:30:00'),
      amount: 950.25,
      currency: 'EUR',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.FAILED,
      description: 'Payment attempt - insufficient funds',
      customer: {
        name: 'Claire Petit',
        email: 'claire.petit@example.com',
      },
      paymentMethod: 'Carte de crédit',
      reference: 'REF-2025-006',
    },
    {
      id: 'TXN-007',
      date: new Date('2025-10-25T15:45:00'),
      amount: 5200.0,
      currency: 'EUR',
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
      description: 'Large transfer for business expenses',
      customer: {
        name: 'Thomas Roux',
        email: 'thomas.roux@example.com',
      },
      paymentMethod: 'Virement bancaire',
      reference: 'REF-2025-007',
    },
    {
      id: 'TXN-008',
      date: new Date('2025-10-25T10:15:00'),
      amount: 320.5,
      currency: 'EUR',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.CANCELLED,
      description: 'Cancelled by customer',
      customer: {
        name: 'Isabelle Dubois',
        email: 'isabelle.dubois@example.com',
      },
      paymentMethod: 'PayPal',
      reference: 'REF-2025-008',
    },
    {
      id: 'TXN-009',
      date: new Date('2025-10-24T12:00:00'),
      amount: 1500.0,
      currency: 'EUR',
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.COMPLETED,
      description: 'Cash withdrawal',
      customer: {
        name: 'Antoine Simon',
        email: 'antoine.simon@example.com',
      },
      paymentMethod: 'ATM',
      reference: 'REF-2025-009',
    },
    {
      id: 'TXN-010',
      date: new Date('2025-10-24T08:30:00'),
      amount: 675.8,
      currency: 'EUR',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
      description: 'E-commerce purchase',
      customer: {
        name: 'Camille Leroy',
        email: 'camille.leroy@example.com',
      },
      paymentMethod: 'Carte de crédit',
      reference: 'REF-2025-010',
    },
    {
      id: 'TXN-011',
      date: new Date('2025-10-23T14:20:00'),
      amount: 2100.0,
      currency: 'EUR',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.PENDING,
      description: 'Consulting services payment',
      customer: {
        name: 'Nicolas Garnier',
        email: 'nicolas.garnier@example.com',
      },
      paymentMethod: 'Virement bancaire',
      reference: 'REF-2025-011',
    },
    {
      id: 'TXN-012',
      date: new Date('2025-10-23T11:45:00'),
      amount: 890.0,
      currency: 'EUR',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
      description: 'Software license renewal',
      customer: {
        name: 'Julie Girard',
        email: 'julie.girard@example.com',
      },
      paymentMethod: 'Carte de crédit',
      reference: 'REF-2025-012',
    },
  ];

  constructor() {}

  getTransactions(filter?: TransactionFilter): Observable<Transaction[]> {
    let filtered = [...this.mockTransactions];

    if (filter) {
      if (filter.status) {
        filtered = filtered.filter((t) => t.status === filter.status);
      }

      if (filter.type) {
        filtered = filtered.filter((t) => t.type === filter.type);
      }

      if (filter.dateFrom) {
        filtered = filtered.filter((t) => t.date >= filter.dateFrom!);
      }

      if (filter.dateTo) {
        filtered = filtered.filter((t) => t.date <= filter.dateTo!);
      }

      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.id.toLowerCase().includes(term) ||
            t.description.toLowerCase().includes(term) ||
            t.customer.name.toLowerCase().includes(term) ||
            t.customer.email.toLowerCase().includes(term) ||
            t.reference.toLowerCase().includes(term)
        );
      }
    }

    // Simulate API delay
    return of(filtered).pipe(delay(300));
  }

  getTransactionById(id: string): Observable<Transaction | undefined> {
    const transaction = this.mockTransactions.find((t) => t.id === id);
    return of(transaction).pipe(delay(200));
  }

  getTransactionStats(): Observable<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    totalAmount: number;
  }> {
    const stats = {
      total: this.mockTransactions.length,
      pending: this.mockTransactions.filter((t) => t.status === TransactionStatus.PENDING).length,
      completed: this.mockTransactions.filter((t) => t.status === TransactionStatus.COMPLETED)
        .length,
      failed: this.mockTransactions.filter((t) => t.status === TransactionStatus.FAILED).length,
      totalAmount: this.mockTransactions
        .filter((t) => t.status === TransactionStatus.COMPLETED)
        .reduce((sum, t) => sum + t.amount, 0),
    };

    return of(stats).pipe(delay(200));
  }
}
