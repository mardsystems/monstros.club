import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '../app-common.module';
import { AcademiasComponent } from './academias/academias.component';
import { AparelhosComponent } from './aparelhos/aparelhos.component';
import { CadastroMaterialModule } from './cadastro-material.module';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './cadastro.component';
import { ExerciciosComponent } from './exercicios/exercicios.component';

@NgModule({
  declarations: [
    CadastroComponent,
    AcademiasComponent,
    ExerciciosComponent,
    AparelhosComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CadastroRoutingModule,
    CadastroMaterialModule,
    AppCommonModule,
  ]
})
export class CadastroModule { }
