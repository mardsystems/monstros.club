import { MediaMatcher } from '@angular/cdk/layout';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { CadastroDeAparelhos, CADASTRO_DE_APARELHOS } from '../aparelhos-cadastro/@aparelhos-cadastro-application.model';
import { CadastroDeAparelhoViewModel } from '../aparelhos-cadastro/@aparelhos-cadastro-presentation.model';
import { AparelhosCadastroComponent } from '../aparelhos-cadastro/aparelhos-cadastro.component';
import { ConsultaDeAparelhos, CONSULTA_DE_APARELHOS } from './aparelhos-@application.model';
import { Aparelho } from './aparelhos-@domain.model';

const columnDefinitions = [
  { showMobile: true, def: 'imagem' },
  { showMobile: true, def: 'codigo' },
  { showMobile: true, def: 'academia' },
  { showMobile: true, def: 'exercicios' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'aparelhos',
  templateUrl: './aparelhos.component.html',
  styleUrls: ['./aparelhos.component.scss']
})
export class AparelhosComponent implements OnInit {
  aparelhos$: Observable<Aparelho[]>;

  disabledWrite$: Observable<boolean>;

  dataSource: any;

  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    @Inject(CONSULTA_DE_APARELHOS)
    private consultaDeAparelhos: ConsultaDeAparelhos,
    @Inject(CADASTRO_DE_APARELHOS)
    private cadastroDeAparelhos: CadastroDeAparelhos,
    media: MediaMatcher
  ) {
    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    this.aparelhos$ = this.consultaDeAparelhos.obtemAparelhosParaAdministracao();

    this.aparelhos$.subscribe(aparelhos => {
      this.dataSource = new MatTableDataSource(aparelhos);

      this.dataSource.sort = this.sort;
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
    const model = CadastroDeAparelhoViewModel.toAddViewModel();

    const config: MatDialogConfig<CadastroDeAparelhoViewModel> = { data: model };

    this.dialog.open(AparelhosCadastroComponent, config);
  }

  onEdit(aparelho: Aparelho): void {
    const model = CadastroDeAparelhoViewModel.toEditViewModel(aparelho);

    const config: MatDialogConfig<CadastroDeAparelhoViewModel> = { data: model };

    this.dialog.open(AparelhosCadastroComponent, config);
  }

  onDelete(aparelho: Aparelho): void {
    this.cadastroDeAparelhos.excluiAparelho(aparelho.id);
  }
}
