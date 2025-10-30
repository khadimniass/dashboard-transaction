import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from '../../services/transaction.service';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    TransactionListComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  stats = {
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    totalAmount: 0,
  };

  loading = true;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.transactionService.getTransactionStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      },
    });
  }
}
