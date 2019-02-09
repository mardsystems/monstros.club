import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { CalculoDeIdade } from 'src/app/app.services';
import { Monstro } from '../monstros.model';
import { MonstrosService } from '../monstros.service';
import { MedidaComponent, MedidaViewModel } from './medida.component';
import { Balanca, OmronHBF214, Medida } from './medidas.model';
import { MedidasService } from './medidas.service';

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
  balanca: Balanca;
  loading = true;
  fullDisplayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'gorduraVisceral', 'musculo',
    'idadeCorporal', 'metabolismoBasal', 'indiceDeMassaCorporal', 'menu'];
  minimalDisplayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'musculo', 'indiceDeMassaCorporal', 'menu'];
  displayedColumns: string[] = ['foto', 'data', 'peso', 'gordura', 'musculo', 'idadeCorporal', 'indiceDeMassaCorporal', 'menu'];
  dataSource: any;

  monstroId: string;
  monstro: Monstro;

  @ViewChild(MatSort) sort: MatSort;

  mobileQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private monstrosService: MonstrosService,
    private medidasService: MedidasService,
    private calculoDeIdade: CalculoDeIdade,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // this.monstrosService.monstroLogado$.subscribe((monstroLogado) => {
    //   this.monstroLogado = monstroLogado;
    // });

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
    this.medidas$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.monstroId = params.get('monstroId');

        return this.monstrosService.obtemMonstroObservavel(this.monstroId);
      }),
      switchMap(monstro => {
        this.monstro = monstro;

        return this.medidasService.obtemMedidasObservaveisParaExibicao(monstro);
      })
    );

    this.medidas$.pipe(
      take(1)
    ).subscribe(() => {
      this.loading = false;
    });

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

  // atualizaMedida(medida: Medida): void {
  //   // task.done = !task.done;
  //   this.medidasService.atualizaMedida(medida);
  // }

  onAdd(): void {
    const idade = this.calculoDeIdade.calculaIdade(this.monstro.dataDeNascimento);

    const genero = this.monstro.genero;

    if (this.monstro.id !== this.monstroId) {
      return;
    }

    const model = MedidaViewModel.toAddViewModel(this.monstro, idade, genero);

    const config: MatDialogConfig<MedidaViewModel> = { data: model };

    this.dialog.open(MedidaComponent, config);
  }

  onEdit(medida: Medida): void {
    const idade = this.calculoDeIdade.calculaIdade(this.monstro.dataDeNascimento);

    const genero = this.monstro.genero;

    if (this.monstro.id !== this.monstroId) {
      return;
    }

    const model = MedidaViewModel.toEditViewModel(this.monstro, medida, idade, genero);

    const config: MatDialogConfig<MedidaViewModel> = { data: model };

    this.dialog.open(MedidaComponent, config);
  }

  onDelete(medida: Medida): void {
    this.medidasService.excluiMedida(medida.id);
  }
}
