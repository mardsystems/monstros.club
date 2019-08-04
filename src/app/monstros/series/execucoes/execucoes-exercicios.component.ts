import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CadastroDeSeries, CADASTRO_DE_SERIES } from '../../series-cadastro/@series-cadastro-application.model';
import { CadastroDeExercicioViewModel } from '../../series-cadastro/@series-cadastro-presentation.model';
import { SeriesCadastroExercicioComponent } from '../../series-cadastro/series-cadastro-exercicio.component';
import { Serie, SerieDeExercicio } from '../@series-domain.model';
import { ExecucaoDeExercicio, ExecucaoDeSerie } from './@execucoes-domain.model';
import { Monstro } from '../../@monstros-domain.model';

@Component({
  selector: 'execucoes-exercicios',
  templateUrl: './execucoes-exercicios.component.html',
  styleUrls: ['./execucoes-exercicios.component.scss']
})
export class ExecucoesExerciciosComponent {
  @Input() monstro: Monstro;

  @Input() serie: Serie;

  @Input() monstroId: string;

  @Input() execucao: ExecucaoDeSerie;

  @Input() disabledWrite: boolean;

  constructor(
    private dialog: MatDialog,
    @Inject(CADASTRO_DE_SERIES)
    private cadastroDeSeries: CadastroDeSeries,
  ) { }

  onAdd(): void {
    // const model = CadastroDeExercicioViewModel.toAddViewModel(this.monstroId, this.execucao);

    // const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    // this.dialog.open(SeriesCadastroExercicioComponent, config);
  }

  onEdit(serieDeExercicio: SerieDeExercicio): void {
    // const model = CadastroDeExercicioViewModel.toEditViewModel(this.monstroId, this.execucao, serieDeExercicio);

    // const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    // this.dialog.open(SeriesCadastroExercicioComponent, config);
  }

  onDelete(serieDeExercicio: SerieDeExercicio): void {
    // this.cadastroDeSeries.removeExercicio(this.monstroId, this.execucao.id, serieDeExercicio.id);
  }
}
