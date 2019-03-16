import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../auth/admin.guard.';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListagemComponent } from './monstros/listagem/listagem.component';
import { MedidasComponent } from './monstros/medidas/medidas.component';
import { MonstrosComponent } from './monstros/monstros.component';

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
          { path: 'dashboard', component: DashboardComponent },
          {
            path: 'monstros',
            component: MonstrosComponent,
            children: [
              { path: 'listagem', component: ListagemComponent },
              { path: 'medidas', component: MedidasComponent },
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
