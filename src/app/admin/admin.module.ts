import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '../common/common.module';
import { CONSULTA_DE_MEDIDAS } from '../monstros/medidas/@medidas-application.model';
import { MedidasFirebaseService } from '../monstros/medidas/@medidas-firebase.service';
import { AdminMaterialModule } from './admin-material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListagemComponent } from './monstros/listagem/listagem.component';
import { MedidasComponent } from './monstros/medidas/medidas.component';
import { MonstrosComponent } from './monstros/monstros.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    MonstrosComponent,
    ListagemComponent,
    MedidasComponent,
    CadastroComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminMaterialModule,
    AdminRoutingModule,
    AppCommonModule,
  ],
  entryComponents: [
  ],
  providers: [
    { provide: CONSULTA_DE_MEDIDAS, useClass: MedidasFirebaseService },
  ]
})
export class AdminModule { }
