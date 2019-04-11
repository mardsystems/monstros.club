import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CadastroAcademiasComponent } from '../cadastro-academias/cadastro-academias.component';
import { CadastroDeAcademiaViewModel } from '../cadastro-academias/cadastro-academias.presentation-model';
import { CadastroAcademiasService } from '../cadastro-academias/cadastro-academias.service';
import { Academia } from './academias.domain-model';
import { AcademiasService } from './academias.service';

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
    private route: ActivatedRoute,
    private repositorioDeAcademias: AcademiasService,
    private cadastroDeAcademias: CadastroAcademiasService,
    media: MediaMatcher
  ) {
    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    this.academias$ = this.repositorioDeAcademias.obtemAcademiasObservaveisParaAdministracao();

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

    this.dialog.open(CadastroAcademiasComponent, config);
  }

  onEdit(academia: Academia): void {
    const model = CadastroDeAcademiaViewModel.toEditViewModel(academia);

    const config: MatDialogConfig<CadastroDeAcademiaViewModel> = { data: model };

    this.dialog.open(CadastroAcademiasComponent, config);
  }

  onDelete(academia: Academia): void {
    this.cadastroDeAcademias.excluiAcademia(academia.id);
  }
}
