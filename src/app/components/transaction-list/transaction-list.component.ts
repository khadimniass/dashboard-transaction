import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
  TransactionFilter,
} from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'date',
    'customer',
    'type',
    'amount',
    'status',
    'paymentMethod',
    'reference',
    'actions',
  ];

  dataSource: MatTableDataSource<Transaction>;
  transactions: Transaction[] = [];
  loading = true;

  // Filter properties
  searchTerm = '';
  selectedStatus: TransactionStatus | '' = '';
  selectedType: TransactionType | '' = '';

  // Enums for template
  statuses = Object.values(TransactionStatus);
  types = Object.values(TransactionType);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private transactionService: TransactionService,
    private exportService: ExportService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Transaction>([]);
  }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions(filter?: TransactionFilter) {
    this.loading = true;
    this.transactionService.getTransactions(filter).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.dataSource.data = transactions;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.loading = false;
      },
    });
  }

  applyFilter() {
    const filter: TransactionFilter = {
      searchTerm: this.searchTerm || undefined,
      status: this.selectedStatus || undefined,
      type: this.selectedType || undefined,
    };

    this.loadTransactions(filter);
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.loadTransactions();
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

  viewDetails(transaction: Transaction) {
    this.router.navigate(['/dashboard', transaction.reference]);
  }

  editTransaction(transaction: Transaction) {
    console.log('Edit transaction:', transaction);
    // TODO: Implement edit functionality
  }

  downloadReceipt(transaction: Transaction) {
    console.log('Download receipt for:', transaction);
    // TODO: Implement download functionality
  }

  deleteTransaction(transaction: Transaction) {
    console.log('Delete transaction:', transaction);
    // TODO: Implement delete functionality
  }

  exportToPDF() {
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.pdf`;
    this.exportService.exportToPDF(this.transactions, filename);
  }

  exportToExcel() {
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
    this.exportService.exportToExcel(this.transactions, filename);
  }

  exportToCSV() {
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    this.exportService.exportToCSV(this.transactions, filename);
  }
}
