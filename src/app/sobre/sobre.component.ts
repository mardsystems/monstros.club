import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { AtualizacaoAtivada, AtualizacaoDisponivel, CheckForUpdateService, LogUpdateService } from '../@app-common.model';

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

  checkForUpdate() {
    this.updates.checkForUpdate();
  }

  activateUpdate() {
    this.updates.activateUpdate();
  }

  reload() {
    document.location.reload();
  }
}
