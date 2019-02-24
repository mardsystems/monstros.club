import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ParticipacaoComponent } from './cadastro/participacao.component';
import { ParticipacaoViewModel } from './cadastro/participacao.presentation-model';
import { Ranking, Participacao } from './rankings.domain-model';
import { RankingsService } from './rankings.service';

@Component({
  selector: 'monstros-rankings-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.scss']
})
export class ParticipantesComponent implements OnInit {
  @Input() ranking: Ranking;

  @Input() disabledWrite: boolean;

  constructor(
    private dialog: MatDialog,
    private rankingsService: RankingsService
  ) { }

  ngOnInit() {
  }

  onAdd(): void {
    const model = ParticipacaoViewModel.toViewModel(this.ranking);

    const config: MatDialogConfig<ParticipacaoViewModel> = { data: model };

    this.dialog.open(ParticipacaoComponent, config);
  }

  onDelete(participacao: Participacao): void {
    this.rankingsService.removeParticipante(this.ranking.id, participacao.participante.id);
  }
}
