import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '../common/common.module';
import { CONSULTA_DE_MEDIDAS } from '../monstros/medidas/@medidas-application.model';
import { MedidasFirebaseService } from '../monstros/medidas/@medidas-firebase.service';
import { AdminMaterialModule } from './admin-material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminCadastroComponent } from './cadastro/admin-cadastro.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminMonstrosComponent } from './monstros/admin-monstros.component';
import { AdminMonstrosListagemComponent } from './monstros/listagem/admin-monstros-listagem.component';
import { AdminMonstrosMedidasComponent } from './monstros/medidas/admin-monstros-medidas.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminMonstrosComponent,
    AdminMonstrosListagemComponent,
    AdminMonstrosMedidasComponent,
    AdminCadastroComponent,
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
