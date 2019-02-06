import { Component, OnInit } from '@angular/core';
import { MedidasService } from '../monstros/medidas/medidas.service';
import { SelectivePreloadingStrategyService } from '../selective-preloading-strategy.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  sessionId: Observable<string>;
  token: Observable<string>;
  modules: string[];

  constructor(
    private route: ActivatedRoute,
    private preloadStrategy: SelectivePreloadingStrategyService,
    private medidasService: MedidasService
  ) {
    this.modules = preloadStrategy.preloadedModules;
  }

  ngOnInit() {
    // Capture the session ID if available
    this.sessionId = this.route.queryParamMap.pipe(
      map(params => params.get('session_id') || 'None')
    );

    // Capture the fragment if available
    this.token = this.route.fragment.pipe(
      map(fragment => fragment || 'None')
    );
  }

  importaMedidas() {
    this.medidasService.importaMedidas();
  }
}
