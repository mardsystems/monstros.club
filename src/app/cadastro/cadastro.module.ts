import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '../app-common.module';
import { AcademiasComponent } from './academias/academias.component';
import { CadastroComponent as CadastroDeAcademiasComponent } from './academias/cadastro/cadastro.component';
import { AparelhosComponent } from './aparelhos/aparelhos.component';
import { CadastroMaterialModule } from './cadastro-material.module';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './cadastro.component';
import { ExerciciosComponent } from './exercicios/exercicios.component';

@NgModule({
  declarations: [
    CadastroComponent,
    AcademiasComponent,
    CadastroDeAcademiasComponent,
    ExerciciosComponent,
    AparelhosComponent,
    CadastroComponent,
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
  ],
})
export class CadastroModule { }
