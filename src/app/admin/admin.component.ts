import { Component, OnInit } from '@angular/core';
import { MedidasService } from '../monstros/medidas/medidas.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(
    private medidasService: MedidasService
  ) {

  }

  ngOnInit() {
  }

  importaMedidas() {
    this.medidasService.importaMedidas();
  }
}
