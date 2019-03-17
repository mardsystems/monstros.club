import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AparelhosService } from '../aparelhos.service';
import { CadastroDeAparelhoViewModel } from './cadastro.presentation-model';
import { Observable } from 'rxjs';
import { Academia } from '../../academias/academias.domain-model';
import { AcademiasService } from '../../academias/academias.service';
import { Exercicio } from '../../exercicios/exercicios.domain-model';
import { ExerciciosService } from '../../exercicios/exercicios.service';

@Component({
  selector: 'cadastro-de-aparelho',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  dialogTitle = 'Novo Aparelho';

  academias$: Observable<Academia[]>;

  exercicios$: Observable<Exercicio[]>;

  cadastroForm = this.formBuilder.group({
    codigo: [this.model.codigo],
    academia: [this.model.academia],
    exercicios: [this.model.exercicios],
    imagemURL: [this.model.imagemURL],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeAparelhoViewModel,
    private dialogRef: MatDialogRef<CadastroComponent>,
    private aparelhosService: AparelhosService,
    private academiasService: AcademiasService,
    private exerciciosService: ExerciciosService,
    private formBuilder: FormBuilder,
  ) {
    this.academias$ = this.academiasService.obtemAcademiasObservaveisParaAdministracao(); // TODO: Exibição.

    this.exercicios$ = this.exerciciosService.obtemExerciciosObservaveisParaAdministracao(); // TODO: Exibição.
  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Aparelho';
    }
  }

  onSave(): void {
    this.model.codigo = this.cadastroForm.value.codigo;

    this.model.academia = this.cadastroForm.value.academia;

    this.model.exercicios = this.cadastroForm.value.exercicios;

    this.model.imagemURL = this.cadastroForm.value.imagemURL;

    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.aparelhosService.atualizaAparelho(this.model.id, this.model)
        : this.aparelhosService.cadastraAparelho(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
