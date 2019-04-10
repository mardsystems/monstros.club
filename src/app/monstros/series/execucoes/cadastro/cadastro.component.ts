import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Academia } from 'src/app/cadastro/academias/academias.domain-model';
import { SeriesService } from '../../series.service';
import { ExecucaoDeSerieViewModel } from './cadastro.presentation-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'monstros-series-execucoes-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  dialogTitle = 'Nova Série';

  academias$: Observable<Academia[]>;

  cadastroForm = this.formBuilder.group({
    dia: [this.model.dia],
    numero: [this.model.numero],
    feitaNa: [this.model.feitaNa],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: ExecucaoDeSerieViewModel,
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
    this.model.dia = this.cadastroForm.value.dia;

    this.model.numero = this.cadastroForm.value.numero;

    this.model.feitaNa = this.cadastroForm.value.feitaNa;

    // const operation: Promise<void> =
    //   (this.model.isEdit)
    //     ? this.seriesService.atualizaSerie(this.model.id, this.model)
    //     : this.seriesService.cadastraSerie(this.model);

    // operation.then(() => {
    //   this.dialogRef.close();
    // });
  }
}
