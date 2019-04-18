import { MediaMatcher } from '@angular/cdk/layout';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { ConsultaDeMonstros, CONSULTA_DE_MONSTROS } from 'src/app/cadastro/monstros/@academias-application.model';
import { Monstro } from 'src/app/cadastro/monstros/@monstros-domain.model';
import { AdaptadorParaUserInfo } from 'src/app/cadastro/monstros/@monstros-integration.model';
import { CadastroDeMedidas, CADASTRO_DE_MEDIDAS } from '../medidas-cadastro/@medidas-cadastro-application.model';
import { CadastroDeMedidaViewModel } from '../medidas-cadastro/@medidas-cadastro-presentation.model';
import { MedidasCadastroComponent } from '../medidas-cadastro/medidas-cadastro.component';
import { ConsultaDeMedidas, CONSULTA_DE_MEDIDAS } from './@medidas-application.model';
import { Balanca, Medida, OmronHBF214 } from './@medidas-domain.model';

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
  selector: 'medidas',
  templateUrl: './medidas.component.html',
  styleUrls: ['./medidas.component.scss']
})
export class MedidasComponent implements OnInit {
  monstro: Monstro;

  medidas$: Observable<Medida[]>;

  balanca: Balanca;

  disabledWrite$: Observable<boolean>;

  dataSource: any;

  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  pesos: any[];

  percentuais: any[];

  view: any[] = [800, 400];

  colorScheme = {
    domain: ['#C7B42C', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  colorScheme2 = {
    domain: ['#5AA454', '#5AA454', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    @Inject(CADASTRO_DE_MEDIDAS)
    private cadastroDeMedidas: CadastroDeMedidas,
    @Inject(CONSULTA_DE_MEDIDAS)
    private consultaDeMedidas: ConsultaDeMedidas,
    @Inject(CONSULTA_DE_MONSTROS)
    private consultaDeMonstros: ConsultaDeMonstros,
    private adaptadorParaUserInfo: AdaptadorParaUserInfo,
    media: MediaMatcher
  ) {
    this.balanca = new OmronHBF214();

    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      // first(),
      map(params => params.get('monstroId')),
      switchMap(monstroId => this.consultaDeMonstros.obtemMonstroObservavel(monstroId)),
      catchError((error, source$) => {
        console.log(`Não foi possível montar as medidas do monstro.\nRazão:\n${error}`);

        return source$;
      }),
      shareReplay()
    );

    this.medidas$ = monstro$.pipe(
      switchMap(monstro => {
        this.monstro = monstro;

        return this.consultaDeMedidas.obtemMedidasParaExibicao(monstro);
      }),
      shareReplay()
    );

    this.medidas$.subscribe(medidas => {
      this.dataSource = new MatTableDataSource(medidas);

      this.dataSource.sort = this.sort;

      this.pesos = [
        {
          name: 'Peso',
          series: medidas.map(medida => {
            return {
              name: medida.data,
              value: medida.peso
            }
          })
        },
        // {
        //   name: 'IMC',
        //   series: medidas.map(medida => {
        //     return {
        //       name: medida.data,
        //       value: medida.indiceDeMassaCorporal
        //     }
        //   })
        // }
      ];

      this.percentuais = [
        // {
        //   name: 'Gordura',
        //   series: medidas.map(medida => {
        //     return {
        //       name: medida.data,
        //       value: medida.gordura
        //     }
        //   })
        // },
        {
          name: 'Músculo',
          series: medidas.map(medida => {
            return {
              name: medida.data,
              value: medida.musculo
            }
          })
        },
      ];
    });

    this.disabledWrite$ = monstro$.pipe(
      // first(),
      switchMap(monstro => {
        return this.adaptadorParaUserInfo.ehVoceMesmo(monstro.id);
      }),
      switchMap(value => {
        if (value) {
          return of(true);
        } else {
          return this.adaptadorParaUserInfo.ehAdministrador();
        }
      }),
      map(value => !value),
      shareReplay()
    );
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

    this.dialog.open(MedidasCadastroComponent, config);
  }

  onEdit(medida: Medida): void {
    const model = CadastroDeMedidaViewModel.toEditViewModel(this.monstro, medida);

    const config: MatDialogConfig<CadastroDeMedidaViewModel> = { data: model };

    this.dialog.open(MedidasCadastroComponent, config);
  }

  onDelete(medida: Medida): void {
    this.cadastroDeMedidas.excluiMedida(medida.id);
  }
}
