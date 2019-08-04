import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CONSULTA_DE_ACADEMIAS } from '../cadastro/academias/@academias-application.model';
import { REPOSITORIO_DE_ACADEMIAS } from '../cadastro/academias/@academias-domain.model';
import { AcademiasFirebaseService } from '../cadastro/academias/@academias-firebase.service';
import { REPOSITORIO_DE_APARELHOS } from '../cadastro/aparelhos/@aparelhos-domain.model';
import { AparelhosFirebaseService } from '../cadastro/aparelhos/@aparelhos-firebase.service';
import { CONSULTA_DE_EXERCICIOS } from '../cadastro/exercicios/@exercicios-application.model';
import { REPOSITORIO_DE_EXERCICIOS } from '../cadastro/exercicios/@exercicios-domain.model';
import { ExerciciosFirebaseService } from '../cadastro/exercicios/@exercicios-firebase.service';
import { AppCommonModule } from '../common/common.module';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { CADASTRO_DE_MEDIDAS } from './medidas-cadastro/@medidas-cadastro-application.model';
import { MedidasCadastroService } from './medidas-cadastro/@medidas-cadastro.service';
import { MedidasCadastroComponent } from './medidas-cadastro/medidas-cadastro.component';
import { CONSULTA_DE_MEDIDAS } from './medidas/@medidas-application.model';
import { REPOSITORIO_DE_MEDIDAS } from './medidas/@medidas-domain.model';
import { MedidasFirebaseService } from './medidas/@medidas-firebase.service';
import { MedidasComponent } from './medidas/medidas.component';
import { MonstrosMaterialModule } from './monstros-material.module';
import { MonstrosRoutingModule } from './monstros-routing.module';
import { MonstrosComponent } from './monstros.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CADASTRO_DE_RANKINGS } from './rankings-cadastro/@rankings-cadastro-application.model';
import { RankingsCadastroService } from './rankings-cadastro/@rankings-cadastro.service';
import { RankingsCadastroComponent } from './rankings-cadastro/rankings-cadastro.component';
import { PARTICIPACAO_DE_RANKINGS } from './rankings-participacao/@rankings-participacao-application.model';
import { RankingsParticipacaoService } from './rankings-participacao/@rankings-participacao.service';
import { RankingsParticipacaoComponent } from './rankings-participacao/rankings-participacao.component';
import { CONSULTA_DE_RANKINGS } from './rankings/@rankings-application.model';
import { REPOSITORIO_DE_RANKINGS } from './rankings/@rankings-domain.model';
import { RankingsFirebaseService } from './rankings/@rankings-firebase.service';
import { AssiduidadeComponent } from './rankings/assiduidade/assiduidade.component';
import { FiltroComponent as FiltroDoRanking } from './rankings/filtro/filtro.component';
import { PosicaoComponent } from './rankings/posicao/posicao.component';
import { RankingsItemComponent } from './rankings/rankings-item.component';
import { RankingsParticipantesComponent } from './rankings/rankings-participantes.component';
import { RankingsComponent } from './rankings/rankings.component';
import { CADASTRO_DE_SERIES } from './series-cadastro/@series-cadastro-application.model';
import { SeriesCadastroService } from './series-cadastro/@series-cadastro.service';
import { SeriesCadastroExercicioComponent } from './series-cadastro/series-cadastro-exercicio.component';
import { SeriesCadastroComponent } from './series-cadastro/series-cadastro.component';
import { EXECUCAO_DE_SERIES } from './series-execucao/@series-execucao-application.model';
import { SeriesExecucaoService } from './series-execucao/@series-execucao.service';
import { SeriesExecucaoExercicioComponent } from './series-execucao/series-execucao-exercicio.component';
import { SeriesExecucaoComponent } from './series-execucao/series-execucao.component';
import { CONSULTA_DE_SERIES } from './series/@series-application.model';
import { REPOSITORIO_DE_SERIES } from './series/@series-domain.model';
import { SeriesFirebaseService } from './series/@series-firebase.service';
import { CONSULTA_DE_EXECUCOES_DE_SERIES } from './series/execucoes/@execucoes-application.model';
import { REPOSITORIO_DE_EXECUCOES_DE_SERIES } from './series/execucoes/@execucoes-domain.model';
import { ExecucoesFirebaseService } from './series/execucoes/@execucoes-firebase.service';
import { ExecucoesItemComponent as ExecucoesDeSerieItemComponent } from './series/execucoes/execucoes-item.component';
import { ExecucoesComponent as ExecucoesDeSerieComponent } from './series/execucoes/execucoes.component';
import { ExecucoesExerciciosComponent } from './series/execucoes/execucoes-exercicios.component';
import { SeriesExecucoesWidgetComponent } from './series/series-execucoes-widget.component';
import { SeriesExerciciosComponent } from './series/series-exercicios.component';
import { SeriesItemComponent } from './series/series-item.component';
import { SeriesComponent } from './series/series.component';
import { TreinosComponent } from './treinos/treinos.component';

@NgModule({
  declarations: [
    MonstrosComponent,
    PerfilComponent,
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
    SeriesExecucoesWidgetComponent,
    SeriesExecucaoComponent,
    SeriesExecucaoExercicioComponent,
    ExecucoesExerciciosComponent,
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
    AcademiasFirebaseService,
    { provide: REPOSITORIO_DE_ACADEMIAS, useClass: AcademiasFirebaseService },
    { provide: CONSULTA_DE_ACADEMIAS, useClass: AcademiasFirebaseService },
    //
    ExerciciosFirebaseService,
    { provide: REPOSITORIO_DE_EXERCICIOS, useClass: ExerciciosFirebaseService },
    { provide: CONSULTA_DE_EXERCICIOS, useClass: ExerciciosFirebaseService },
    //
    AparelhosFirebaseService,
    { provide: REPOSITORIO_DE_APARELHOS, useClass: AparelhosFirebaseService },
    //
    // MedidasFirebaseService, // ?
    { provide: REPOSITORIO_DE_MEDIDAS, useClass: MedidasFirebaseService },
    { provide: CONSULTA_DE_MEDIDAS, useClass: MedidasFirebaseService },
    { provide: CADASTRO_DE_MEDIDAS, useClass: MedidasCadastroService },
    //
    { provide: REPOSITORIO_DE_RANKINGS, useClass: RankingsFirebaseService },
    { provide: CONSULTA_DE_RANKINGS, useClass: RankingsFirebaseService },
    { provide: CADASTRO_DE_RANKINGS, useClass: RankingsCadastroService },
    { provide: PARTICIPACAO_DE_RANKINGS, useClass: RankingsParticipacaoService },
    //
    // seriesFirebaseServiceProvider,
    // SeriesFirebaseServiceProvider,
    // { provide: REPOSITORIO_DE_SERIES, useClass: SeriesFirebaseServiceProvider },
    // { provide: CONSULTA_DE_SERIES, useClass: SeriesFirebaseServiceProvider },
    SeriesFirebaseService,
    { provide: REPOSITORIO_DE_SERIES, useClass: SeriesFirebaseService },
    { provide: CONSULTA_DE_SERIES, useClass: SeriesFirebaseService },
    { provide: CADASTRO_DE_SERIES, useClass: SeriesCadastroService },
    //
    { provide: REPOSITORIO_DE_EXECUCOES_DE_SERIES, useClass: ExecucoesFirebaseService },
    { provide: CONSULTA_DE_EXECUCOES_DE_SERIES, useClass: ExecucoesFirebaseService },
    { provide: EXECUCAO_DE_SERIES, useClass: SeriesExecucaoService }
  ]
})
export class MonstrosModule { }
