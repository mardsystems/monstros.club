import { Component, OnInit } from '@angular/core';
import { LogUpdateService, CheckForUpdateService } from '../app.services';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.scss']
})
export class SobreComponent implements OnInit {

  constructor(
    private logUpdateService: LogUpdateService,
    private checkForUpdateService: CheckForUpdateService,
    private updates: SwUpdate,
  ) {
    updates.available.subscribe(event => {

    });
  }

  ngOnInit() {
  }

  update() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
