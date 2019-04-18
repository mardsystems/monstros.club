import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RankingsFirebaseService } from '../@rankings-firebase.service';
// import { RankingViewModel } from './cadastro.presentation-model';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})
export class FiltroComponent implements OnInit {
  dialogTitle = 'Filtro';
  desde: Date;
  ate: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: any,
    private dialogRef: MatDialogRef<FiltroComponent>,
    // private medidasService: RankingsService
  ) { }

  ngOnInit(): void {
    this.desde = new Date(Date.now());

    this.ate = new Date(Date.now());

    // if (this.model.isEdit) {
    //   this.dialogTitle = 'Atualiza Ranking';
    // }
  }

  onFilter(): void {
    this.dialogRef.close();

    // const operation: Promise<void> =
    //   (this.model.isEdit)
    //     ? this.medidasService.atualizaRanking(this.model.id, this.model)
    //     : this.medidasService.cadastraRanking(this.model);

    // operation.then(() => {
    //   this.dialogRef.close();
    // });
  }
}
