import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Medida } from './medidas.model';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { MedidasService } from './medidas.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { MedidaComponent } from './medida.component';
import { MediaMatcher } from '@angular/cdk/layout';

import { SelectivePreloadingStrategyService } from '../../selective-preloading-strategy.service';

const columnDefinitions = [
  { def: 'col1', showMobile: true },
  { def: 'col2', showMobile: false },
];

@Component({
  selector: 'app-medidas',
  templateUrl: './medidas.component.html',
  styleUrls: ['./medidas.component.scss']
})
export class MedidasComponent implements OnInit {
  medidas$: Observable<Medida[]>;
  // medidaSelecionada: Medida;
  loading = true;
  fullDisplayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'gorduraVisceral', 'musculo',
    'idadeCorporal', 'metabolismoBasal', 'indiceDeMassaCorporal', 'menu'];
  minimalDisplayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'musculo', 'idadeCorporal', 'indiceDeMassaCorporal', 'menu'];
  displayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'musculo', 'idadeCorporal', 'indiceDeMassaCorporal', 'menu'];
  dataSource: any;

  sessionId: Observable<string>;
  token: Observable<string>;
  modules: string[];

  @ViewChild(MatSort) sort: MatSort;

  mobileQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private preloadStrategy: SelectivePreloadingStrategyService,
    private router: Router,
    private medidasService: MedidasService,
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.modules = preloadStrategy.preloadedModules;

    this.authService.user.subscribe((user) => {
      // this.monstroId = `monstros/${user.id}`;

      // this.medidas.valueChanges();
    });
  }

  private _mobileQueryListener(ev: MediaQueryListEvent) {
    // if (ev.matches) {
    //   this.fullDisplayedColumns.forEach(element => {
    //     this.displayedColumns.push(element);
    //   });
    // } else {
    //   this.minimalDisplayedColumns.forEach(element => {
    //     this.displayedColumns.push(element);
    //   });
    // }
  }

  ngOnInit() {
    this.medidas$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.medidasService.obtemMedidasObservaveisParaExibicao(params.get('monstroId'))
      ));

    // this.medidas$ = this.medidasService.obtemMedidas();

    // this.dataSource = new MatTableDataSource(this.medidas$);

    // this.dataSource.sort = this.sort;

    this.medidas$
      .pipe(take(1))
      .subscribe(() => this.loading = false);

    // Capture the session ID if available
    this.sessionId = this.route
      .queryParamMap
      .pipe(map(params => params.get('session_id') || 'None'));

    // Capture the fragment if available
    this.token = this.route
      .fragment
      .pipe(map(fragment => fragment || 'None'));
  }

  getFoto(monstroId: string): string {
    return monstroId.replace('monstros/', '');
  }

  getGorduraVisceral2(gorduraVisceral: number): string {
    let gorduraVisceral2: number;

    if (gorduraVisceral > 14) {
      gorduraVisceral2 = +2;
    } else if (gorduraVisceral < 10) {
      gorduraVisceral2 = 0;
    } else {
      gorduraVisceral2 = +1;
    }

    switch (gorduraVisceral2) {
      case 0:
        return '<span class="hint normal">&#10003;</span>';
      case +1:
        return '<span class="hint bad">&#43;</span>';
      case +2:
        return '<span class="hint bad">&#43;&#43;</span>';
    }
  }

  getIMC2(imc: number): string {
    let imc2: number;

    if (imc < 18.5) {
      imc2 = -1;
    } else if (imc >= 30) {
      imc2 = +2;
    } else if (imc >= 25) {
      imc2 = +1;
    } else {
      imc2 = 0;
    }

    switch (imc2) {
      case -1:
        return '<span class="hint good">&#8722;</span>';
      case 0:
        return '<span class="hint normal">&#10003;</span>';
      case +1:
        return '<span class="hint bad">&#43;</span>';
      case +2:
        return '<span class="hint bad">&#43;&#43;</span>';
    }
  }

  getDisplayedColumns(): string[] {
    const isMobile = this.isMobile();

    if (isMobile) {
      return this.minimalDisplayedColumns;
    } else {
      return this.fullDisplayedColumns;
    }

    // return this.columnDefinitions
    //   .filter(cd => !isMobile || cd.showMobile)
    //   .map(cd => cd.def);
  }

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }
  // novaMedida(): void {
  //   const medida: Medida = {

  //   };

  //   medida.monstroId = 'monstros/vQeCUnaAWmzr2YxP5wB1';
  //   medida.data = new Date();
  //   medida.peso = 0;
  //   medida.gordura = 0;
  //   medida.gorduraVisceral = 0;
  //   medida.musculo = 0;
  //   medida.idadeCorporal = 0;
  //   medida.metabolismoBasal = 0;
  //   medida.indiceDeMassaCorporal = 0;

  //   this.medidasService.cadastraMedida(medida);
  // }

  atualizaMedida(medida: Medida): void {
    // task.done = !task.done;
    this.medidasService.atualizaMedida(medida);
  }

  showDialog(medida?: Medida): void {
    const config: MatDialogConfig<any> = (medida) ? { data: { medida } } : null;
    this.dialog.open(MedidaComponent, config);
  }

  onDelete(medida: Medida): void {
    this.medidasService.excluiMedida(medida);
  }
}
