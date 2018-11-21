import { Component, OnInit } from '@angular/core';
import { Serie } from './series.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  series$: Observable<Serie[]>;
  loading = true;

  constructor() { }

  ngOnInit() {
  }

}
