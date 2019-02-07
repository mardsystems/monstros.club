import { Component, OnInit } from '@angular/core';
import { LogUpdateService, CheckForUpdateService, AtualizacaoDisponivel, AtualizacaoAtivada } from '../app.services';
import { SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.scss']
})
export class SobreComponent implements OnInit {
  atualizacaoDisponivel$: Observable<AtualizacaoDisponivel>;
  atualizacaoAtivada$: Observable<AtualizacaoAtivada>;

  constructor(
    private logUpdateService: LogUpdateService,
    private checkForUpdateService: CheckForUpdateService,
    private updates: SwUpdate,
  ) {
    this.atualizacaoDisponivel$ = logUpdateService.atualizacaoDisponivel$;

    this.atualizacaoAtivada$ = logUpdateService.atualizacaoAtivada$;
  }

  ngOnInit() {
  }

  update() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
