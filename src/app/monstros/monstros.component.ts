import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monstros',
  templateUrl: './monstros.component.html',
  styleUrls: ['./monstros.component.scss']
})
export class MonstrosComponent implements OnInit {
  loading = true;

  constructor() { }

  ngOnInit() {
  }

}
