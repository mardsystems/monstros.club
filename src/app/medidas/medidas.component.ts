import { Component, OnInit } from '@angular/core';
import { Medida } from './medidas.model';
import { Observable } from 'rxjs';
import { MedidasService } from './medidas.service';
import { MatTableDataSource } from '@angular/material';
// import { take } from 'rxjs/operators/take';

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];

@Component({
  selector: 'app-medidas',
  templateUrl: './medidas.component.html',
  styleUrls: ['./medidas.component.scss']
})
export class MedidasComponent implements OnInit {
  medidas$: Observable<Medida[]>;
  loading = true;
  displayedColumns: string[] = ['data', 'peso', 'gordura', 'musculo', 'idadeCorporal', 'indiceDeMassaCorporal', 'menu'];
  dataSource: any;

  constructor(
    private medidasService: MedidasService
  ) {
  }

  ngOnInit() {
    this.medidas$ = this.medidasService.obtemMedidas();

    // this.dataSource = new MatTableDataSource(this.medidas$);

    this.medidas$
      // .pipe(take(1))
      .subscribe(() => this.loading = false);
  }

  novaMedida(): void {
    const medida = new Medida();

    medida.monstroId = 'monstros/vQeCUnaAWmzr2YxP5wB1';
    medida.data = new Date();
    medida.peso = 0;
    medida.gordura = 0;
    medida.gorduraVisceral = 0;
    medida.musculo = 0;
    medida.idadeCorporal = 0;
    medida.metabolistmoBasal = 0;
    medida.indiceDeMassaCorporal = 0;

    this.medidasService.cadastraMedida(medida);
  }

  atualizaMedida(medida: Medida): void {
    // task.done = !task.done;
    this.medidasService.atualizaMedida(medida);
  }

  showDialog(medida?: Medida): void {
    // const config: MatDialogConfig<any> = (medida) ? { data: { medida } } : null;
    // this.dialog.open(TaskDialogComponent; config);
  }

  onDelete(medida: Medida): void {
    this.medidasService.excluiMedida(medida);
  }
}