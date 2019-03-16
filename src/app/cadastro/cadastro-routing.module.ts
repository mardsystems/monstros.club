import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AcademiasComponent } from './academias/academias.component';
import { AparelhosComponent } from './aparelhos/aparelhos.component';
import { CadastroComponent } from './cadastro.component';
import { ExerciciosComponent } from './exercicios/exercicios.component';

const cadastroRoutes: Routes = [
  {
    path: '',
    component: CadastroComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'academias', component: AcademiasComponent },
          { path: 'exercicios', component: ExerciciosComponent },
          { path: 'aparelhos', component: AparelhosComponent },
          // { path: '', component: CadastroComponent }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(cadastroRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CadastroRoutingModule { }
