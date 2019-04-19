import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedidasFirebaseService } from 'src/app/monstros/medidas/@medidas-firebase.service';
import { SelectivePreloadingStrategyService } from 'src/app/common/selective-preloading-strategy.service';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  sessionId: Observable<string>;
  token: Observable<string>;
  modules: string[];

  constructor(
    private route: ActivatedRoute,
    private medidasService: MedidasFirebaseService,
    preloadStrategy: SelectivePreloadingStrategyService
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
