import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CadastroDeSerieViewModel } from './@series-cadastro-presentation.model';
import { CadastroDeSeries, CADASTRO_DE_SERIES } from './@series-cadastro-application.model';
import { SeriesCadastroService } from './@series-cadastro.service';

@Component({
  selector: 'series-cadastro',
  templateUrl: './series-cadastro.component.html',
  styleUrls: ['./series-cadastro.component.scss']
})
export class SeriesCadastroComponent implements OnInit {
  dialogTitle = 'Nova Série';

  cadastroForm = this.formBuilder.group({
    nome: [this.model.nome],
    cor: [this.model.cor],
    ativa: [this.model.ativa],
    data: [this.model.data],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeSerieViewModel,
    private dialogRef: MatDialogRef<SeriesCadastroComponent>,
    // @Inject(CADASTRO_DE_SERIES)
    private cadastroDeSeries: SeriesCadastroService, // CadastroDeSeries
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Série';
    }
  }

  onSave(): void {
    this.model.nome = this.cadastroForm.value.nome;

    this.model.cor = this.cadastroForm.value.cor;

    this.model.ativa = this.cadastroForm.value.ativa;

    this.model.data = this.cadastroForm.value.data;

    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.cadastroDeSeries.atualizaSerie(this.model.id, this.model)
        : this.cadastroDeSeries.cadastraSerie(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
