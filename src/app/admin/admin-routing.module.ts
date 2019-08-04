import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../auth/admin.guard';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminMonstrosComponent } from './monstros/admin-monstros.component';
import { AdminMonstrosListagemComponent } from './monstros/listagem/admin-monstros-listagem.component';
import { AdminMonstrosMedidasComponent } from './monstros/medidas/admin-monstros-medidas.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        canActivateChild: [AdminGuard],
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          {
            path: 'monstros',
            component: AdminMonstrosComponent,
            children: [
              { path: 'listagem', component: AdminMonstrosListagemComponent },
              { path: 'medidas', component: AdminMonstrosMedidasComponent },
            ]
          },
          {
            path: 'cadastro',
            loadChildren: '../cadastro/cadastro.module#CadastroModule',
            canLoad: [AdminGuard],
          },
          { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
        ]
      },
    ]
  }
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
