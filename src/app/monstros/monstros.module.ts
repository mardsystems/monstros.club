import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '../app-common.module';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { CadastroComponent as CadastroDeMedidasComponent } from './medidas/cadastro/cadastro.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MedidasService } from './medidas/medidas.service';
import { CadastroComponent as CadastroDeMonstrosComponent } from './cadastro/cadastro.component';
import { MonstrosMaterialModule } from './monstros-material.module';
import { MonstrosRoutingModule } from './monstros-routing.module';
import { MonstrosComponent } from './monstros.component';
import { CadastroComponent as CadastroDeRankingsComponent } from './rankings/cadastro/cadastro.component';
import { RankingsComponent } from './rankings/rankings.component';
import { SeriesComponent } from './series/series.component';
import { TreinosComponent } from './treinos/treinos.component';
import { ParticipacaoComponent as ParticipacaoNoRankingComponent } from './rankings/cadastro/participacao.component';
import { RankingComponent } from './rankings/ranking.component';
import { ParticipantesComponent } from './rankings/participantes.component';

@NgModule({
  declarations: [
    MonstrosComponent,
    CadastroDeMonstrosComponent,
    SeriesComponent,
    TreinosComponent,
    CadastroDeMedidasComponent,
    MedidasComponent,
    CadastroDeRankingsComponent,
    RankingsComponent,
    ConfiguracoesComponent,
    ParticipacaoNoRankingComponent,
    RankingComponent,
    ParticipantesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MonstrosMaterialModule,
    MonstrosRoutingModule,
    AppCommonModule,
  ],
  entryComponents: [
    CadastroDeMedidasComponent,
    CadastroDeRankingsComponent,
    ParticipacaoNoRankingComponent,
  ],
  providers: [
    MedidasService
  ]
})
export class MonstrosModule { }
