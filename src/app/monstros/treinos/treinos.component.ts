import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Treino } from './treinos.domain-model';

@Component({
  selector: 'monstros-treinos',
  templateUrl: './treinos.component.html',
  styleUrls: ['./treinos.component.scss']
})
export class TreinosComponent implements OnInit {
  series$: Observable<Treino[]>;
  loading = false;

  constructor() { }

  ngOnInit() {
    return of(true).pipe(
      delay(1000),
      tap(val => this.loading = false)
    ).subscribe();
  }
}
