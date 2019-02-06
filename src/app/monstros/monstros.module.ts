import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IndicadorDeGorduraVisceralComponent } from './medidas/indicadores/indicador-de-gordura-visceral.component';
import { IndicadorDeGorduraComponent } from './medidas/indicadores/indicador-de-gordura.component';
import { IndicadorDeIndiceDeMassaCorporalComponent } from './medidas/indicadores/indicador-de-indice-de-massa-corporal.component';
import { IndicadorDeMusculoComponent } from './medidas/indicadores/indicador-de-musculo.component';
import { MedidaComponent } from './medidas/medida.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MedidasService } from './medidas/medidas.service';
import { MonstroNaoEncontradoComponent } from './monstro-nao-encontrado/monstro-nao-encontrado.component';
import { MonstroPerfilComponent } from './monstro-perfil.component';
import { MonstrosMaterialModule } from './monstros-material.module';
import { MonstrosRoutingModule } from './monstros-routing.module';
import { MonstrosComponent } from './monstros.component';
import { SeriesComponent } from './series/series.component';

@NgModule({
  declarations: [
    MonstrosComponent,
    MedidaComponent,
    MedidasComponent,
    SeriesComponent,
    MonstroNaoEncontradoComponent,
    MonstroPerfilComponent,
    IndicadorDeGorduraVisceralComponent,
    IndicadorDeGorduraComponent,
    IndicadorDeIndiceDeMassaCorporalComponent,
    IndicadorDeMusculoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MonstrosMaterialModule,
    MonstrosRoutingModule,
  ],
  entryComponents: [
    MedidaComponent,
    IndicadorDeGorduraVisceralComponent,
    IndicadorDeGorduraComponent,
    IndicadorDeIndiceDeMassaCorporalComponent,
    IndicadorDeMusculoComponent
  ],
  providers: [
    MedidasService
  ]
})
export class MonstrosModule { }
