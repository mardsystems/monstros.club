import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CadastroDeAcademias, CADASTRO_DE_ACADEMIAS } from './academias-cadastro-@application.model';
import { CadastroDeAcademiaViewModel } from './academias-cadastro-@presentation.model';

@Component({
  selector: 'academias-cadastro',
  templateUrl: './academias-cadastro.component.html',
  styleUrls: ['./academias-cadastro.component.scss']
})
export class AcademiasCadastroComponent implements OnInit {
  dialogTitle = 'Nova Academia';
  cadastroForm = this.formBuilder.group({
    nome: [this.model.nome],
    logoURL: [this.model.logoURL],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeAcademiaViewModel,
    private dialogRef: MatDialogRef<AcademiasCadastroComponent>,
    @Inject(CADASTRO_DE_ACADEMIAS)
    private cadastroDeAcademias: CadastroDeAcademias,
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

    this.model.logoURL = this.cadastroForm.value.logoURL;

    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.cadastroDeAcademias.atualizaAcademia(this.model.id, this.model)
        : this.cadastroDeAcademias.cadastraAcademia(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
