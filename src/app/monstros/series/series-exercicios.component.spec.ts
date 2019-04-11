import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesExerciciosComponent } from './series-exercicios.component';

describe('SeriesExerciciosComponent', () => {
  let component: SeriesExerciciosComponent;
  let fixture: ComponentFixture<SeriesExerciciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesExerciciosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesExerciciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
