import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExerciciosService } from '../exercicios.service';
import { CadastroDeExercicioViewModel } from './cadastro.presentation-model';

@Component({
  selector: 'cadastro-de-exercicio',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  dialogTitle = 'Novo Exercício';
  cadastroForm = this.formBuilder.group({
    nome: [this.model.nome],
    musculatura: [this.model.musculatura],
    imagemURL: [this.model.imagemURL],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeExercicioViewModel,
    private dialogRef: MatDialogRef<CadastroComponent>,
    private exerciciosService: ExerciciosService,
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Exercício';
    }
  }

  onSave(): void {
    this.model.nome = this.cadastroForm.value.nome;

    this.model.musculatura = this.cadastroForm.value.musculatura;

    this.model.imagemURL = this.cadastroForm.value.imagemURL;

    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.exerciciosService.atualizaExercicio(this.model.id, this.model)
        : this.exerciciosService.cadastraExercicio(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
