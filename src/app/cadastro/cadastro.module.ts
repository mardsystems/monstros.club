import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '../app-common.module';
import { AcademiasComponent } from './academias/academias.component';
import { CadastroComponent as CadastroDeAcademiasComponent } from './academias/cadastro/cadastro.component';
import { AparelhosComponent } from './aparelhos/aparelhos.component';
import { CadastroComponent as CadastroDeAparelhosComponent } from './aparelhos/cadastro/cadastro.component';
import { CadastroMaterialModule } from './cadastro-material.module';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './cadastro.component';
import { CadastroComponent as CadastroDeExerciciosComponent } from './exercicios/cadastro/cadastro.component';
import { ExerciciosComponent } from './exercicios/exercicios.component';
import { AparelhosExerciciosComponent } from './aparelhos/aparelhos-exercicios.component';

@NgModule({
  declarations: [
    CadastroComponent,
    AcademiasComponent,
    CadastroDeAcademiasComponent,
    ExerciciosComponent,
    CadastroDeExerciciosComponent,
    AparelhosComponent,
    CadastroDeAparelhosComponent,
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
    CadastroDeAcademiasComponent,
    CadastroDeExerciciosComponent,
    CadastroDeAparelhosComponent,
  ],
})
export class CadastroModule { }
