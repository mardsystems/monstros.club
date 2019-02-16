import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, switchMap, catchError } from 'rxjs/operators';
import { Monstro } from '../monstros.model';
import { MonstrosService } from '../monstros.service';
import { MedidaComponent, MedidaViewModel } from './medida.component';
import { Balanca, Medida, OmronHBF214 } from './medidas.model';
import { MedidasService } from './medidas.service';

const columnDefinitions = [
  { showMobile: true, def: 'foto' },
  { showMobile: true, def: 'data' },
  { showMobile: true, def: 'peso' },
  { showMobile: true, def: 'gordura' },
  { showMobile: false, def: 'gorduraVisceral' },
  { showMobile: true, def: 'musculo' },
  { showMobile: false, def: 'idadeCorporal' },
  { showMobile: false, def: 'metabolismoBasal' },
  { showMobile: true, def: 'indiceDeMassaCorporal' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'app-medidas',
  templateUrl: './medidas.component.html',
  styleUrls: ['./medidas.component.scss']
})
export class MedidasComponent implements OnInit, OnDestroy {
  medidas$: Observable<Medida[]>;
  monstro: Monstro;
  balanca: Balanca;
  loading = true;
  disabledWrite: boolean;

  // fullDisplayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'gorduraVisceral', 'musculo',
  //   'idadeCorporal', 'metabolismoBasal', 'indiceDeMassaCorporal', 'menu'];
  // minimalDisplayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'musculo', 'indiceDeMassaCorporal', 'menu'];
  // displayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'musculo', 'idadeCorporal', 'indiceDeMassaCorporal', 'menu'];

  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private medidasService: MedidasService,
    private monstrosService: MonstrosService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.balanca = new OmronHBF214();

    this.desktopQuery = media.matchMedia('(min-width: 600px)');

    // this.desktopQueryListener = () => changeDetectorRef.detectChanges();

    this.desktopQuery.addListener(this.desktopQueryListener);
  }

  private desktopQueryListener(e: MediaQueryListEvent) {
    // this.changeDetectorRef.detectChanges();
  }

  isDesktop(): boolean {
    return this.desktopQuery.matches;
  }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const monstroId = params.get('monstroId');

        return this.monstrosService.obtemMonstroObservavel(monstroId);
      }),
      catchError((error, monstro) => {
        console.log(error);

        return of(null);
      })
    );

    this.medidas$ = monstro$.pipe(
      switchMap(monstro => {
        this.monstro = monstro;

        return this.medidasService.obtemMedidasObservaveisParaExibicao(monstro);
      })
    );

    this.medidas$.pipe(
      first()
    ).subscribe(() => {
      this.loading = false;
    });

    this.medidas$.subscribe(medidas => {
      this.dataSource = new MatTableDataSource(medidas);

      this.dataSource.sort = this.sort;
    });

    monstro$.pipe(
      first(),
      switchMap(monstro => {
        return this.monstrosService.ehVoceMesmo(monstro.id);
      }),
      switchMap(value => {
        if (value) {
          return of(true);
        } else {
          return this.monstrosService.ehAdministrador();
        }
      })
    ).subscribe(value => {
      this.disabledWrite = !value;
    });
  }

  ngOnDestroy(): void {
    this.desktopQuery.removeListener(this.desktopQueryListener);
  }

  getDisplayedColumns(): string[] {
    const isDesktop = this.isDesktop();

    // if (isMobile) {
    //   return this.minimalDisplayedColumns;
    // } else {
    //   return this.fullDisplayedColumns;
    // }

    return columnDefinitions
      .filter(cd => isDesktop || cd.showMobile)
      .map(cd => cd.def);
  }

  onAdd(): void {
    const model = MedidaViewModel.toAddViewModel(this.monstro);

    const config: MatDialogConfig<MedidaViewModel> = { data: model };

    this.dialog.open(MedidaComponent, config);
  }

  onEdit(medida: Medida): void {
    const model = MedidaViewModel.toEditViewModel(this.monstro, medida);

    const config: MatDialogConfig<MedidaViewModel> = { data: model };

    this.dialog.open(MedidaComponent, config);
  }

  onDelete(medida: Medida): void {
    this.medidasService.excluiMedida(medida.id);
  }
}
