import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Medida, SolicitacaoDeCadastroDeMedida } from './medidas.model';
import { MedidasService } from './medidas.service';
import * as moment from 'moment';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.scss']
})
export class MedidaComponent implements OnInit {
  dialogTitle = 'Nova Medida';

  constructor(
    @Inject(MAT_DIALOG_DATA) private model: SolicitacaoDeCadastroDeMedida,
    private dialogRef: MatDialogRef<MedidaComponent>,
    private medidasService: MedidasService
  ) { }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Medida';
    }
  }

  onDataChange(newdate) {
    console.log(newdate);
    const _ = moment();
    _.locale('pt-BR');
    // const date = new Date(newdate);
    const date = moment(newdate, 'DD/MM/YYYY'); // .add({ hours: _.hour(), minutes: _.minute(), seconds: _.second() });
    console.log(date);
    this.model.data = date.toDate();
    console.log(this.model.data);
  }

  onSave(): void {
    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.medidasService.atualizaMedida(this.model.id, this.model)
        : this.medidasService.cadastraMedida(this.model);

    operation
      .then(() => {
        this.dialogRef.close();
      });
  }
}
