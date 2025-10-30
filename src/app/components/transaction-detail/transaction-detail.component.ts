import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Transaction, TransactionType, TransactionStatus } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
  ],
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css',
})
export class TransactionDetailComponent implements OnInit {
  transaction: Transaction | null = null;
  loading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    const reference = this.route.snapshot.paramMap.get('reference');
    if (reference) {
      this.loadTransaction(reference);
    } else {
      this.notFound = true;
      this.loading = false;
    }
  }

  loadTransaction(reference: string) {
    this.loading = true;
    this.transactionService.getTransactionByReference(reference).subscribe({
      next: (transaction) => {
        if (transaction) {
          this.transaction = transaction;
          this.notFound = false;
        } else {
          this.notFound = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transaction:', error);
        this.notFound = true;
        this.loading = false;
      },
    });
  }

  getStatusClass(status: TransactionStatus): string {
    const statusClasses: { [key in TransactionStatus]: string } = {
      [TransactionStatus.COMPLETED]: 'status-completed',
      [TransactionStatus.PENDING]: 'status-pending',
      [TransactionStatus.FAILED]: 'status-failed',
      [TransactionStatus.CANCELLED]: 'status-cancelled',
    };
    return statusClasses[status];
  }

  getTypeClass(type: TransactionType): string {
    const typeClasses: { [key in TransactionType]: string } = {
      [TransactionType.PAYMENT]: 'type-payment',
      [TransactionType.REFUND]: 'type-refund',
      [TransactionType.TRANSFER]: 'type-transfer',
      [TransactionType.WITHDRAWAL]: 'type-withdrawal',
      [TransactionType.DEPOSIT]: 'type-deposit',
    };
    return typeClasses[type];
  }

  getStatusLabel(status: TransactionStatus): string {
    const labels: { [key in TransactionStatus]: string } = {
      [TransactionStatus.COMPLETED]: 'Complétée',
      [TransactionStatus.PENDING]: 'En attente',
      [TransactionStatus.FAILED]: 'Échouée',
      [TransactionStatus.CANCELLED]: 'Annulée',
    };
    return labels[status];
  }

  getTypeLabel(type: TransactionType): string {
    const labels: { [key in TransactionType]: string } = {
      [TransactionType.PAYMENT]: 'Paiement',
      [TransactionType.REFUND]: 'Remboursement',
      [TransactionType.TRANSFER]: 'Transfert',
      [TransactionType.WITHDRAWAL]: 'Retrait',
      [TransactionType.DEPOSIT]: 'Dépôt',
    };
    return labels[type];
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
