import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RankingViewModel } from './@rankings-cadastro-presentation.model';
import { RankingsCadastroService } from './@rankings-cadastro.service';

@Component({
  selector: 'rankings-cadastro',
  templateUrl: './rankings-cadastro.component.html',
  styleUrls: ['./rankings-cadastro.component.scss']
})
export class RankingsCadastroComponent implements OnInit {
  dialogTitle = 'Novo Ranking';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: RankingViewModel,
    private dialogRef: MatDialogRef<RankingsCadastroComponent>,
    private cadastroDeRankings: RankingsCadastroService
  ) { }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Ranking';
    }
  }

  onSave(): void {
    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.cadastroDeRankings.atualizaRanking(this.model.id, this.model)
        : this.cadastroDeRankings.cadastraRanking(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
