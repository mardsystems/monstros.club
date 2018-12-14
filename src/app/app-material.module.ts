import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatToolbarModule,
  MatListModule,
  MatLineModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatSortModule } from '@angular/material/sort';

import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTableModule
  ],
  exports: [
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTableModule
  ]
})
export class AppMaterialModule { }
