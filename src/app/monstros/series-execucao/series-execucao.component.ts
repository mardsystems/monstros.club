import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Academia } from 'src/app/cadastro/academias/academias.domain-model';
import { SeriesService } from '../series/series.service';
import { ExecucaoDeSerieViewModel } from './series-execucao.presentation-model';
import { Observable } from 'rxjs';
import { SeriesExecucaoService } from './series-execucao.service';
import { AcademiasService } from 'src/app/cadastro/academias/academias.service';

@Component({
  selector: 'series-execucao',
  templateUrl: './series-execucao.component.html',
  styleUrls: ['./series-execucao.component.scss']
})
export class SeriesExecucaoComponent implements OnInit {
  dialogTitle = 'Nova Execução';

  academias$: Observable<Academia[]>;

  cadastroForm = this.formBuilder.group({
    dia: [this.model.dia],
    numero: [this.model.numero],
    feitaNaId: [this.model.feitaNaId],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: ExecucaoDeSerieViewModel,
    private dialogRef: MatDialogRef<SeriesExecucaoComponent>,
    private repositorioDeAcademias: AcademiasService,
    private execucaoDeSeries: SeriesExecucaoService,
    private formBuilder: FormBuilder,
  ) {
    this.academias$ = this.repositorioDeAcademias.obtemAcademiasObservaveisParaAdministracao();
  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Série';
    }
  }

  onSave(): void {
    this.model.dia = this.cadastroForm.value.dia;

    this.model.numero = this.cadastroForm.value.numero;

    this.model.feitaNaId = this.cadastroForm.value.feitaNaId;

    // const operation: Promise<void> =
    //   (this.model.isEdit)
    //     ? this.execucaoDeSeries.atualizaSerie(this.model.id, this.model)
    //     : this.execucaoDeSeries.cadastraSerie(this.model);

    // operation.then(() => {
    //   this.dialogRef.close();
    // });
  }
}
