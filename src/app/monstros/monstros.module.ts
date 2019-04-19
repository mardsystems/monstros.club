import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
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
import { RankingsCadastroComponent } from './rankings-cadastro/rankings-cadastro.component';
import { RankingsParticipacaoComponent } from './rankings-participacao/rankings-participacao.component';
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
import { REPOSITORIO_DE_SERIES } from './series/@series-domain.model';
import { SeriesFirebaseService } from './series/@series-firebase.service';
import { ExecucoesItemComponent as ExecucoesDeSerieItemComponent } from './series/execucoes/execucoes-item.component';
import { ExecucoesComponent as ExecucoesDeSerieComponent } from './series/execucoes/execucoes.component';
import { SeriesExecucoesComponent } from './series/series-execucoes.component';
import { SeriesExerciciosComponent } from './series/series-exercicios.component';
import { SeriesItemComponent } from './series/series-item.component';
import { SeriesComponent } from './series/series.component';
import { TreinosComponent } from './treinos/treinos.component';
import { CONSULTA_DE_SERIES } from './series/@series-application.model';

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
    ExerciciosFirebaseService,
    { provide: REPOSITORIO_DE_EXERCICIOS, useClass: ExerciciosFirebaseService },
    // MedidasFirebaseService, // ?
    { provide: REPOSITORIO_DE_MEDIDAS, useClass: MedidasFirebaseService },
    { provide: CONSULTA_DE_MEDIDAS, useClass: MedidasFirebaseService },
    { provide: CADASTRO_DE_MEDIDAS, useClass: MedidasCadastroService },
    SeriesFirebaseService,
    { provide: REPOSITORIO_DE_SERIES, useClass: SeriesFirebaseService },
    { provide: CONSULTA_DE_SERIES, useClass: SeriesFirebaseService },
    { provide: CADASTRO_DE_SERIES, useClass: SeriesCadastroService },
    { provide: EXECUCAO_DE_SERIES, useClass: SeriesExecucaoService }
  ]
})
export class MonstrosModule { }
