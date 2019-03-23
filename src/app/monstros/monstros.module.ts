import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '../app-common.module';
import { CadastroComponent as CadastroDeMonstrosComponent } from './cadastro/cadastro.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { CadastroComponent as CadastroDeMedidasComponent } from './medidas/cadastro/cadastro.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MedidasService } from './medidas/medidas.service';
import { MonstrosMaterialModule } from './monstros-material.module';
import { MonstrosRoutingModule } from './monstros-routing.module';
import { MonstrosComponent } from './monstros.component';
import { AssiduidadeComponent } from './rankings/assiduidade/assiduidade.component';
import { CadastroComponent as CadastroDeRankingsComponent } from './rankings/cadastro/cadastro.component';
import { FiltroComponent as FiltroDoRanking } from './rankings/filtro/filtro.component';
import { ParticipacaoComponent as ParticipacaoNoRankingComponent } from './rankings/participacao/participacao.component';
import { PosicaoComponent } from './rankings/posicao/posicao.component';
import { RankingsItemComponent } from './rankings/rankings-item.component';
import { ParticipantesComponent } from './rankings/rankings-participantes.component';
import { RankingsComponent } from './rankings/rankings.component';
import { CadastroComponent as CadastroDeSeriesComponent } from './series/cadastro/cadastro.component';
import { SeriesComponent } from './series/series.component';
import { TreinosComponent } from './treinos/treinos.component';
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
    RankingsItemComponent,
    ParticipantesComponent,
    CadastroDeSeriesComponent,
    PosicaoComponent,
    AssiduidadeComponent,
    FiltroDoRanking,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MonstrosMaterialModule,
    MonstrosRoutingModule,
    AppCommonModule,
  ],
  entryComponents: [
    CadastroDeMedidasComponent,
    CadastroDeRankingsComponent,
    ParticipacaoNoRankingComponent,
    CadastroDeSeriesComponent,
    FiltroDoRanking
  ],
  providers: [
    MedidasService
  ]
})
export class MonstrosModule { }
