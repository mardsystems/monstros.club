import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CadastroDeExercicioViewModel } from './cadastro-exercicios.presentation-model';
import { CadastroExerciciosService } from './cadastro-exercicios.service';

@Component({
  selector: 'cadastro-exercicios',
  templateUrl: './cadastro-exercicios.component.html',
  styleUrls: ['./cadastro-exercicios.component.scss']
})
export class CadastroExerciciosComponent implements OnInit {
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
    private dialogRef: MatDialogRef<CadastroExerciciosComponent>,
    private repositorioDeExercicios: CadastroExerciciosService,
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
        ? this.repositorioDeExercicios.atualizaExercicio(this.model.id, this.model)
        : this.repositorioDeExercicios.cadastraExercicio(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
