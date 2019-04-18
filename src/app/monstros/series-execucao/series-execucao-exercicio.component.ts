import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { ConsultaDeExercicios, CONSULTA_DE_EXERCICIOS } from 'src/app/cadastro/exercicios/@exercicios-application.model';
import { Exercicio } from 'src/app/cadastro/exercicios/@exercicios-domain.model';
import { ExecucaoDeSeries, EXECUCAO_DE_SERIES } from './@series-execucao-application.model';
import { ExecucaoDeExercicioViewModel } from './@series-execucao-presentation.model';

@Component({
  selector: 'series-execucao-exercicio',
  templateUrl: './series-execucao-exercicio.component.html',
  styleUrls: ['./series-execucao-exercicio.component.scss']
})
export class SeriesExecucaoExercicioComponent implements OnInit {
  dialogTitle = 'Nova Série de Exercício';

  exercicios$: Observable<Exercicio[]>;

  cadastroForm = this.formBuilder.group({
    sequencia: [this.model.sequencia],
    exercicioId: [this.model.exercicioId],
    quantidade: [this.model.quantidade],
    repeticoes: [this.model.repeticoes],
    carga: [this.model.carga],
    nota: [this.model.nota],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: ExecucaoDeExercicioViewModel,
    private dialogRef: MatDialogRef<SeriesExecucaoExercicioComponent>,
    @Inject(EXECUCAO_DE_SERIES)
    private execucaoDeSeries: ExecucaoDeSeries,
    @Inject(CONSULTA_DE_EXERCICIOS)
    private consultaDeExercicios: ConsultaDeExercicios,
    private formBuilder: FormBuilder,
  ) {
    this.exercicios$ = this.consultaDeExercicios.obtemExerciciosParaAdministracao(); // TODO: Exibição.
  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Série de Exercício';
    }
  }

  onSave(): void {
    this.model.sequencia = this.cadastroForm.value.sequencia;

    this.model.exercicioId = this.cadastroForm.value.exercicioId;

    this.model.quantidade = this.cadastroForm.value.quantidade;

    this.model.repeticoes = this.cadastroForm.value.repeticoes;

    this.model.carga = this.cadastroForm.value.carga;

    this.model.nota = this.cadastroForm.value.nota;

    // const operation: Promise<void> =
    //   (this.model.isEdit)
    //     ? this.execucaoDeSeries.atualizaExercicio(this.model.id, this.model)
    //     : this.execucaoDeSeries.iniciaExecucao(this.model);

    // operation.then(() => {
    //   this.dialogRef.close();
    // });
  }
}
