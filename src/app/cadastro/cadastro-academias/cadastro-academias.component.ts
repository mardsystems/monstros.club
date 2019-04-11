import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CadastroDeAcademiaViewModel } from './cadastro-academias.presentation-model';
import { CadastroAcademiasService } from './cadastro-academias.service';

@Component({
  selector: 'cadastro-academias',
  templateUrl: './cadastro-academias.component.html',
  styleUrls: ['./cadastro-academias.component.scss']
})
export class CadastroAcademiasComponent implements OnInit {
  dialogTitle = 'Nova Academia';
  cadastroForm = this.formBuilder.group({
    nome: [this.model.nome],
    logoURL: [this.model.logoURL],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeAcademiaViewModel,
    private dialogRef: MatDialogRef<CadastroAcademiasComponent>,
    private cadastroDeAcademias: CadastroAcademiasService,
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
