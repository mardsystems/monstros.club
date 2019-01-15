import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Monstro } from './monstros.model';
import { MonstrosService } from './monstros.service';

@Component({
  selector: 'app-monstro',
  templateUrl: './monstro.component.html',
  styleUrls: ['./monstro.component.scss']
})
export class MonstroComponent implements OnInit {

  dialogTitle = 'Novo Monstro';
  monstro: Monstro;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MonstroComponent>,
    private monstrosService: MonstrosService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.dialogTitle = 'Atualiza Monstro';
      this.monstro = this.data.monstro;
    }
  }

  onSave(): void {
    const operation: Promise<void> =
      (!this.data)
        ? this.monstrosService.atualizaMonstro(this.monstro)
        : this.monstrosService.atualizaMonstro(this.monstro);

    operation
      .then(() => {
        this.dialogRef.close();
      });
  }
}
