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
      amount: 820500,
      currency: 'XOF',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
      description: 'Paiement services de développement web',
      customer: {
        name: 'Mamadou Diallo',
        email: 'mamadou.diallo@example.com',
      },
      paymentMethod: 'Mobile Money',
      reference: 'REF-2025-001',
    },
    {
      id: 'TXN-002',
      date: new Date('2025-10-28T14:15:00'),
      amount: 2100000,
      currency: 'XAF',
      type: TransactionType.TRANSFER,
      status: TransactionStatus.PENDING,
      description: 'Transfert vers compte fournisseur',
      customer: {
        name: 'Aïssatou Sow',
        email: 'aissatou.sow@example.com',
      },
      paymentMethod: 'Virement bancaire',
      reference: 'REF-2025-002',
    },
    {
      id: 'TXN-003',
      date: new Date('2025-10-27T09:45:00'),
      amount: 4050000,
      currency: 'GNF',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
      description: 'Paiement abonnement mensuel',
      customer: {
        name: 'Ousmane Traoré',
        email: 'ousmane.traore@example.com',
      },
      paymentMethod: 'Orange Money',
      reference: 'REF-2025-003',
    },
    {
      id: 'TXN-004',
      date: new Date('2025-10-27T16:20:00'),
      amount: 75000,
      currency: 'XOF',
      type: TransactionType.REFUND,
      status: TransactionStatus.COMPLETED,
      description: 'Remboursement commande annulée',
      customer: {
        name: 'Fatou Ndiaye',
        email: 'fatou.ndiaye@example.com',
      },
      paymentMethod: 'Wave',
      reference: 'REF-2025-004',
    },
    {
      id: 'TXN-005',
      date: new Date('2025-10-26T11:00:00'),
      amount: 1680000,
      currency: 'XAF',
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      description: 'Dépôt initial',
      customer: {
        name: 'Ibrahima Sarr',
        email: 'ibrahima.sarr@example.com',
      },
      paymentMethod: 'Virement bancaire',
      reference: 'REF-2025-005',
    },
    {
      id: 'TXN-006',
      date: new Date('2025-10-26T13:30:00'),
      amount: 8550000,
      currency: 'GNF',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.FAILED,
      description: 'Tentative paiement - fonds insuffisants',
      customer: {
        name: 'Aminata Keita',
        email: 'aminata.keita@example.com',
      },
      paymentMethod: 'Carte de crédit',
      reference: 'REF-2025-006',
    },
    {
      id: 'TXN-007',
      date: new Date('2025-10-25T15:45:00'),
      amount: 3120000,
      currency: 'XAF',
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
      description: 'Grand transfert pour dépenses professionnelles',
      customer: {
        name: 'Abdoulaye Ba',
        email: 'abdoulaye.ba@example.com',
      },
      paymentMethod: 'Virement bancaire',
      reference: 'REF-2025-007',
    },
    {
      id: 'TXN-008',
      date: new Date('2025-10-25T10:15:00'),
      amount: 190000,
      currency: 'XOF',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.CANCELLED,
      description: 'Annulé par le client',
      customer: {
        name: 'Mariama Camara',
        email: 'mariama.camara@example.com',
      },
      paymentMethod: 'Mobile Money',
      reference: 'REF-2025-008',
    },
    {
      id: 'TXN-009',
      date: new Date('2025-10-24T12:00:00'),
      amount: 13500000,
      currency: 'GNF',
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.COMPLETED,
      description: 'Retrait en espèces',
      customer: {
        name: 'Seydou Coulibaly',
        email: 'seydou.coulibaly@example.com',
      },
      paymentMethod: 'Distributeur automatique',
      reference: 'REF-2025-009',
    },
    {
      id: 'TXN-010',
      date: new Date('2025-10-24T08:30:00'),
      amount: 405000,
      currency: 'XOF',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
      description: 'Achat e-commerce',
      customer: {
        name: 'Kadiatou Bah',
        email: 'kadiatou.bah@example.com',
      },
      paymentMethod: 'Wave',
      reference: 'REF-2025-010',
    },
    {
      id: 'TXN-011',
      date: new Date('2025-10-23T14:20:00'),
      amount: 1260000,
      currency: 'XAF',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.PENDING,
      description: 'Paiement services de conseil',
      customer: {
        name: 'Boubacar Sy',
        email: 'boubacar.sy@example.com',
      },
      paymentMethod: 'Virement bancaire',
      reference: 'REF-2025-011',
    },
    {
      id: 'TXN-012',
      date: new Date('2025-10-23T11:45:00'),
      amount: 8010000,
      currency: 'GNF',
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
      description: 'Renouvellement licence logiciel',
      customer: {
        name: 'Fatoumata Diop',
        email: 'fatoumata.diop@example.com',
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

  getTransactionByReference(reference: string): Observable<Transaction | undefined> {
    const transaction = this.mockTransactions.find((t) => t.reference === reference);
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
