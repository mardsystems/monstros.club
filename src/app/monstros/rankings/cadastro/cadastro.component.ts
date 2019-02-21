import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RankingsService } from '../rankings.service';
import { RankingViewModel } from './cadastro.presentation-model';

@Component({
  selector: 'monstros-rankings-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  dialogTitle = 'Novo Ranking';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: RankingViewModel,
    private dialogRef: MatDialogRef<CadastroComponent>,
    private medidasService: RankingsService
  ) { }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Ranking';
    }
  }

  onSave(): void {
    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.medidasService.atualizaRanking(this.model.id, this.model)
        : this.medidasService.cadastraRanking(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
