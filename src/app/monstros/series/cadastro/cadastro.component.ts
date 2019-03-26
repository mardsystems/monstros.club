import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SeriesService } from '../series.service';
import { CadastroDeSerieViewModel } from './cadastro.presentation-model';

@Component({
  selector: 'monstros-series-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
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
    private dialogRef: MatDialogRef<CadastroComponent>,
    private seriesService: SeriesService,
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
        ? this.seriesService.atualizaSerie(this.model.id, this.model)
        : this.seriesService.cadastraSerie(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
