import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { SeriesCadastroExercicioComponent } from '../series-cadastro/series-cadastro-exercicio.component';
import { ExecucaoDeSeries, EXECUCAO_DE_SERIES } from '../series-execucao/@series-execucao-application.model';
import { ExecucaoDeSerieViewModel } from '../series-execucao/@series-execucao-presentation.model';
import { Serie } from './@series-domain.model';
import { ConsultaDeExecucoesDeSeries, CONSULTA_DE_EXECUCOES_DE_SERIES } from './execucoes/@execucoes-application.model';
import { ExecucaoDeSerie, RepositorioDeExecucoesDeSeries, REPOSITORIO_DE_EXECUCOES_DE_SERIES } from './execucoes/@execucoes-domain.model';

@Component({
  selector: 'series-execucoes-widget',
  templateUrl: './series-execucoes-widget.component.html',
  styleUrls: ['./series-execucoes-widget.component.scss']
})
export class SeriesExecucoesWidgetComponent implements OnInit {
  @Input() monstro: Monstro;

  @Input() serie: Serie;

  @Input() disabledWrite: boolean;

  execucoes$: Observable<ExecucaoDeSerie[]>;

  constructor(
    private dialog: MatDialog,
    @Inject(CONSULTA_DE_EXECUCOES_DE_SERIES)
    private consultaDeExecucoesDeSeries: ConsultaDeExecucoesDeSeries,
    @Inject(REPOSITORIO_DE_EXECUCOES_DE_SERIES)
    private repositorioDeExecucoesDeSeries: RepositorioDeExecucoesDeSeries,
    @Inject(EXECUCAO_DE_SERIES)
    private execucaoDeSeries: ExecucaoDeSeries,
  ) {

  }

  ngOnInit() {
    this.execucoes$ = this.consultaDeExecucoesDeSeries.obtemExecucoesDeSerieParaExibicao(this.monstro.id, this.serie.id);
  }

  async onAdd(): Promise<void> {
    const model = await ExecucaoDeSerieViewModel.toViewModel(null, this.serie, this.repositorioDeExecucoesDeSeries);

    const config: MatDialogConfig<ExecucaoDeSerieViewModel> = { data: model };

    this.dialog.open(SeriesCadastroExercicioComponent, config);
  }

  onEdit(execucaoDeSerie: ExecucaoDeSerie): void {
    // const model = ExecucaoDeSerieViewModel.toEditViewModel(this.monstroId, this.serie, execucaoDeSerie);

    // const config: MatDialogConfig<ExecucaoDeSerieViewModel> = { data: model };

    // this.dialog.open(SeriesCadastroExercicioComponent, config);
  }

  onDelete(execucaoDeSerie: ExecucaoDeSerie): void {
    this.execucaoDeSeries.apagaExecucao(this.monstro.id, this.serie.id, execucaoDeSerie.id);
  }
}
