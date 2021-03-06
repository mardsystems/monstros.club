import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { Academia } from '../academias/academias.domain-model';
import { AcademiasService } from '../academias/academias.service';
import { Exercicio } from '../exercicios/exercicios.domain-model';
import { ExerciciosService } from '../exercicios/exercicios.service';
import { CadastroDeAparelhoViewModel } from './aparelhos-cadastro.presentation-model';
import { AparelhosCadastroService } from './aparelhos-cadastro.service';

@Component({
  selector: 'aparelhos-cadastro',
  templateUrl: './aparelhos-cadastro.component.html',
  styleUrls: ['./aparelhos-cadastro.component.scss']
})
export class AparelhosCadastroComponent implements OnInit {
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
    private dialogRef: MatDialogRef<AparelhosCadastroComponent>,
    private cadastroDeAparelhos: AparelhosCadastroService,
    private repositorioDeAcademias: AcademiasService,
    private repositorioDeExercicios: ExerciciosService,
    private formBuilder: FormBuilder,
  ) {
    this.academias$ = this.repositorioDeAcademias.obtemAcademiasObservaveisParaAdministracao(); // TODO: Exibição.

    this.exercicios$ = this.repositorioDeExercicios.obtemExerciciosObservaveisParaAdministracao(); // TODO: Exibição.
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
        ? this.cadastroDeAparelhos.atualizaAparelho(this.model.id, this.model)
        : this.cadastroDeAparelhos.cadastraAparelho(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
