import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AparelhosExerciciosComponent } from './aparelhos-exercicios.component';

describe('ExerciciosComponent', () => {
  let component: AparelhosExerciciosComponent;
  let fixture: ComponentFixture<AparelhosExerciciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AparelhosExerciciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AparelhosExerciciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
