import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatLineModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatToolbarModule
} from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTableModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTableModule
  ]
})
export class AppMaterialModule { }
