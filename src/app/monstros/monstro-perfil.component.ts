import { Component, OnInit } from '@angular/core';
import { SolicitacaoDeCadastroDeMonstro } from './monstros.model';
import { MonstrosService } from './monstros.service';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-monstro-perfil',
  templateUrl: './monstro-perfil.component.html',
  styleUrls: ['./monstro-perfil.component.scss']
})
export class MonstroPerfilComponent implements OnInit {
  loading = true;
  public model: SolicitacaoDeCadastroDeMonstro = {
    isEdit: false
  };

  constructor(
    private route: ActivatedRoute,
    private monstrosService: MonstrosService
  ) { }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const monstroId = params.get('monstroId');

        return this.monstrosService.obtemMonstroObservavel(monstroId);
      }));

    monstro$.pipe(
      take(1)
    ).subscribe(() => {
      this.loading = false;
    });

    monstro$.subscribe(monstro => {
      this.model = SolicitacaoDeCadastroDeMonstro.toEdit(monstro);
    });
  }

  onSave(): void {
    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.monstrosService.atualizaMonstro(this.model.id, this.model)
        : this.monstrosService.cadastraMonstro(this.model);

    operation.then(() => {
      // this.dialogRef.close();
    });
  }
}
