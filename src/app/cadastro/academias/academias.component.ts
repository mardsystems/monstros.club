import { MediaMatcher } from '@angular/cdk/layout';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { CadastroDeAcademias, CADASTRO_DE_ACADEMIAS } from '../academias-cadastro/@academias-cadastro-application.model';
import { CadastroDeAcademiaViewModel } from '../academias-cadastro/@academias-cadastro-presentation.model';
import { AcademiasCadastroComponent } from '../academias-cadastro/academias-cadastro.component';
import { ConsultaDeAcademias, CONSULTA_DE_ACADEMIAS } from './academias-@application.model';
import { Academia } from './@academias-domain.model';

const columnDefinitions = [
  { showMobile: true, def: 'logo' },
  { showMobile: true, def: 'nome' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'academias',
  templateUrl: './academias.component.html',
  styleUrls: ['./academias.component.scss']
})
export class AcademiasComponent implements OnInit {
  academias$: Observable<Academia[]>;

  disabledWrite$: Observable<boolean>;

  dataSource: any;

  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    @Inject(CONSULTA_DE_ACADEMIAS)
    private consultaDeAcademias: ConsultaDeAcademias,
    @Inject(CADASTRO_DE_ACADEMIAS)
    private cadastroDeAcademias: CadastroDeAcademias,
    media: MediaMatcher
  ) {
    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    this.academias$ = this.consultaDeAcademias.obtemAcademiasParaAdministracao();

    this.academias$.subscribe(academias => {
      this.dataSource = new MatTableDataSource(academias);

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
    const model = CadastroDeAcademiaViewModel.toAddViewModel();

    const config: MatDialogConfig<CadastroDeAcademiaViewModel> = { data: model };

    this.dialog.open(AcademiasCadastroComponent, config);
  }

  onEdit(academia: Academia): void {
    const model = CadastroDeAcademiaViewModel.toEditViewModel(academia);

    const config: MatDialogConfig<CadastroDeAcademiaViewModel> = { data: model };

    this.dialog.open(AcademiasCadastroComponent, config);
  }

  onDelete(academia: Academia): void {
    this.cadastroDeAcademias.excluiAcademia(academia.id);
  }
}
