import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SeriesCadastroExercicioComponent } from '../series-cadastro/series-cadastro-exercicio.component';
import { CadastroDeExercicioViewModel } from '../series-cadastro/series-cadastro.presentation-model';
import { SeriesExecucaoService } from '../series-execucao/series-execucao.service';
import { Serie, SerieDeExercicio } from './series.domain-model';

@Component({
  selector: 'series-execucoes-widget',
  templateUrl: './series-execucoes.component.html',
  styleUrls: ['./series-execucoes.component.scss']
})
export class SeriesExecucoesComponent {
  @Input() monstroId: string;

  @Input() serie: Serie;

  @Input() disabledWrite: boolean;

  constructor(
    private dialog: MatDialog,
    private execucaoDeSeries: SeriesExecucaoService
  ) { }

  onAdd(): void {
    const model = CadastroDeExercicioViewModel.toAddViewModel(this.monstroId, this.serie);

    const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    this.dialog.open(SeriesCadastroExercicioComponent, config);
  }

  onEdit(serieDeExercicio: SerieDeExercicio): void {
    const model = CadastroDeExercicioViewModel.toEditViewModel(this.monstroId, this.serie, serieDeExercicio);

    const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    this.dialog.open(SeriesCadastroExercicioComponent, config);
  }

  onDelete(serieDeExercicio: SerieDeExercicio): void {
    // this.execucaoDeSeries.removeExercicio(this.monstroId, this.serie.id, serieDeExercicio.id);
  }
}
