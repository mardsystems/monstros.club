import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ExerciciosCadastroComponent } from '../exercicios-cadastro/exercicios-cadastro.component';
import { CadastroDeExercicioViewModel } from '../exercicios-cadastro/exercicios-cadastro.presentation-model';
import { ExerciciosCadastroService } from '../exercicios-cadastro/exercicios-cadastro.service';
import { Exercicio } from './exercicios.domain-model';
import { ExerciciosService } from './exercicios.service';

const columnDefinitions = [
  { showMobile: true, def: 'imagem' },
  { showMobile: true, def: 'codigo' },
  { showMobile: true, def: 'nome' },
  { showMobile: true, def: 'musculatura' },
  { showMobile: true, def: 'menu' },
];

@Component({
  selector: 'exercicios',
  templateUrl: './exercicios.component.html',
  styleUrls: ['./exercicios.component.scss']
})
export class ExerciciosComponent implements OnInit {
  exercicios$: Observable<Exercicio[]>;

  disabledWrite$: Observable<boolean>;

  dataSource: any;

  @ViewChild(MatSort) sort: MatSort;

  desktopQuery: MediaQueryList;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private repositorioDeExercicios: ExerciciosService,
    private cadastroDeExercicios: ExerciciosCadastroService,
    media: MediaMatcher
  ) {
    this.desktopQuery = media.matchMedia('(min-width: 600px)');
  }

  ngOnInit() {
    this.exercicios$ = this.repositorioDeExercicios.obtemExerciciosObservaveisParaAdministracao();

    this.exercicios$.subscribe(exercicios => {
      this.dataSource = new MatTableDataSource(exercicios);

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
    const model = CadastroDeExercicioViewModel.toAddViewModel();

    const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    this.dialog.open(ExerciciosCadastroComponent, config);
  }

  onEdit(exercicio: Exercicio): void {
    const model = CadastroDeExercicioViewModel.toEditViewModel(exercicio);

    const config: MatDialogConfig<CadastroDeExercicioViewModel> = { data: model };

    this.dialog.open(ExerciciosCadastroComponent, config);
  }

  onDelete(exercicio: Exercicio): void {
    this.cadastroDeExercicios.excluiExercicio(exercicio.id);
  }
}
