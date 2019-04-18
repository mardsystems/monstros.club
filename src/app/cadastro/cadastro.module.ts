import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseTransactionManager, MonstrosDbContext } from '../@app-firebase.model';
import { UNIT_OF_WORK } from '../@app-transactions.model';
import { AppCommonModule } from '../app-common.module';
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
import { CADASTRO_DE_MONSTROS } from './monstros-cadastro/@monstros-cadastro-application.model';
import { MonstrosCadastroService } from './monstros-cadastro/@monstros-cadastro.service';
import { MonstrosCadastroComponent } from './monstros-cadastro/monstros-cadastro.component';
import { REPOSITORIO_DE_MONSTROS } from './monstros/@monstros-domain.model';
import { MonstrosFirebaseService } from './monstros/@monstros-firebase.service';
import { AdaptadorParaUserInfo } from './monstros/@monstros-integration.model';

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
    MonstrosCadastroComponent,
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
    MonstrosCadastroComponent,
  ],
  providers: [
    // AdaptadorParaUserInfo,
    // { provide: CADASTRO_DE_MONSTROS, useClass: MonstrosCadastroService },
    // { provide: UNIT_OF_WORK, useClass: FirebaseTransactionManager },
    // { provide: REPOSITORIO_DE_MONSTROS, useClass: MonstrosFirebaseService },
    // MonstrosDbContext,
  ],
})
export class CadastroModule { }
