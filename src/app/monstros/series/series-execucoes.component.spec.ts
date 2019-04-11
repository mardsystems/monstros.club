import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesExecucoesComponent } from './series-execucoes.component';

describe('SeriesExecucoesComponent', () => {
  let component: SeriesExecucoesComponent;
  let fixture: ComponentFixture<SeriesExecucoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesExecucoesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesExecucoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
