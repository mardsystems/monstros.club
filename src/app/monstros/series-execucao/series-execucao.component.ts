import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExecucaoDeSerieViewModel } from './@series-execucao-presentation.model';
import { Observable } from 'rxjs';
import { SeriesExecucaoService } from './@series-execucao.service';
import { Academia } from 'src/app/cadastro/academias/@academias-domain.model';
import { ConsultaDeAcademias } from 'src/app/cadastro/academias/@academias-application.model';

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
    private consultaDeAcademias: ConsultaDeAcademias,
    private execucaoDeSeries: SeriesExecucaoService,
    private formBuilder: FormBuilder,
  ) {
    this.academias$ = this.consultaDeAcademias.obtemAcademiasParaAdministracao();
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

    const operation: Promise<void> = this.execucaoDeSeries.iniciaExecucao(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
