import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppCommonModule } from '../app-common.module';
import { CadastroComponent as CadastroDeMonstrosComponent } from './cadastro/cadastro.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { MedidasCadastroComponent } from './medidas-cadastro/medidas-cadastro.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MedidasService } from './medidas/medidas.service';
import { MonstrosMaterialModule } from './monstros-material.module';
import { MonstrosRoutingModule } from './monstros-routing.module';
import { MonstrosComponent } from './monstros.component';
import { RankingsCadastroComponent } from './rankings-cadastro/rankings-cadastro.component';
import { RankingsParticipacaoComponent } from './rankings-participacao/rankings-participacao.component';
import { AssiduidadeComponent } from './rankings/assiduidade/assiduidade.component';
import { FiltroComponent as FiltroDoRanking } from './rankings/filtro/filtro.component';
import { PosicaoComponent } from './rankings/posicao/posicao.component';
import { RankingsItemComponent } from './rankings/rankings-item.component';
import { RankingsParticipantesComponent } from './rankings/rankings-participantes.component';
import { RankingsComponent } from './rankings/rankings.component';
import { SeriesCadastroExercicioComponent } from './series-cadastro/series-cadastro-exercicio.component';
import { CadastroDeSeries } from './series-cadastro/series-cadastro.application-model';
import { SeriesCadastroComponent } from './series-cadastro/series-cadastro.component';
import { SeriesCadastroService } from './series-cadastro/series-cadastro.service';
import { SeriesExecucaoExercicioComponent } from './series-execucao/series-execucao-exercicio.component';
import { ExecucaoDeSeries } from './series-execucao/series-execucao.application-model';
import { SeriesExecucaoComponent } from './series-execucao/series-execucao.component';
import { SeriesExecucaoService } from './series-execucao/series-execucao.service';
import { ExecucoesItemComponent as ExecucoesDeSerieItemComponent } from './series/execucoes/execucoes-item.component';
import { ExecucoesComponent as ExecucoesDeSerieComponent } from './series/execucoes/execucoes.component';
import { SeriesExecucoesComponent } from './series/series-execucoes.component';
import { SeriesExerciciosComponent } from './series/series-exercicios.component';
import { SeriesItemComponent } from './series/series-item.component';
import { SeriesComponent } from './series/series.component';
import { TreinosComponent } from './treinos/treinos.component';
import { RepositorioDeSeries } from './series/series.domain-model';
import { SeriesFirestoreService } from './series/series.firestore-service';

@NgModule({
  declarations: [
    MonstrosComponent,
    CadastroDeMonstrosComponent,
    TreinosComponent,
    MedidasCadastroComponent,
    MedidasComponent,
    RankingsCadastroComponent,
    RankingsComponent,
    ConfiguracoesComponent,
    RankingsParticipacaoComponent,
    RankingsItemComponent,
    RankingsParticipantesComponent,
    PosicaoComponent,
    AssiduidadeComponent,
    FiltroDoRanking,
    ExecucoesDeSerieComponent,
    ExecucoesDeSerieItemComponent,
    SeriesCadastroComponent,
    SeriesCadastroExercicioComponent,
    SeriesComponent,
    SeriesItemComponent,
    SeriesExerciciosComponent,
    SeriesExecucoesComponent,
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
    MedidasCadastroComponent,
    RankingsCadastroComponent,
    RankingsParticipacaoComponent,
    SeriesCadastroComponent,
    SeriesCadastroExercicioComponent,
    FiltroDoRanking,
    SeriesExecucaoComponent,
    SeriesExecucaoExercicioComponent,
  ],
  providers: [
    MedidasService,
    { provide: RepositorioDeSeries, useClass: SeriesFirestoreService },
    { provide: CadastroDeSeries, useClass: SeriesCadastroService },
    { provide: ExecucaoDeSeries, useClass: SeriesExecucaoService }
  ]
})
export class MonstrosModule { }
