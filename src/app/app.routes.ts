import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { TransactionDetailComponent } from './components/transaction-detail/transaction-detail.component';
import { adminGuard, userGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  /*
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard/:reference', component: TransactionDetailComponent },
    ],
  },
  */
 {
  path: 'admin',
  canActivate: [adminGuard],
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    {
      path: 'dashboard/:reference',
      component: TransactionDetailComponent,
      data: { renderMode: 'server' } // 🔹 Désactive le prerender pour cette route
    },
  ],
  },
  {
    path: 'user',
    canActivate: [userGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: UserDashboardComponent },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
