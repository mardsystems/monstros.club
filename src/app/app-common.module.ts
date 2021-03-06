import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotaoDeExercicioComponent } from './botoes/botao-de-exercicio.component';
import { IndicadorDeGorduraVisceralComponent } from './indicadores/indicador-de-gordura-visceral.component';
import { IndicadorDeGorduraComponent } from './indicadores/indicador-de-gordura.component';
import { IndicadorDeIndiceDeMassaCorporalComponent } from './indicadores/indicador-de-indice-de-massa-corporal.component';
import { IndicadorDeMusculoComponent } from './indicadores/indicador-de-musculo.component';
import { AppMaterialModule } from './app-material.module';

@NgModule({
  declarations: [
    BotaoDeExercicioComponent,
    IndicadorDeGorduraVisceralComponent,
    IndicadorDeGorduraComponent,
    IndicadorDeIndiceDeMassaCorporalComponent,
    IndicadorDeMusculoComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule
  ],
  exports: [
    BotaoDeExercicioComponent,
    IndicadorDeGorduraVisceralComponent,
    IndicadorDeGorduraComponent,
    IndicadorDeIndiceDeMassaCorporalComponent,
    IndicadorDeMusculoComponent,
  ]
})
export class AppCommonModule { }
