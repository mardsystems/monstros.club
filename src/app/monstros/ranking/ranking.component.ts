import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Balanca, OmronHBF214, Medida } from '../medidas/medidas.model';
import { MedidasService } from '../medidas/medidas.service';
import { Monstro } from '../monstros.model';
import { MonstrosService } from '../monstros.service';

const columnDefinitions = [
  { def: 'col1', showMobile: true },
  { def: 'col2', showMobile: false },
];

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  medidas$: Observable<Medida[]>;
  balanca: Balanca;
  // medidaSelecionada: Medida;
  loading = true;
  fullDisplayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'gorduraVisceral', 'musculo',
    'idadeCorporal', 'metabolismoBasal', 'indiceDeMassaCorporal'];
  minimalDisplayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'musculo', 'indiceDeMassaCorporal'];
  displayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'musculo', 'idadeCorporal', 'indiceDeMassaCorporal'];
  dataSource: any;

  monstroId: string;
  monstroLogado: Monstro;

  @ViewChild(MatSort) sort: MatSort;

  mobileQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private monstrosService: MonstrosService,
    private medidasService: MedidasService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.monstrosService.monstroLogado$.subscribe((monstroLogado) => {
      this.monstroLogado = monstroLogado;
    });

    this.balanca = new OmronHBF214();
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
    this.medidas$ = this.medidasService.obtemMedidasObservaveisParaRanking();

    this.medidas$.pipe(
      take(1)
    ).subscribe(() => this.loading = false);

    this.medidas$.subscribe(medidas => {
      this.dataSource = new MatTableDataSource(medidas);

      this.dataSource.sort = this.sort;
    });
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

  // onAdd(): void {
  //   const model = SolicitacaoDeCadastroDeMedida.toAdd(this.monstroId);

  //   const config: MatDialogConfig<SolicitacaoDeCadastroDeMedida> = { data: model };

  //   this.dialog.open(MedidaComponent, config);
  // }

  // onEdit(medida: Medida): void {
  //   const model = SolicitacaoDeCadastroDeMedida.toEdit(medida);

  //   const config: MatDialogConfig<SolicitacaoDeCadastroDeMedida> = { data: model };

  //   this.dialog.open(MedidaComponent, config);
  // }

  // onDelete(medida: Medida): void {
  //   this.medidasService.excluiMedida(medida.id);
  // }
}
