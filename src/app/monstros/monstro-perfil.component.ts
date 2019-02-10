import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { CalculoDeIdade } from '../app.services';
import { AuthService } from '../auth/auth.service';
import { SolicitacaoDeCadastroDeMonstro } from './monstros.model';
import { MonstrosService } from './monstros.service';

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
    private router: Router,
    public authService: AuthService,
    private monstrosService: MonstrosService,
    private calculoDeIdade: CalculoDeIdade
  ) { }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const monstroId = params.get('monstroId');

        return this.monstrosService.obtemMonstroObservavel(monstroId);
      }));

    monstro$.pipe(
      first()
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

  logout() {
    const result = this.authService.logout();

    result.then(() => {
      // this.router.navigate(['/']);
    });
  }
}
