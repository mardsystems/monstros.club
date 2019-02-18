import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { Serie } from './series.model';

@Component({
  selector: 'monstros-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  series$: Observable<Serie[]>;
  loading = true;

  constructor() { }

  ngOnInit() {
    return of(true).pipe(
      delay(1000),
      tap(val => this.loading = false)
    ).subscribe();
  }
}
