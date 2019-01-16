import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MonstrosComponent } from './monstros.component';
import { MedidaComponent } from './medidas/medida.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MedidasService } from './medidas/medidas.service';
import { SeriesComponent } from './series/series.component';

import { MonstrosMaterialModule } from './monstros-material.module';
import { MonstrosRoutingModule } from './monstros-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { MonstroNaoEncontradoComponent } from './monstro-nao-encontrado/monstro-nao-encontrado.component';

@NgModule({
  declarations: [
    MonstrosComponent,
    MedidaComponent,
    MedidasComponent,
    SeriesComponent,
    DashboardComponent,
    HomeComponent,
    MonstroNaoEncontradoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MonstrosMaterialModule,
    MonstrosRoutingModule
  ],
  entryComponents: [
    MedidaComponent
  ],
  providers: [
    MedidasService
  ]
})
export class MonstrosModule { }
