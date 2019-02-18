import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MonstrosComponent } from './monstros/monstros.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'monstros', component: MonstrosComponent },
          { path: 'medidas', component: MedidasComponent },
          { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
