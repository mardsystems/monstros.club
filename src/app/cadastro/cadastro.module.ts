import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '../app-@common.module';
import { AcademiasCadastroComponent } from './academias-cadastro/academias-cadastro.component';
import { AcademiasComponent } from './academias/academias.component';
import { AparelhosCadastroComponent } from './aparelhos-cadastro/aparelhos-cadastro.component';
import { AparelhosExerciciosComponent } from './aparelhos/aparelhos-exercicios.component';
import { AparelhosComponent } from './aparelhos/aparelhos.component';
import { CadastroMaterialModule } from './cadastro-material.module';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './cadastro.component';
import { ExerciciosCadastroComponent } from './exercicios-cadastro/exercicios-cadastro.component';
import { ExerciciosComponent } from './exercicios/exercicios.component';

@NgModule({
  declarations: [
    CadastroComponent,
    AcademiasComponent,
    AcademiasCadastroComponent,
    ExerciciosComponent,
    ExerciciosCadastroComponent,
    AparelhosComponent,
    AparelhosCadastroComponent,
    AparelhosExerciciosComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CadastroRoutingModule,
    CadastroMaterialModule,
    AppCommonModule,
  ],
  entryComponents: [
    AcademiasCadastroComponent,
    ExerciciosCadastroComponent,
    AparelhosCadastroComponent,
  ],
})
export class CadastroModule { }
