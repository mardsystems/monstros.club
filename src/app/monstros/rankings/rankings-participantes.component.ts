import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RankingsParticipacaoComponent } from '../rankings-participacao/rankings-participacao.component';
import { ParticipacaoViewModel } from '../rankings-participacao/@rankings-participacao-presentation.model';
import { RankingsParticipacaoService } from '../rankings-participacao/@rankings-participacao.service';
import { Participacao, Ranking } from './@rankings-domain.model';

@Component({
  selector: 'rankings-participantes',
  templateUrl: './rankings-participantes.component.html',
  styleUrls: ['./rankings-participantes.component.scss']
})
export class RankingsParticipantesComponent implements OnInit {
  @Input() ranking: Ranking;

  @Input() disabledWrite: boolean;

  constructor(
    private dialog: MatDialog,
    private participacaoDeRankings: RankingsParticipacaoService
  ) { }

  ngOnInit() {
  }

  onAdd(): void {
    const model = ParticipacaoViewModel.toViewModel(this.ranking);

    const config: MatDialogConfig<ParticipacaoViewModel> = { data: model };

    this.dialog.open(RankingsParticipacaoComponent, config);
  }

  onDelete(participacao: Participacao): void {
    this.participacaoDeRankings.removeParticipante(this.ranking.id, participacao.participante.id);
  }
}
