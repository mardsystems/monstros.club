import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, switchMap } from 'rxjs/operators';
import { Monstro } from '../monstros.domain-model';
import { MonstrosService } from '../monstros.service';
import { CadastroComponent } from './cadastro/cadastro.component';
import { CadastroDeMedidaViewModel } from './cadastro/cadastro.presentation-model';
import { Balanca, Medida, OmronHBF214 } from './medidas.domain-model';
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
  selector: 'monstros-medidas',
  templateUrl: './medidas.component.html',
  styleUrls: ['./medidas.component.scss']
})
export class MedidasComponent implements OnInit {
  medidas$: Observable<Medida[]>;
  monstro: Monstro;
  balanca: Balanca;
  loading = true;
  disabledWrite: boolean;

  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private medidasService: MedidasService,
    private monstrosService: MonstrosService,
    media: MediaMatcher
  ) {
    this.balanca = new OmronHBF214();

    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const monstroId = params.get('monstroId');

        return this.monstrosService.obtemMonstroObservavel(monstroId);
      }),
      catchError((error, monstro) => {
        console.log(`Não foi possível montar as medidas do monstro.\nRazão:\n${error}`);

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
    ).subscribe(() => this.loading = false);

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

  get isDesktop(): boolean {
    return this.desktopQuery.matches;
  }

  getDisplayedColumns(): string[] {
    const isDesktop = this.isDesktop;

    const displayedColumns = columnDefinitions
      .filter(cd => isDesktop || cd.showMobile)
      .map(cd => cd.def);

    return displayedColumns;
  }

  onAdd(): void {
    const model = CadastroDeMedidaViewModel.toAddViewModel(this.monstro);

    const config: MatDialogConfig<CadastroDeMedidaViewModel> = { data: model };

    this.dialog.open(CadastroComponent, config);
  }

  onEdit(medida: Medida): void {
    const model = CadastroDeMedidaViewModel.toEditViewModel(this.monstro, medida);

    const config: MatDialogConfig<CadastroDeMedidaViewModel> = { data: model };

    this.dialog.open(CadastroComponent, config);
  }

  onDelete(medida: Medida): void {
    this.medidasService.excluiMedida(medida.id);
  }
}
