import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
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
import { RankingsParticipantesComponent } from './rankings/rankings-participantes.component';
import { RankingsComponent } from './rankings/rankings.component';
import { SeriesCadastroExercicioComponent } from './series-cadastro/series-cadastro-exercicio.component';
import { SeriesCadastroComponent as CadastroDeSeriesComponent } from './series-cadastro/series-cadastro.component';
import { SeriesExecucaoExercicioComponent } from './series-execucao/series-execucao-exercicio.component';
import { SeriesExecucaoComponent } from './series-execucao/series-execucao.component';
import { ExecucoesItemComponent as ExecucoesDeSerieItemComponent } from './series/execucoes/execucoes-item.component';
import { ExecucoesComponent as ExecucoesDeSerieComponent } from './series/execucoes/execucoes.component';
import { SeriesExecucoesComponent } from './series/series-execucoes.component';
import { SeriesExerciciosComponent } from './series/series-exercicios.component';
import { SeriesItemComponent } from './series/series-item.component';
import { SeriesComponent } from './series/series.component';
import { TreinosComponent } from './treinos/treinos.component';

@NgModule({
  declarations: [
    MonstrosComponent,
    CadastroDeMonstrosComponent,
    SeriesComponent,
    SeriesItemComponent,
    SeriesExerciciosComponent,
    SeriesExecucoesComponent,
    TreinosComponent,
    CadastroDeMedidasComponent,
    MedidasComponent,
    CadastroDeRankingsComponent,
    RankingsComponent,
    ConfiguracoesComponent,
    ParticipacaoNoRankingComponent,
    RankingsItemComponent,
    RankingsParticipantesComponent,
    CadastroDeSeriesComponent,
    SeriesCadastroExercicioComponent,
    PosicaoComponent,
    AssiduidadeComponent,
    FiltroDoRanking,
    ExecucoesDeSerieComponent,
    ExecucoesDeSerieItemComponent,
    SeriesExecucaoComponent,
    SeriesExecucaoExercicioComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxChartsModule,
    MonstrosMaterialModule,
    MonstrosRoutingModule,
    AppCommonModule,
  ],
  entryComponents: [
    CadastroDeMedidasComponent,
    CadastroDeRankingsComponent,
    ParticipacaoNoRankingComponent,
    CadastroDeSeriesComponent,
    SeriesCadastroExercicioComponent,
    FiltroDoRanking,
    SeriesExecucaoComponent,
    SeriesExecucaoExercicioComponent,
  ],
  providers: [
    MedidasService
  ]
})
export class MonstrosModule { }
