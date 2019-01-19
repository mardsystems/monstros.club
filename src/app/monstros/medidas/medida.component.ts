import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Medida } from './medidas.model';
import { MedidasService } from './medidas.service';
import * as moment from 'moment';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.scss']
})
export class MedidaComponent implements OnInit {

  dialogTitle = 'Nova Medida';
  medida: Medida = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MedidaComponent>,
    private medidasService: MedidasService
  ) { }

  ngOnInit(): void {
    if (this.data.isNew) {
      this.medida.monstroId = this.data.monstroId;
    } else {
      this.dialogTitle = 'Atualiza Medida';

      this.medida = this.data.medida;
    }
  }

  onDataChange(newdate) {
    console.log(newdate);
    const _ = moment();
    const date = moment(newdate).add({ hours: _.hour(), minutes: _.minute(), seconds: _.second() });
    // this.medida.data = date.toDate();
    console.log({ hours: _.hour(), minutes: _.minute(), seconds: _.second() });
  }

  onSave(): void {
    const operation: Promise<void> =
      (this.data.isNew)
        ? this.medidasService.cadastraMedida(this.medida)
        : this.medidasService.atualizaMedida(this.medida);

    operation
      .then(() => {
        this.dialogRef.close();
      });
  }
}
