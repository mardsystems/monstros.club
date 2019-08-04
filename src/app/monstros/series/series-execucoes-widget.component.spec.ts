import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesExecucoesWidgetComponent } from './series-execucoes-widget.component';

describe('SeriesExecucoesWidgetComponent', () => {
  let component: SeriesExecucoesWidgetComponent;
  let fixture: ComponentFixture<SeriesExecucoesWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesExecucoesWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesExecucoesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
