import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SeriesCadastroExercicioComponent } from '../series-cadastro/series-cadastro-exercicio.component';
import { CadastroDeExercicioViewModel } from '../series-cadastro/@series-cadastro-presentation.model';
import { SeriesCadastroService } from '../series-cadastro/@series-cadastro.service';
import { Serie, SerieDeExercicio } from './series-@domain.model';

@Component({
  selector: 'series-exercicios',
  templateUrl: './series-exercicios.component.html',
  styleUrls: ['./series-exercicios.component.scss']
})
export class SeriesExerciciosComponent {
  @Input() monstroId: string;

  @Input() serie: Serie;

  @Input() disabledWrite: boolean;

  constructor(
    private dialog: MatDialog,
    private cadastroDeSeries: SeriesCadastroService
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
    this.cadastroDeSeries.removeExercicio(this.monstroId, this.serie.id, serieDeExercicio.id);
  }
}
