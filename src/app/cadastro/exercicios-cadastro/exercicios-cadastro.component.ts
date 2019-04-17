import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CadastroDeExercicioViewModel } from './exercicios-cadastro-@presentation.model';
import { CADASTRO_DE_EXERCICIOS, CadastroDeExercicios } from './exercicios-cadastro-@application.model';

@Component({
  selector: 'exercicios-cadastro',
  templateUrl: './exercicios-cadastro.component.html',
  styleUrls: ['./exercicios-cadastro.component.scss']
})
export class ExerciciosCadastroComponent implements OnInit {
  dialogTitle = 'Novo Exercício';
  cadastroForm = this.formBuilder.group({
    codigo: [this.model.codigo],
    nome: [this.model.nome],
    musculatura: [this.model.musculatura],
    imagemURL: [this.model.imagemURL],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeExercicioViewModel,
    private dialogRef: MatDialogRef<ExerciciosCadastroComponent>,
    @Inject(CADASTRO_DE_EXERCICIOS)
    private cadastroDeExercicios: CadastroDeExercicios,
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Exercício';
    }
  }

  onSave(): void {
    this.model.codigo = this.cadastroForm.value.codigo;

    this.model.nome = this.cadastroForm.value.nome;

    this.model.musculatura = this.cadastroForm.value.musculatura;

    this.model.imagemURL = this.cadastroForm.value.imagemURL;

    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.cadastroDeExercicios.atualizaExercicio(this.model.id, this.model)
        : this.cadastroDeExercicios.cadastraExercicio(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
