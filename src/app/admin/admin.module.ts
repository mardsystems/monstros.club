import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminMaterialModule } from './admin-material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MonstrosComponent } from './monstros/monstros.component';
import { AppCommonModule } from '../app-common.module';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    MonstrosComponent,
    MedidasComponent,
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
  ]
})
export class AdminModule { }
