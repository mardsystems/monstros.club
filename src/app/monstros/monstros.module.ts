import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { MedidaComponent } from './medidas/medida.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MedidasService } from './medidas/medidas.service';
import { MonstroPerfilComponent } from './monstro-perfil.component';
import { MonstrosMaterialModule } from './monstros-material.module';
import { MonstrosRoutingModule } from './monstros-routing.module';
import { MonstrosComponent } from './monstros.component';
import { RankingsComponent } from './rankings/rankings.component';
import { SeriesComponent } from './series/series.component';
import { RankingComponent } from './rankings/ranking.component';
import { AppCommonModule } from '../app-common.module';

@NgModule({
  declarations: [
    MonstrosComponent,
    MedidaComponent,
    MedidasComponent,
    SeriesComponent,
    MonstroPerfilComponent,
    RankingComponent,
    RankingsComponent,
    ConfiguracoesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MonstrosMaterialModule,
    MonstrosRoutingModule,
    AppCommonModule,
  ],
  entryComponents: [
    MedidaComponent,
    RankingComponent,
  ],
  providers: [
    MedidasService
  ]
})
export class MonstrosModule { }
