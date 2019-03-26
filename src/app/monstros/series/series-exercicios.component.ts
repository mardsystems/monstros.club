import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Serie, SerieDeExercicio } from './series.domain-model';
import { SeriesService } from './series.service';
import { CadastroDeExercicioViewModel } from './cadastro/cadastro.presentation-model';
import { CadastroExercicioComponent } from './cadastro/cadastro-exercicio.component';
import { Monstro } from '../monstros.domain-model';

@Component({
  selector: 'series-exercicios',
  templateUrl: './series-exercicios.component.html',
  styleUrls: ['./series-exercicios.component.scss']
})
export class SeriesExerciciosComponent {
  @Input() monstro: Monstro;

  @Input() serie: Serie;

  @Input() disabledWrite: boolean;

  constructor(
    private dialog: MatDialog,
    private seriesService: SeriesService
  ) { }

  onAdd(): void {
    const model = CadastroDeExercicioViewModel.toAddViewModel(this.monstro, this.serie);

    const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    this.dialog.open(CadastroExercicioComponent, config);
  }

  onEdit(serieDeExercicio: SerieDeExercicio): void {
    const model = CadastroDeExercicioViewModel.toEditViewModel(this.monstro, this.serie, serieDeExercicio);

    const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    this.dialog.open(CadastroExercicioComponent, config);
  }

  onDelete(serieDeExercicio: SerieDeExercicio): void {
    this.seriesService.removeExercicio(this.monstro.id, this.serie.id, serieDeExercicio.id);
  }
}
