import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { ExportService } from '../../services/export.service';
import { Transaction, TransactionStatus, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    MatTableModule,
    MatDividerModule,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit {
  user: any;
  transactions: Transaction[] = [];
  loading = true;

  stats = {
    total: 0,
    totalAmount: 0,
  };

  constructor(
    public authService: AuthService,
    private transactionService: TransactionService,
    private exportService: ExportService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        // Filter only completed transactions for regular user
        this.transactions = transactions
          .filter((t) => t.status === TransactionStatus.COMPLETED)
          .slice(0, 5); // Show only last 5
        this.calculateStats(transactions);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.loading = false;
      },
    });
  }

  calculateStats(transactions: Transaction[]) {
    const completed = transactions.filter((t) => t.status === TransactionStatus.COMPLETED);
    this.stats.total = completed.length;
    this.stats.totalAmount = completed.reduce((sum, t) => sum + t.amount, 0);
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

  exportToPDF() {
    const filename = `mes_transactions_${new Date().toISOString().split('T')[0]}.pdf`;
    this.exportService.exportToPDF(this.transactions, filename);
  }

  exportToExcel() {
    const filename = `mes_transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
    this.exportService.exportToExcel(this.transactions, filename);
  }

  exportToCSV() {
    const filename = `mes_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    this.exportService.exportToCSV(this.transactions, filename);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
