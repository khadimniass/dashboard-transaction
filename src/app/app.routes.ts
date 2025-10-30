import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionDetailComponent } from './components/transaction-detail/transaction-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/:reference', component: TransactionDetailComponent },
  { path: '**', redirectTo: '/dashboard' },
];
