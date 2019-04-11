import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ParticipacaoViewModel } from './rankings-participacao.presentation-model';
import { RankingsParticipacaoService } from './rankings-participacao.service';

@Component({
  selector: 'rankings-participacao',
  templateUrl: './rankings-participacao.component.html',
  styleUrls: ['./rankings-participacao.component.scss']
})
export class RankingsParticipacaoComponent implements OnInit {
  dialogTitle = 'Nova Participação';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: ParticipacaoViewModel,
    private dialogRef: MatDialogRef<RankingsParticipacaoComponent>,
    private participacaoDeRankings: RankingsParticipacaoService
  ) { }

  ngOnInit(): void {
  }

  onSave(): void {
    const operation: Promise<void> =
      this.participacaoDeRankings.convidaParticipante(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
