import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesExecucaoComponent } from './series-execucao.component';

describe('SeriesExecucaoComponent', () => {
  let component: SeriesExecucaoComponent;
  let fixture: ComponentFixture<SeriesExecucaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesExecucaoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesExecucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
