import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthMaterialModule } from './auth-material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

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
export class AuthModule {
  constructor() { }
}
