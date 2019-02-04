import { Injectable } from '@angular/core';
import { ICalculoDeIdade } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class CalculoDeIdade implements ICalculoDeIdade {
  calculaIdade(data: Date): number {
    const now = new Date(Date.now());

    const calculateYear = now.getFullYear();
    const calculateMonth = now.getMonth();
    const calculateDay = now.getDate();

    const birthYear = data.getFullYear();
    const birthMonth = data.getMonth();
    const birthDay = data.getDate();

    let age = calculateYear - birthYear;
    const ageMonth = calculateMonth - birthMonth;
    const ageDay = calculateDay - birthDay;

    if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
      age = age - 1;
    }

    return age;
  }
}
