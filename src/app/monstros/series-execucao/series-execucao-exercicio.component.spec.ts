import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesExecucaoExercicioComponent } from './series-execucao-exercicio.component';

describe('SeriesExecucaoExercicioComponent', () => {
  let component: SeriesExecucaoExercicioComponent;
  let fixture: ComponentFixture<SeriesExecucaoExercicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesExecucaoExercicioComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesExecucaoExercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
