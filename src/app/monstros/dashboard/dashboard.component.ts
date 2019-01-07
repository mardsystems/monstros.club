import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Component({
  selector: 'monstros-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;

  constructor() { }

  ngOnInit() {
    return of(true).pipe(
      delay(1000),
      tap(val => this.loading = false)
    ).subscribe();
  }
}
