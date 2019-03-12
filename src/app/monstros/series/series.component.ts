import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Serie } from './series.domain-model';

@Component({
  selector: 'monstros-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  medidas$: Observable<Serie[]>;
  loading = false;

  constructor() { }

  ngOnInit() {
    return of(true).pipe(
      delay(1000),
      tap(val => this.loading = false)
    ).subscribe();
  }
}
