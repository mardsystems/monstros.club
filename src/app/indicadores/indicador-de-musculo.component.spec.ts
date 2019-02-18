import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorDeMusculoComponent } from './indicador-de-musculo.component';

describe('IndicadorDeMusculoComponent', () => {
  let component: IndicadorDeMusculoComponent;
  let fixture: ComponentFixture<IndicadorDeMusculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorDeMusculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorDeMusculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
