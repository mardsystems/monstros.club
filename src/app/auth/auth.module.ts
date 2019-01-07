import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';

import { AuthMaterialModule } from './auth-material.module';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthMaterialModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class AuthModule { }
