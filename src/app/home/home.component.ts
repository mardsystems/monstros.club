import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Monstro } from '../monstros/monstros.model';
import { MonstrosService } from '../monstros/monstros.service';

const columnDefinitions = [
  { def: 'col1', showMobile: true },
  { def: 'col2', showMobile: false },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  monstros$: Observable<Monstro[]>;
  loading = true;
  fullDisplayedColumns: string[] = ['foto', 'nome', 'idade', 'genero', 'altura'];
  minimalDisplayedColumns: string[] = ['foto', 'nome', 'idade', 'genero', 'altura'];
  displayedColumns: string[] = ['foto', 'nome', 'idade', 'genero', 'altura'];
  dataSource: any;
  monstroLogado$: Observable<Monstro>;
  monstroEstaLogado = false;

  @ViewChild(MatSort) sort: MatSort;

  mobileQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private monstrosService: MonstrosService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.monstroLogado$ = this.monstrosService.monstroLogado$;

    this.monstroLogado$.subscribe((monstroLogado) => {
      if (monstroLogado) {
        this.monstroEstaLogado = true;
      } else {
        this.monstroEstaLogado = false;
      }
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
    this.monstros$ = this.monstrosService.obtemMonstrosObservaveisParaExibicao();

    this.monstros$.pipe(
      first(),
    ).subscribe(() => this.loading = false);

    this.monstros$.subscribe(monstros => {
      this.dataSource = new MatTableDataSource(monstros);

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
  //   this.monstrosService.excluiMedida(medida.id);
  // }
}
