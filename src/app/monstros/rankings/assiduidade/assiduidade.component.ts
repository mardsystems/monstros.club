import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'assiduidade-de-medidas',
  templateUrl: './assiduidade.component.html',
  styleUrls: ['./assiduidade.component.scss']
})
export class AssiduidadeComponent implements OnInit {
  @Input() ehUltimaMedida: boolean;

  constructor() { }

  ngOnInit() {
  }
}
