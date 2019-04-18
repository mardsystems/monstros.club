import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '../app-common.module';
import { CADASTRO_DE_ACADEMIAS } from './academias-cadastro/@academias-cadastro-application.model';
import { AcademiasCadastroService } from './academias-cadastro/@academias-cadastro.service';
import { AcademiasCadastroComponent } from './academias-cadastro/academias-cadastro.component';
import { CONSULTA_DE_ACADEMIAS } from './academias/@academias-application.model';
import { REPOSITORIO_DE_ACADEMIAS } from './academias/@academias-domain.model';
import { AcademiasFirebaseService } from './academias/@academias-firebase.service';
import { AcademiasComponent } from './academias/academias.component';
import { CADASTRO_DE_APARELHOS } from './aparelhos-cadastro/@aparelhos-cadastro-application.model';
import { AparelhosCadastroService } from './aparelhos-cadastro/@aparelhos-cadastro.service';
import { AparelhosCadastroComponent } from './aparelhos-cadastro/aparelhos-cadastro.component';
import { CONSULTA_DE_APARELHOS } from './aparelhos/@aparelhos-application.model';
import { REPOSITORIO_DE_APARELHOS } from './aparelhos/@aparelhos-domain.model';
import { AparelhosFirebaseService } from './aparelhos/@aparelhos-firebase.service';
import { AparelhosExerciciosComponent } from './aparelhos/aparelhos-exercicios.component';
import { AparelhosComponent } from './aparelhos/aparelhos.component';
import { CadastroMaterialModule } from './cadastro-material.module';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './cadastro.component';
import { CADASTRO_DE_EXERCICIOS } from './exercicios-cadastro/@exercicios-cadastro-application.model';
import { ExerciciosCadastroService } from './exercicios-cadastro/@exercicios-cadastro.service';
import { ExerciciosCadastroComponent } from './exercicios-cadastro/exercicios-cadastro.component';
import { CONSULTA_DE_EXERCICIOS } from './exercicios/@exercicios-application.model';
import { REPOSITORIO_DE_EXERCICIOS } from './exercicios/@exercicios-domain.model';
import { ExerciciosFirebaseService } from './exercicios/@exercicios-firebase.service';
import { ExerciciosComponent } from './exercicios/exercicios.component';
import { MonstrosFirebaseService } from './monstros/@monstros-firebase.service';
import { MonstrosMembershipService } from './monstros/@monstros-membership.service';

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
    // MonstrosCadastroComponent,
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
    // MonstrosCadastroComponent,
  ],
  providers: [
    AcademiasFirebaseService,
    { provide: REPOSITORIO_DE_ACADEMIAS, useClass: AcademiasFirebaseService },
    { provide: CONSULTA_DE_ACADEMIAS, useClass: AcademiasFirebaseService },
    { provide: CADASTRO_DE_ACADEMIAS, useClass: AcademiasCadastroService },
    ExerciciosFirebaseService,
    { provide: REPOSITORIO_DE_EXERCICIOS, useClass: ExerciciosFirebaseService },
    { provide: CONSULTA_DE_EXERCICIOS, useClass: ExerciciosFirebaseService },
    { provide: CADASTRO_DE_EXERCICIOS, useClass: ExerciciosCadastroService },
    AparelhosFirebaseService,
    { provide: REPOSITORIO_DE_APARELHOS, useClass: AparelhosFirebaseService },
    { provide: CONSULTA_DE_APARELHOS, useClass: AparelhosFirebaseService },
    { provide: CADASTRO_DE_APARELHOS, useClass: AparelhosCadastroService },
    MonstrosMembershipService,
    MonstrosFirebaseService,
  ],
})
export class CadastroModule { }
