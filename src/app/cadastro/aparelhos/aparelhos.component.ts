import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LogService } from 'src/app/app-common.services';
import { Aparelho } from './aparelhos.domain-model';
import { AparelhosService } from './aparelhos.service';
import { CadastroComponent } from './cadastro/cadastro.component';
import { CadastroDeAparelhoViewModel } from './cadastro/cadastro.presentation-model';

const columnDefinitions = [
  { showMobile: true, def: 'imagem' },
  { showMobile: true, def: 'codigo' },
  { showMobile: true, def: 'academia' },
  { showMobile: true, def: 'exercicios' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'cadastro-de-aparelhos',
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
    private route: ActivatedRoute,
    private aparelhosService: AparelhosService,
    private log: LogService,
    media: MediaMatcher
  ) {
    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    this.aparelhos$ = this.aparelhosService.obtemAparelhosObservaveisParaAdministracao();

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

    this.dialog.open(CadastroComponent, config);
  }

  onEdit(aparelho: Aparelho): void {
    const model = CadastroDeAparelhoViewModel.toEditViewModel(aparelho);

    const config: MatDialogConfig<CadastroDeAparelhoViewModel> = { data: model };

    this.dialog.open(CadastroComponent, config);
  }

  onDelete(aparelho: Aparelho): void {
    this.aparelhosService.excluiAparelho(aparelho.id);
  }
}
