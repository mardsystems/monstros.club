import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SolicitacaoDeCadastroDeMedida } from './medidas.model';
import { MedidasService } from './medidas.service';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.scss']
})
export class MedidaComponent implements OnInit {
  dialogTitle = 'Nova Medida';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: SolicitacaoDeCadastroDeMedida,
    private dialogRef: MatDialogRef<MedidaComponent>,
    private medidasService: MedidasService
  ) { }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Medida';
    }
  }

  onSave(): void {
    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.medidasService.atualizaMedida(this.model.id, this.model)
        : this.medidasService.cadastraMedida(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
