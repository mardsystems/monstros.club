import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AcademiasService } from '../academias.service';
import { CadastroDeAcademiaViewModel } from './cadastro.presentation-model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  dialogTitle = 'Nova Academia';
  cadastroForm = this.formBuilder.group({
    nome: [this.model.nome],
    logo: [this.model.logo],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeAcademiaViewModel,
    private dialogRef: MatDialogRef<CadastroComponent>,
    private academiasService: AcademiasService,
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Academia';
    }
  }

  onSave(): void {
    this.model.nome = this.cadastroForm.value.nome;

    this.model.logo = this.cadastroForm.value.logo;

    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.academiasService.atualizaAcademia(this.model.id, this.model)
        : this.academiasService.cadastraAcademia(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
