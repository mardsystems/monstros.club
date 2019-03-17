import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RankingsService } from '../rankings.service';
import { ParticipacaoViewModel } from './participacao.presentation-model';

@Component({
  selector: 'monstros-rankings-cadastro-participacao',
  templateUrl: './participacao.component.html',
  styleUrls: ['./participacao.component.scss']
})
export class ParticipacaoComponent implements OnInit {
  dialogTitle = 'Nova Participação';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: ParticipacaoViewModel,
    private dialogRef: MatDialogRef<ParticipacaoComponent>,
    private rankingsService: RankingsService
  ) { }

  ngOnInit(): void {
  }

  onSave(): void {
    const operation: Promise<void> =
      this.rankingsService.adicionaParticipante(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
