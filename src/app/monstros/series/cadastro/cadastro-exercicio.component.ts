import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SeriesService } from '../series.service';
import { ExerciciosService } from 'src/app/cadastro/exercicios/exercicios.service';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Exercicio } from 'src/app/cadastro/exercicios/exercicios.domain-model';
import { CadastroDeExercicioViewModel } from './cadastro.presentation-model';

@Component({
  selector: 'monstros-series-cadastro-exercicio',
  templateUrl: './cadastro-exercicio.component.html',
  styleUrls: ['./cadastro-exercicio.component.scss']
})
export class CadastroExercicioComponent implements OnInit {
  dialogTitle = 'Nova Série de Exercício';

  exercicios$: Observable<Exercicio[]>;

  cadastroForm = this.formBuilder.group({
    exercicioId: [this.model.exercicioId],
    quantidade: [this.model.quantidade],
    repeticoes: [this.model.repeticoes],
    carga: [this.model.carga],
    assento: [this.model.assento],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeExercicioViewModel,
    private dialogRef: MatDialogRef<CadastroExercicioComponent>,
    private seriesService: SeriesService,
    private exerciciosService: ExerciciosService,
    private formBuilder: FormBuilder,
  ) {
    this.exercicios$ = this.exerciciosService.obtemExerciciosObservaveisParaAdministracao(); // TODO: Exibição.
  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Série de Exercício';
    }
  }

  onSave(): void {
    this.model.exercicioId = this.cadastroForm.value.exercicioId;

    this.model.quantidade = this.cadastroForm.value.quantidade;

    this.model.repeticoes = this.cadastroForm.value.repeticoes;

    this.model.carga = this.cadastroForm.value.carga;

    this.model.assento = this.cadastroForm.value.assento;

    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.seriesService.atualizaExercicio(this.model.serie.id, this.model)
        : this.seriesService.adicionaExercicio(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}