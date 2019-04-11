import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '../app-common.module';
import { AcademiasComponent } from './academias/academias.component';
import { AparelhosExerciciosComponent } from './aparelhos/aparelhos-exercicios.component';
import { AparelhosComponent } from './aparelhos/aparelhos.component';
import { CadastroAcademiasComponent } from './cadastro-academias/cadastro-academias.component';
import { CadastroAparelhosComponent } from './cadastro-aparelhos/cadastro-aparelhos.component';
import { CadastroExerciciosComponent } from './cadastro-exercicios/cadastro-exercicios.component';
import { CadastroMaterialModule } from './cadastro-material.module';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './cadastro.component';
import { ExerciciosComponent } from './exercicios/exercicios.component';

@NgModule({
  declarations: [
    CadastroComponent,
    AcademiasComponent,
    CadastroAcademiasComponent,
    ExerciciosComponent,
    CadastroExerciciosComponent,
    AparelhosComponent,
    CadastroAparelhosComponent,
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
    CadastroAcademiasComponent,
    CadastroExerciciosComponent,
    CadastroAparelhosComponent,
  ],
})
export class CadastroModule { }
